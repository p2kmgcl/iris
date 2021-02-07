import { DriveItem } from '@microsoft/microsoft-graph-types';
import fastXMLParser from 'fast-xml-parser';
import { Database } from './Database';
import { Graph } from './Graph';

export class AbortError extends Error {
  toString() {
    return 'AbortError';
  }
}

export const Scanner = {
  scan: async (
    driveItemId: string,
    abortSignal: AbortSignal,
    onStatusUpdate: (status: string) => void,
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

      onStatusUpdate(`${driveItemParent.name}/${driveItem.name}`);

      if (driveItemIsPhoto(driveItem)) {
        const thumbnailURI = (
          await Graph.getItemThumbnails(driveItem.id as string)
        ).medium?.url as string;

        const dateTime: number = await (async function () {
          try {
            const metadataFile = driveItemSiblings.find(
              (item) => item.name === `${driveItem.name}.xmp`,
            ) as {
              '@microsoft.graph.downloadUrl': string;
            };

            const metadata = fastXMLParser.parse(
              await fetch(
                metadataFile['@microsoft.graph.downloadUrl'],
              ).then((response) => response.text()),
              {
                attributeNamePrefix: '',
                ignoreAttributes: false,
              },
            ) as {
              'x:xmpmeta': {
                'rdf:RDF': {
                  'rdf:Description': { 'xmp:CreateDate': string };
                };
              };
            };

            const createDateTime =
              metadata['x:xmpmeta']['rdf:RDF']['rdf:Description'][
                'xmp:CreateDate'
              ];

            if (!createDateTime) {
              throw new Error();
            }

            return new Date(createDateTime).getTime();
          } catch (_) {
            return new Date(
              driveItem.photo?.takenDateTime ||
                driveItem.createdDateTime ||
                lastModifiedDateTime,
            ).getTime();
          }
        })();

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

function driveItemIsPhoto(driveItem: DriveItem) {
  return !!(driveItem.video?.width || driveItem.image?.width);
}
