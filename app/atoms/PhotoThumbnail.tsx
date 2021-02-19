import React, { FC } from 'react';
import { LoadedPhoto } from '../utils/PhotoLoader';

const PhotoThumbnail: FC<{ photo: LoadedPhoto }> = ({ photo }) => (
  <div
    role="img"
    style={{
      backgroundImage: `url(${photo.thumbnailURL})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      width: '100%',
      height: '100%',
    }}
  />
);

export default PhotoThumbnail;
