import React, { FC, useEffect, useState } from 'react';
import { Photo } from '../../types/Schema';

const thumbnailURLMap: Map<string, string> = new Map();

export const PhotoThumbnail: FC<{ photo: Photo; size: number | string }> = ({
  photo,
  size,
}) => {
  const [url, setURL] = useState(() => thumbnailURLMap.get(photo.itemId));

  useEffect(() => {
    let thumbnailURL = thumbnailURLMap.get(photo.itemId);

    if (thumbnailURL) {
      setURL(thumbnailURL);
      return;
    }

    thumbnailURL = URL.createObjectURL(
      new File([photo.thumbnail.arrayBuffer], photo.itemId, {
        type: photo.thumbnail.contentType,
      }),
    );

    thumbnailURLMap.set(photo.itemId, thumbnailURL);
    setURL(thumbnailURL);
  }, [photo]);

  return (
    <div
      role="img"
      style={{
        width: size,
        height: size,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundImage: url ? `url(${url})` : 'none',
        backgroundColor: `var(--dark-l1)`,
      }}
    />
  );
};
