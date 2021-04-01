import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useToggleScan } from '../contexts/ScanContext';
import {
  MdDeveloperMode,
  MdPhoto,
  MdPhotoAlbum,
  MdSettings,
} from 'react-icons/md';
import styles from './App.module.css';
import Spinner from '../atoms/Spinner';

const TAB_ID_PREFIX = 'bottom-tab-';
const LABEL_ID_PREFIX = 'bottom-tab-label-';
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

if (process.env.NODE_ENV === 'development') {
  TABS.developer = {
    tabId: 'developer',
    label: 'Developer',
    Icon: MdDeveloperMode,
    Content: React.lazy(() => import('./tabs/DeveloperTab')),
  };
}

const BottomTabs: FC<{
  selectedTabId: string;
  onTabClick: (tabId: string) => void;
  tabs: Array<{
    tabId: string;
    label: string;
    Icon: FC;
    Content: FC;
  }>;
}> = ({ selectedTabId, onTabClick, tabs }) => {
  const tabRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    tabRef.current?.focus();
  }, [selectedTabId]);

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabsContent}>
        {tabs.map((tab) =>
          tab.tabId === selectedTabId ? (
            <div
              key={tab.tabId}
              className={styles.tabContent}
              tabIndex={0}
              role="tabpanel"
              id={`${TAB_ID_PREFIX}${tab.tabId}`}
              aria-labelledby={`${LABEL_ID_PREFIX}${tab.tabId}`}
              ref={tabRef}
            >
              <Suspense
                fallback={
                  <div className={styles.tabSpinner}>
                    <Spinner size="large" />
                  </div>
                }
              >
                <tab.Content />
              </Suspense>
            </div>
          ) : null,
        )}
      </div>

      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => (
          <button
            className={styles.tab}
            key={tab.tabId}
            type="button"
            role="tab"
            aria-selected={tab.tabId === selectedTabId}
            aria-controls={`${TAB_ID_PREFIX}${tab.tabId}`}
            onClick={() => onTabClick(tab.tabId)}
          >
            <span className={styles.tabIcon}>
              <tab.Icon />
            </span>
            <span
              className={styles.tabLabel}
              id={`${LABEL_ID_PREFIX}${tab.tabId}`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
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
