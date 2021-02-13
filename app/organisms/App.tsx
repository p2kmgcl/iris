import React, { FC, useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  useTheme,
} from '@material-ui/core';
import {
  PhotoLibraryOutlined,
  SettingsOutlined,
  SvgIconComponent,
} from '@material-ui/icons';
import { AllPhotosTab } from './tabs/AllPhotosTab';
import { SettingsTab } from './tabs/SettingsTab';

const DEFAULT_TAB_ID = 'allPhotos';

const TABS: Record<
  string,
  {
    label: string;
    Component: FC;
    Icon: SvgIconComponent;
  }
> = {
  [DEFAULT_TAB_ID]: {
    label: 'Photos',
    Icon: PhotoLibraryOutlined,
    Component: AllPhotosTab,
  },

  settings: {
    label: 'Settings',
    Icon: SettingsOutlined,
    Component: SettingsTab,
  },
};

export function App() {
  const theme = useTheme();
  const [tabId, setTabId] = useState(DEFAULT_TAB_ID);
  const { Component } = TABS[tabId];

  return (
    <Box display="flex" flexDirection="column" style={{ height: '100%' }}>
      <Box flexGrow={1} overflow="flex" display="flex">
        <Component />
      </Box>

      <BottomNavigation
        showLabels
        value={tabId}
        onChange={(_, nextValue) => setTabId(nextValue)}
        style={{ height: `${theme.spacing(10)}px` }}
      >
        {Object.entries(TABS).map(([value, { label, Icon }]) => (
          <BottomNavigationAction
            key={value}
            label={label}
            icon={<Icon />}
            value={value}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
