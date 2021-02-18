import React, { useState } from 'react';
import BottomTabs from './BottomTabs';
import { MdPhoto, MdPhotoAlbum, MdSettings } from 'react-icons/all';

export default {
  title: 'atoms/BottomTabs',
  component: BottomTabs,
};

export const Default = () => {
  const [tabId, setTabId] = useState('photos');

  return (
    <BottomTabs
      selectedTabId={tabId}
      onTabClick={setTabId}
      tabs={[
        {
          tabId: 'photos',
          label: 'Photos',
          Content: () => <h1>Photos</h1>,
          Icon: MdPhoto,
        },
        {
          tabId: 'albums',
          label: 'Albums',
          Content: () => <h1>Music</h1>,
          Icon: MdPhotoAlbum,
        },
        {
          tabId: 'settings',
          label: 'Settings',
          Content: () => <h1>Settings</h1>,
          Icon: MdSettings,
        },
      ]}
    />
  );
};
