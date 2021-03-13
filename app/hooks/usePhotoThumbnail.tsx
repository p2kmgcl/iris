import useAsyncMemo from './useAsyncMemo';
import Database from '../utils/Database';
import { useEffect } from 'react';

export const usePhotoThumbnail = (itemId: string) => {
  const url = useAsyncMemo(
    async () => {
      const photo = await Database.selectPhoto(itemId);
      const thumbnail = await Database.selectThumbnail(itemId);

      if (!photo || !thumbnail) {
        return '';
      }

      return URL.createObjectURL(
        new File([thumbnail.arrayBuffer], photo.itemId, {
          type: thumbnail.contentType,
        }),
      );
    },
    [itemId],
    '',
  );

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  return url;
};
