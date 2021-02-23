import React from 'react';
import PhotoThumbnail from './PhotoThumbnail';

export default {
  title: 'atoms/PhotoThumbnail',
  component: PhotoThumbnail,
};

export const Default = () => (
  <div style={{ width: 200, height: 200 }}>
    <PhotoThumbnail
      url="http://placekitten.com/200/300"
      onClick={() => alert('Click')}
      showVideoIcon={false}
    />
  </div>
);

export const WithVideoIcon = () => (
  <div style={{ width: 200, height: 200 }}>
    <PhotoThumbnail
      url="http://placekitten.com/640/480"
      onClick={() => alert('Click')}
      showVideoIcon={true}
    />
  </div>
);

export const Rectangle = () => (
  <div style={{ width: 100, height: 400 }}>
    <PhotoThumbnail
      url="http://placekitten.com/640/480"
      onClick={() => alert('Click')}
      showVideoIcon={true}
    />
  </div>
);
