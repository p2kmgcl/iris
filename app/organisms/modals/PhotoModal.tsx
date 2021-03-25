import { FC, useCallback, useMemo, useState } from 'react';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import { PhotoModel } from '../../../types/Schema';
import PhotoLoader from '../../utils/PhotoLoader';
import styles from './PhotoModal.module.css';
import { Carousel, SlideProps } from '../../atoms/Carousel';
import { AiFillInfoCircle } from 'react-icons/all';

const PhotoSlide: FC<SlideProps> = ({ slideId: itemId }) => {
  const [
    { width: maxWidth, height: maxHeight },
    setPhotoSlideClientRect,
  ] = useState({
    width: 0,
    height: 0,
  });

  const [showInfo, setShowInfo] = useState(false);

  const photo = useAsyncMemo<PhotoModel | undefined>(
    () => Database.selectPhoto(itemId),
    [itemId],
    undefined,
  );

  const album = useAsyncMemo(
    () =>
      photo?.albumItemId
        ? Database.selectAlbum(photo.albumItemId)
        : Promise.resolve(undefined),
    [photo],
    undefined,
  );

  const thumbnailURL = PhotoLoader.getPhotoThumbnailURL(itemId);

  const url = useAsyncMemo(
    () => PhotoLoader.getDownloadURLFromItemId(itemId),
    [itemId],
    '',
  );

  const [width, height] = useMemo(() => {
    if (!photo) {
      return [0, 0];
    }

    let width = photo.width;
    let height = photo.height;
    let ratio = 0;

    if (width > maxWidth) {
      ratio = maxWidth / width;
      width *= ratio;
      height *= ratio;
    }

    if (height > maxHeight) {
      ratio = maxHeight / height;
      width *= ratio;
      height *= ratio;
    }

    return [width, height];
  }, [maxWidth, maxHeight, photo]);

  const handlePhotoSlideRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      setPhotoSlideClientRect(element.getBoundingClientRect());
    }
  }, []);

  if (!photo || !thumbnailURL) {
    return null;
  }

  return (
    <div className={styles.photoSlide} ref={handlePhotoSlideRef}>
      {photo.isVideo ? (
        <video
          loop
          src={url}
          controls
          poster={thumbnailURL}
          width={width}
          height={height}
        />
      ) : (
        <img src={url || thumbnailURL} width={width} height={height} />
      )}

      {showInfo ? (
        <Modal priority={3} onCloseButtonClick={() => setShowInfo(false)}>
          <table className={styles.infoPanel}>
            <tr>
              <td>File name</td>
              <td>{photo.fileName}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{new Date(photo.dateTime).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                {photo.width}x{photo.height}
              </td>
            </tr>
            {album ? (
              <tr>
                <td>Album</td>
                <td>{album.title}</td>
              </tr>
            ) : null}
            {photo.location ? (
              <tr>
                <td>Location</td>
                <td>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      photo.location.longitude - 0.001
                    }%2C${photo.location.latitude - 0.001}%2C${
                      photo.location.longitude + 0.001
                    }%2C${photo.location.latitude + 0.001}&amp;layer=mapnik`}
                  />
                </td>
              </tr>
            ) : null}
          </table>
        </Modal>
      ) : (
        <div className={styles.bottomPanel}>
          <button
            className={styles.bottomPanelButton}
            onClick={() => setShowInfo(true)}
          >
            <span className={styles.bottomPanelButtonIcon}>
              <AiFillInfoCircle />
            </span>
            <span className={styles.bottomPanelButtonLabel}>Show info</span>
          </button>
        </div>
      )}
    </div>
  );
};

const PhotoModal: FC<{
  albumId?: string;
  photoId: string;
  onCloseButtonClick: () => void;
}> = ({ albumId, photoId, onCloseButtonClick }) => {
  const photoKeyList = useAsyncMemo(
    () => Database.selectPhotoKeyList(albumId),
    [albumId],
    [],
  );

  return (
    <Modal
      priority={2}
      background="black"
      onCloseButtonClick={onCloseButtonClick}
    >
      {photoKeyList.length ? (
        <Carousel
          slideIdsList={photoKeyList}
          initialSlideId={photoId}
          Slide={PhotoSlide}
        />
      ) : null}
    </Modal>
  );
};

export default PhotoModal;
