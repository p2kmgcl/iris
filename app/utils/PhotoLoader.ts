import Database from './Database';
import { Photo } from '../../types/Schema';
import Graph from './Graph';

const CHUNK_SIZE = 30;

export interface LoadedPhoto extends Photo {
  thumbnailURL: string;
}

const cache: {
  albumId: string | null;
  chunks: Promise<LoadedPhoto[]>[];
} = {
  albumId: null,
  chunks: [],
};

const PhotoLoader = {
  getLoadedPhotoFromIndex: async (
    index: number,
    albumId: string | null = null,
  ) => {
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
      Database.selectPhotosFromIndex(index, index + CHUNK_SIZE, albumId).then(
        (photos) =>
          photos.map((photo) => ({
            ...photo,
            thumbnailURL: URL.createObjectURL(
              new File([photo.thumbnail.arrayBuffer], photo.itemId, {
                type: photo.thumbnail.contentType,
              }),
            ),
          })),
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
