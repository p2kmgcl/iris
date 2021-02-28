import { FC, useCallback, useState } from 'react';
import Grid, { ItemProps } from '../../atoms/Grid';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import PhotoLoader from '../../utils/PhotoLoader';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';
import PhotoModal from '../modals/PhotoModal';

const AllPhotosTab: FC = () => {
  const [photoIndex, setPhotoIndex] = useState(-1);

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(),
    [],
    0,
  );

  const handleCloseButtonClick = useCallback(() => {
    setPhotoIndex(-1);
  }, []);

  const Photo = useCallback(
    function PhotoCallback({ index }: ItemProps) {
      const photo = useAsyncMemo(
        () => PhotoLoader.getLoadedPhotoFromIndex(index),
        [index],
        null,
      );

      return photo ? (
        <PhotoThumbnail
          url={photo.thumbnailURL}
          onClick={() => setPhotoIndex(index)}
          showVideoIcon={photo.isVideo}
        />
      ) : null;
    },
    [setPhotoIndex],
  );

  return (
    <>
      {photoIndex !== -1 ? (
        <PhotoModal
          albumId={null}
          initialIndex={photoIndex}
          onCloseButtonClick={handleCloseButtonClick}
        />
      ) : null}

      <Grid itemCount={photoCount} Item={Photo} />
    </>
  );
};

export default AllPhotosTab;
