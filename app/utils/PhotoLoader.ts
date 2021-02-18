import Database from './Database';

const CHUNK_SIZE = 30;

const cache: {
  albumId: string | null;
  chunks: Array<Promise<Array<{ itemId: string; thumbnailURL: string }>>>;
} = {
  albumId: null,
  chunks: [],
};

const PhotoLoader = {
  fromIndex: async (index: number, albumId: string | null = null) => {
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
          photos.map((photo) => {
            const thumbnailURL = URL.createObjectURL(
              new File([photo.thumbnail.arrayBuffer], photo.itemId, {
                type: photo.thumbnail.contentType,
              }),
            );

            return { itemId: photo.itemId, thumbnailURL };
          }),
      );

    return cache.chunks[chunkIndex].then((chunk) => chunk[photoIndex]);
  },
};

export default PhotoLoader;
