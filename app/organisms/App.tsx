import React, { FC, useEffect, useState } from 'react';
import { useToggleScan } from '../contexts/ScanContext';
import { BottomTabs } from '../atoms/BottomTabs';
import {
  AiOutlineBook,
  AiOutlineFileImage,
  AiOutlineSetting,
} from 'react-icons/ai';

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
    Icon: AiOutlineFileImage,
    Content: React.lazy(() =>
      import('./tabs/AllPhotosTab').then(({ AllPhotosTab }) => ({
        default: AllPhotosTab,
      })),
    ),
  },
  allAlbums: {
    tabId: 'allAlbums',
    label: 'Albums',
    Icon: AiOutlineBook,
    Content: React.lazy(() =>
      import('./tabs/AllAlbumsTab').then(({ AllAlbumsTab }) => ({
        default: AllAlbumsTab,
      })),
    ),
  },
  settings: {
    tabId: 'settings',
    label: 'Settings',
    Icon: AiOutlineSetting,
    Content: React.lazy(() =>
      import('./tabs/SettingsTab').then(({ SettingsTab }) => ({
        default: SettingsTab,
      })),
    ),
  },
};

export function App() {
  const [tabId, setTabId] = useState<keyof typeof TABS>(DEFAULT_TAB_ID);
  const toggleScan = useToggleScan();

  useEffect(() => {
    toggleScan();
  }, [toggleScan]);

  return (
    <BottomTabs
      selectedTabId={tabId}
      onTabClick={setTabId}
      tabs={Object.values(TABS)}
    />
  );
}
