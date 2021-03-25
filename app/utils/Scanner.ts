import { DriveItem } from '@microsoft/microsoft-graph-types';
import Database from './Database';
import Graph from './Graph';
import Authentication from './Authentication';
import PhotoLoader from './PhotoLoader';
import { Metadata } from './Metadata';

const DEFAULT_DATE = -Infinity;

class ScannerManualAbortError extends Error {
  toString() {
    return 'ScannerManualAbortError';
  }
}

function parseDateString(dateString: string): [number, string] {
  const dateTimeRegExp = /^(\d{4})[_-](\d{2})[_-](\d{2})(_|-|\s)(\d{2})(_|-|:)(\d{2})([^\n]*)$/;
  const dateRegExp = /^(\d{4})[_-](\d{2})[_-](\d{2})([^\n]*)$/;
  const datePrefixRegExp = /^[a-z]{3}[_-](\d{4})[_-]?(\d{2})[_-]?(\d{2})[_-]([^\n]*)$/i;
  const yearRegExp = /^(\d{4})(_|-|:|\s)([^\n]*)$/;

  let date = DEFAULT_DATE;
  let trimmedString = dateString;

  if (dateTimeRegExp.test(dateString)) {
    const [, year, month, day, , hour, , minute, rest] = dateTimeRegExp.exec(
      dateString,
    ) as string[];
    date = new Date(`${year}-${month}-${day} ${hour}:${minute}`).getTime();
    trimmedString = rest.trim();
  } else if (dateRegExp.test(dateString)) {
    const [, year, month, day, rest] = dateRegExp.exec(dateString) as string[];
    date = new Date(`${year}-${month}-${day}`).getTime();
    trimmedString = rest.trim();
  } else if (datePrefixRegExp.test(dateString)) {
    const [, year, month, day, rest] = datePrefixRegExp.exec(
      dateString,
    ) as string[];
    date = new Date(`${year}-${month}-${day}`).getTime();
    trimmedString = rest.trim();
  } else if (yearRegExp.test(dateString)) {
    const [, year, rest] = yearRegExp.exec(dateString) as string[];
    date = new Date(`${year}-01-01`).getTime();
    trimmedString = rest.trim();
  } else if (dateString.length === 4 && !isNaN(parseInt(dateString, 10))) {
    date = new Date(`${parseInt(dateString, 10)}-01-01`).getTime();
    trimmedString = dateString;
  }

  return [date, trimmedString || dateString];
}

function driveItemIsPhoto(driveItem: DriveItem) {
  return !!(driveItem.video?.width || driveItem.image?.width);
}

const Scanner = {
  scan: async (
    driveItemId: string,
    abortSignal: AbortSignal,
    onStatusUpdate: (lastScannedItem?: string) => void,
  ) => {
    async function synchronizeItem(
      driveItem: DriveItem,
      driveItemParent: DriveItem,
      driveItemSiblings: DriveItem[],
    ) {
      if (!driveItem.id || !driveItem.name || !driveItemParent.id) {
        return;
      }

      const databaseItem = await Database.selectItem(driveItem.id);
      const lastModifiedDateTime = driveItem.lastModifiedDateTime
        ? new Date(driveItem.lastModifiedDateTime).getTime()
        : DEFAULT_DATE;

      if (databaseItem && databaseItem.updateTime === lastModifiedDateTime) {
        if (!driveItemIsPhoto(driveItem)) {
          return;
        }

        const metadataFile = driveItemSiblings.find(
          (siblingItem) => siblingItem.name === `${driveItem.name}.xmp`,
        );

        if (!metadataFile || !metadataFile.id) {
          return;
        }

        const databaseMetadataFile = await Database.selectItem(metadataFile.id);
        const metadataFileDate = metadataFile.lastModifiedDateTime
          ? new Date(metadataFile.lastModifiedDateTime).getTime()
          : DEFAULT_DATE;

        if (
          databaseMetadataFile &&
          databaseMetadataFile.updateTime === metadataFileDate
        ) {
          return;
        }
      }

      const children = driveItem.folder?.childCount
        ? (await Graph.getItemChildren(driveItem.id)).sort(
            (a, b) =>
              new Date(b.lastModifiedDateTime || '').getTime() -
              new Date(a.lastModifiedDateTime || '').getTime(),
          )
        : [];

      const removedChildren = (
        await Database.selectItemsFromParentItemId(driveItem.id)
      ).filter((storedChild) =>
        children.every((child) => child.id !== storedChild.itemId),
      );

      for (const removedChild of removedChildren) {
        await Database.removeItem(removedChild.itemId);
        await PhotoLoader.removePhotoThumbnail(removedChild.itemId);
      }

      for (const child of children) {
        await synchronizeItem(child, driveItem, children);
        if (abortSignal.aborted) throw new ScannerManualAbortError();
      }

      if (driveItemIsPhoto(driveItem)) {
        await PhotoLoader.addPhotoThumbnail(
          driveItem.id,
          await (async function () {
            const thumbnails = await Graph.getItemThumbnails(
              driveItem.id as string,
            );

            return (
              thumbnails.large?.url ||
              thumbnails.medium?.url ||
              thumbnails.small?.url ||
              ''
            );
          })(),
        );

        await Database.addPhoto({
          itemId: driveItem.id,
          parentItemId: driveItemParent.id,
          fileName: driveItem.name,
          updateTime: lastModifiedDateTime,
          dateTime: await (async function () {
            let date = DEFAULT_DATE;

            const metadataFile = driveItemSiblings.find(
              (siblingItem) => siblingItem.name === `${driveItem.name}.xmp`,
            );

            if (metadataFile) {
              date = Metadata.getDateFromString(
                await fetch(
                  (metadataFile as { '@microsoft.graph.downloadUrl': string })[
                    '@microsoft.graph.downloadUrl'
                  ],
                ).then((response) => response.text()),
              );
            }

            if (
              !isFinite(date) &&
              typeof driveItem.photo?.takenDateTime === 'string'
            ) {
              date = new Date(driveItem.photo.takenDateTime).getTime();
            }

            if (!isFinite(date)) {
              date = parseDateString(driveItem.name as string)[0];
            }

            if (
              !isFinite(date) &&
              typeof driveItem.createdDateTime === 'string'
            ) {
              date = new Date(driveItem.createdDateTime).getTime();
            }

            return date;
          })(),
          albumItemId: driveItemParent.id,
          width: driveItem.image?.width || driveItem.video?.width || 0,
          height: driveItem.image?.height || driveItem.video?.height || 0,
          isVideo: !!driveItem.video,
          location: await (async function () {
            let location;

            const metadataFile = driveItemSiblings.find(
              (siblingItem) => siblingItem.name === `${driveItem.name}.xmp`,
            );

            if (metadataFile) {
              location = Metadata.getLocationFromString(
                await fetch(
                  (metadataFile as { '@microsoft.graph.downloadUrl': string })[
                    '@microsoft.graph.downloadUrl'
                  ],
                ).then((response) => response.text()),
              );
            }

            if (
              !location &&
              driveItem.location &&
              typeof driveItem.location.latitude === 'number' &&
              typeof driveItem.location.longitude === 'number'
            ) {
              location = {
                altitude: driveItem.location.longitude || 0,
                latitude: driveItem.location.latitude,
                longitude: driveItem.location.longitude,
              };
            }

            return location;
          })(),
        });
      } else if (children.some((child) => driveItemIsPhoto(child))) {
        const [dateTime, title] = parseDateString(driveItem.name);

        await Database.addAlbum({
          itemId: driveItem.id,
          parentItemId: driveItemParent.id,
          updateTime: lastModifiedDateTime,
          title,
          dateTime,
          coverItemId:
            children.find((child) => driveItemIsPhoto(child))?.id || '',
        });
      } else {
        await Database.addItem({
          itemId: driveItem.id,
          parentItemId: driveItemParent.id,
          updateTime: lastModifiedDateTime,
        });
      }

      onStatusUpdate(`${driveItemParent.name}/${driveItem.name as string}`);
    }

    await Authentication.getFreshAccessToken().then(() =>
      Graph.getItem(driveItemId).then((driveItem) =>
        synchronizeItem(driveItem, driveItem, []),
      ),
    );
  },
};

export default Scanner;
