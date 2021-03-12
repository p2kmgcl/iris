import { DriveItem } from '@microsoft/microsoft-graph-types';
import Database from './Database';
import Graph from './Graph';
import { PhotoModel } from '../../types/Schema';

class ScannerManualAbortError extends Error {
  toString() {
    return 'ScannerManualAbortError';
  }
}

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

const Scanner = {
  scan: async (
    driveItemId: string,
    abortSignal: AbortSignal,
    onStatusUpdate: (lastScannedPhoto: PhotoModel | null) => void,
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
        if (abortSignal.aborted) throw new ScannerManualAbortError();
      }

      if (driveItemIsPhoto(driveItem)) {
        const thumbnails = await Graph.getItemThumbnails(
          driveItem.id as string,
        );

        const thumbnailURI = (thumbnails.large?.url ||
          thumbnails.medium?.url ||
          thumbnails.small?.url) as string;

        const dateTime: number = new Date(
          driveItem.photo?.takenDateTime ||
            driveItem.createdDateTime ||
            lastModifiedDateTime,
        ).getTime();

        await Database.addPhoto({
          itemId: driveItem.id as string,
          parentItemId: driveItemParent.id as string,
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
        const title = driveItem.name as string;
        const dateTime = Infinity;

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
      } else if (getMetadataFilePhoto(driveItem, driveItemSiblings)) {
        const photoItem = getMetadataFilePhoto(
          driveItem,
          driveItemSiblings,
        ) as DriveItem;

        await Database.addMetadataFile({
          photoItemId: photoItem.id as string,
          itemId: driveItem.id as string,
          parentItemId: driveItemParent.id as string,
          fileName: driveItem.name as string,
          updateTime: lastModifiedDateTime,
          contentURI: (driveItem as { '@microsoft.graph.downloadUrl': string })[
            '@microsoft.graph.downloadUrl'
          ],
        });
      } else {
        await Database.addItem({
          itemId: driveItem.id as string,
          parentItemId: driveItemParent.id as string,
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

export default Scanner;
