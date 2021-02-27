import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useToggleScan } from '../contexts/ScanContext';
import BottomTabs from '../atoms/BottomTabs';
import { MdPhoto, MdPhotoAlbum, MdSettings } from 'react-icons/md';

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
  const [tabId, setTabId] = useState<keyof typeof TABS>(DEFAULT_TAB_ID);
  const tabList = useMemo(() => Object.values(TABS), []);
  const toggleScan = useToggleScan();

  const handleTabClick = useCallback(
    (nextTabId: string) => {
      setTabId(nextTabId);
    },
    [setTabId],
  );

  useEffect(() => {
    toggleScan();
  }, [toggleScan]);

  return (
    <BottomTabs
      selectedTabId={tabId}
      onTabClick={handleTabClick}
      tabs={tabList}
    />
  );
}
