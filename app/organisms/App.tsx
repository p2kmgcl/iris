import React, { FC, useEffect } from 'react';
import { useToggleScan } from '../contexts/ScanContext';
import BottomTabs from '../atoms/BottomTabs';
import { MdPhoto, MdPhotoAlbum, MdSettings } from 'react-icons/md';
import AlbumModal from './modals/AlbumModal';
import PhotoModal from './modals/PhotoModal';
import { useRouteKey, useSetRouteKey } from '../contexts/RouteContext';

const DEFAULT_TAB_ID = 'allPhotos';

const TABS: Record<
  string,
  {
    tabId: string;
    label: string;
    Icon: FC;
    Content: FC;
  }
> = {
  [DEFAULT_TAB_ID]: {
    tabId: DEFAULT_TAB_ID,
    label: 'Photos',
    Icon: MdPhoto,
    Content: React.lazy(() => import('./tabs/AllPhotosTab')),
  },
  allAlbums: {
    tabId: 'allAlbums',
    label: 'Albums',
    Icon: MdPhotoAlbum,
    Content: React.lazy(() => import('./tabs/AllAlbumsTab')),
  },
  settings: {
    tabId: 'settings',
    label: 'Settings',
    Icon: MdSettings,
    Content: React.lazy(() => import('./tabs/SettingsTab')),
  },
};

export default function App() {
  const tabId = useRouteKey('tab');
  const setTabId = useSetRouteKey('tab');
  const albumId = useRouteKey('album');
  const setAlbumId = useSetRouteKey('album');
  const photoIndex = useRouteKey('photo');
  const setPhotoIndex = useSetRouteKey('photo');
  const toggleScan = useToggleScan();

  useEffect(() => {
    toggleScan();
  }, [toggleScan]);

  return (
    <>
      <BottomTabs
        selectedTabId={tabId || DEFAULT_TAB_ID}
        onTabClick={(nextTabId) => {
          setTabId(nextTabId);
        }}
        tabs={Object.values(TABS)}
      />

      {albumId ? (
        <AlbumModal
          albumId={albumId}
          onCloseButtonClick={() => setAlbumId('')}
        />
      ) : null}

      {photoIndex ? (
        <PhotoModal
          index={Number(photoIndex)}
          albumId={albumId || null}
          onCloseButtonClick={() => setPhotoIndex('')}
        />
      ) : null}
    </>
  );
}
