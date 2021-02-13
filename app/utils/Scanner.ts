import { DriveItem } from '@microsoft/microsoft-graph-types';
import { Database } from './Database';
import { Graph } from './Graph';
import { Photo } from '../../types/Schema';

export class AbortError extends Error {
  toString() {
    return 'AbortError';
  }
}

export const Scanner = {
  scan: async (
    driveItemId: string,
    abortSignal: AbortSignal,
    onStatusUpdate: (lastScannedPhoto: Photo | null) => void,
  ) => {
    async function scanItem(
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
        ? await Graph.getItemChildren(driveItem.id as string)
        : [];

      for (const child of children) {
        await scanItem(child, driveItem, children);
        if (abortSignal.aborted) throw new AbortError();
      }

      if (driveItemIsPhoto(driveItem)) {
        const thumbnailURI = (
          await Graph.getItemThumbnails(driveItem.id as string)
        ).medium?.url as string;

        const dateTime: number = new Date(
          driveItem.photo?.takenDateTime ||
            driveItem.createdDateTime ||
            lastModifiedDateTime,
        ).getTime();

        await Database.addPhoto({
          itemId: driveItem.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
          thumbnailURI,
          dateTime,
          albumItemId: driveItemParent.id as string,
          width: (driveItem.image?.width || driveItem.video?.width) as number,
          height: (driveItem.image?.height ||
            driveItem.video?.height) as number,
          isVideo: !!driveItem.video,
        });

        onStatusUpdate(await Database.selectPhoto(driveItem.id as string));
      } else if (children.some((child) => driveItemIsPhoto(child))) {
        const titleRegExp = /^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})\s([^\n]+)$/;
        let title = driveItem.name as string;
        let dateTime: number | undefined = undefined;

        if (titleRegExp.test(title)) {
          const [, dateText, titleText] = titleRegExp.exec(title) as string[];
          title = titleText;
          dateTime = new Date(dateText).getTime();
        }

        await Database.addAlbum({
          itemId: driveItem.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
          title,
          dateTime,
        });
      } else if (getMetadataFilePhoto(driveItem, driveItemSiblings)) {
        const photoItem = getMetadataFilePhoto(
          driveItem,
          driveItemSiblings,
        ) as DriveItem;

        await Database.addMetadataFile({
          photoItemId: photoItem.id as string,
          itemId: driveItem.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
        });
      } else {
        await Database.addItem({
          itemId: driveItem.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
        });
      }
    }

    await Graph.getItem(driveItemId).then((driveItem) =>
      scanItem(driveItem, driveItem, []),
    );
  },
};

function getMetadataFilePhoto(
  driveItem: DriveItem,
  driveItemSiblings: DriveItem[],
) {
  const photoName = driveItem.name?.replace(/\.xmp$/i, '') ?? '';

  return (
    (photoName &&
      photoName !== driveItem.name &&
      driveItemSiblings.find(
        (sibling) => sibling.name && sibling.name === photoName,
      )) ??
    null
  );
}

function driveItemIsPhoto(driveItem: DriveItem) {
  return !!(driveItem.video?.width || driveItem.image?.width);
}
