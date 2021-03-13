import Graph from './Graph';

const PhotoLoader = {
  addPhotoThumbnail: async (itemId: string, thumbnailURI: string) => {
    await fetch(PhotoLoader.getPhotoThumbnailURL(itemId), {
      method: 'PUT',
      body: JSON.stringify({
        thumbnailURI,
      }),
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
    });
  },

  removePhotoThumbnail: async (itemId: string) => {
    await fetch(PhotoLoader.getPhotoThumbnailURL(itemId), {
      method: 'DELETE',
    }).catch(() => {});
  },

  getPhotoThumbnailURL: (itemId: string) => {
    return `/thumbnail?itemId=${encodeURIComponent(itemId)}`;
  },

  clearThumbnailCache: async () => {
    await fetch('/thumbnail/clear');
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
