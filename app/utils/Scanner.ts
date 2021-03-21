import { DriveItem } from '@microsoft/microsoft-graph-types';
import Database from './Database';
import Graph from './Graph';
import { ItemModel } from '../../types/Schema';
import Authentication from './Authentication';
import PhotoLoader from './PhotoLoader';

class ScannerManualAbortError extends Error {
  toString() {
    return 'ScannerManualAbortError';
  }
}

function parseDateString(dateString: string): [number, string] {
  const dateTimeRegExp = /(\d{4})[_-](\d{2})[_-](\d{2})(_|-|\s)(\d{2})(_|-|:)(\d{2})([^\n]*)/;
  const dateRegExp = /(\d{4})[_-](\d{2})[_-](\d{2})([^\n]*)/;
  const yearRegExp = /(\d{4})([^\n]*)/;

  let date = Infinity;
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
  } else if (yearRegExp.test(dateString)) {
    const [, year, rest] = yearRegExp.exec(dateString) as string[];
    date = new Date(`${year}-01-01`).getTime();
    trimmedString = rest.trim();
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
    onStatusUpdate: (lastScannedItem?: ItemModel) => void,
  ) => {
    async function synchronizeItem(
      driveItem: DriveItem,
      driveItemParent: DriveItem,
      driveItemSiblings: DriveItem[],
    ) {
      const databaseItem = await Database.selectItem(driveItem.id as string);
      const lastModifiedDateTime = new Date(
        driveItem.lastModifiedDateTime as string,
      ).getTime();

      if (databaseItem && databaseItem.updateTime === lastModifiedDateTime) {
        return;
      }

      const children = driveItem.folder?.childCount
        ? (await Graph.getItemChildren(driveItem.id as string)).reverse()
        : [];

      const removedChildren = (
        await Database.selectItemsFromParentItemId(driveItem.id as string)
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
        const thumbnails = await Graph.getItemThumbnails(
          driveItem.id as string,
        );

        const thumbnailURI = (thumbnails.large?.url ||
          thumbnails.medium?.url ||
          thumbnails.small?.url) as string;

        const dateTime: number =
          (await (async function () {
            const metadataFile = driveItemSiblings.find(
              (siblingItem) => siblingItem.name === `${driveItem.name}.xmp`,
            ) as { '@microsoft.graph.downloadUrl': string } | undefined;

            if (!metadataFile) {
              return 0;
            }

            try {
              const metadata = new DOMParser().parseFromString(
                await fetch(
                  metadataFile['@microsoft.graph.downloadUrl'],
                ).then((response) => response.text()),
                'text/xml',
              );

              const rdfDescription = metadata
                .getElementsByTagName('rdf:Description')
                .item(0);

              if (!rdfDescription) {
                return 0;
              }

              const attributeName = [
                'xmp:MetadataDate',
                'xmp:ModifyDate',
                'xmp:CreateDate',
                'exif:DateTimeOriginal',
                'tiff:DateTime',
                'video:ModificationDate',
                'video:DateTimeOriginal',
                'photoshop:DateCreated',
              ].find((name) => rdfDescription.getAttribute(name));

              if (!attributeName) {
                return 0;
              }

              return new Date(
                rdfDescription.getAttribute(attributeName) as string,
              ).getTime();
            } catch (error) {
              return 0;
            }
          })()) ||
          new Date(
            driveItem.photo?.takenDateTime ||
              driveItem.createdDateTime ||
              lastModifiedDateTime,
          ).getTime();

        await PhotoLoader.addPhotoThumbnail(
          driveItem.id as string,
          thumbnailURI,
        );

        await Database.addPhoto({
          itemId: driveItem.id as string,
          parentItemId: driveItemParent.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
          dateTime,
          albumItemId: driveItemParent.id as string,
          width: (driveItem.image?.width || driveItem.video?.width) as number,
          height: (driveItem.image?.height ||
            driveItem.video?.height) as number,
          isVideo: !!driveItem.video,
        });
      } else if (children.some((child) => driveItemIsPhoto(child))) {
        const [dateTime, title] = parseDateString(driveItem.name as string);

        await Database.addAlbum({
          itemId: driveItem.id as string,
          parentItemId: driveItemParent.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
          title,
          dateTime,
          coverItemId: (children.find((child) =>
            driveItemIsPhoto(child),
          ) as DriveItem).id as string,
        });
      } else {
        await Database.addItem({
          itemId: driveItem.id as string,
          parentItemId: driveItemParent.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
        });
      }

      onStatusUpdate(await Database.selectItem(driveItem.id as string));
    }

    await Authentication.getFreshAccessToken().then(() =>
      Graph.getItem(driveItemId).then((driveItem) =>
        synchronizeItem(driveItem, driveItem, []),
      ),
    );
  },
};

export default Scanner;
