import Database from './Database';
import Graph from './Graph';
import { LoadedPhotoModel } from '../../types/LoadedPhotoModel';
import { ThumbnailModel } from '../../types/Schema';

const CHUNK_SIZE = 30;

const cache: {
  albumId?: string;
  chunks: Promise<LoadedPhotoModel[]>[];
} = {
  chunks: [],
};

const PhotoLoader = {
  getLoadedPhotoFromIndex: async (index: number, albumId?: string) => {
    if (cache.albumId !== albumId) {
      cache.albumId = albumId;

      cache.chunks.forEach((chunkPromise) =>
        chunkPromise.then((chunk) =>
          chunk.forEach((photo) => {
            URL.revokeObjectURL(photo.thumbnailURL);
          }),
        ),
      );

      cache.chunks = [];
    }

    const chunkIndex = Math.floor(index / CHUNK_SIZE);
    const photoIndex = index % CHUNK_SIZE;

    cache.chunks[chunkIndex] =
      cache.chunks[chunkIndex] ||
      Database.selectPhotoList(albumId).then((photos) =>
        Promise.all(
          photos.slice(index, index + CHUNK_SIZE).map(async (photo) => {
            const thumbnail = (await Database.selectThumbnail(
              photo.itemId,
            )) as ThumbnailModel;

            return {
              ...photo,
              thumbnailURL: URL.createObjectURL(
                new File([thumbnail.arrayBuffer], photo.itemId, {
                  type: thumbnail.contentType,
                }),
              ),
            };
          }),
        ),
      );

    return cache.chunks[chunkIndex].then((chunk) => chunk[photoIndex]);
  },

  getDownloadURLFromItemId: async (itemId: string) => {
    return Graph.getItem(itemId).then(
      (item) =>
        (item as { '@microsoft.graph.downloadUrl'?: string })[
          '@microsoft.graph.downloadUrl'
        ] || '',
    );
  },
};

export default PhotoLoader;
