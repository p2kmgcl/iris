import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import {
  PhotoAlbumOutlined,
  PhotoLibraryOutlined,
  SettingsOutlined,
} from '@material-ui/icons';
import { AllPhotosTab } from './tabs/AllPhotosTab';
import { SettingsTab } from './tabs/SettingsTab';
import { useIsScanning, useToggleScan } from '../contexts/ScanContext';
import { AllAlbumsTab } from './tabs/AllAlbumsTab';

const DEFAULT_TAB_ID = 'allPhotos';

export function App() {
  const theme = useTheme();
  const [tabId, setTabId] = useState(DEFAULT_TAB_ID);
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();

  useEffect(() => {
    toggleScan();
  }, [toggleScan]);

  const tabs: Record<
    string,
    {
      label: string;
      Component: FC;
      Icon: ReactElement;
    }
  > = {
    [DEFAULT_TAB_ID]: {
      label: 'Photos',
      Icon: <PhotoLibraryOutlined />,
      Component: AllPhotosTab,
    },

    allAlbums: {
      label: 'Albums',
      Icon: <PhotoAlbumOutlined />,
      Component: AllAlbumsTab,
    },

    settings: {
      label: 'Settings',
      Icon: isScanning ? (
        <Badge
          color="primary"
          overlap="circle"
          badgeContent={
            <CircularProgress
              size={10}
              disableShrink
              style={{ color: theme.palette.primary.contrastText }}
            />
          }
        >
          <SettingsOutlined />
        </Badge>
      ) : (
        <SettingsOutlined />
      ),
      Component: SettingsTab,
    },
  };

  const { Component } = tabs[tabId];

  return (
    <Box display="flex" flexDirection="column" style={{ height: '100%' }}>
      <Box flexGrow={1} overflow="auto" display="flex">
        <Component />
      </Box>

      <BottomNavigation
        showLabels
        value={tabId}
        onChange={(_, nextValue) => setTabId(nextValue)}
        style={{ height: `${theme.spacing(10)}px` }}
      >
        {Object.entries(tabs).map(([value, { label, Icon }]) => (
          <BottomNavigationAction
            key={value}
            label={label}
            icon={Icon}
            value={value}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
