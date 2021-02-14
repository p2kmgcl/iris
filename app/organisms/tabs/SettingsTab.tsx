import React, { FC } from 'react';
import {
  List as MaterialList,
  ListSubheader as MaterialListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  ListItemSecondaryAction,
  Switch,
  CircularProgress,
  Box,
} from '@material-ui/core';
import pkg from '../../../package.json';
import {
  ExitToAppOutlined,
  InfoOutlined,
  WarningOutlined,
} from '@material-ui/icons';
import { Authentication } from '../../utils/Authentication';
import { Database } from '../../utils/Database';
import {
  useIsScanning,
  useScanStatus,
  useToggleScan,
} from '../../contexts/ScanContext';
import { PhotoThumbnail } from '../../atoms/PhotoThumbnail';

const List: FC = ({ children }) => (
  <MaterialList style={{ padding: 0, width: '100%' }}>{children}</MaterialList>
);

const ListSubheader: FC = ({ children }) => {
  const theme = useTheme();

  return (
    <MaterialListSubheader
      style={{ backgroundColor: theme.palette.background.default }}
    >
      {children}
    </MaterialListSubheader>
  );
};

const SubList: FC = ({ children }) => (
  <ListItem style={{ padding: 0, width: '100%' }}>
    <List>{children}</List>
  </ListItem>
);

export const SettingsTab: FC = () => {
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();
  const scanStatus = useScanStatus();

  return (
    <List>
      <SubList>
        <ListSubheader>Scan</ListSubheader>
        <ListItem>
          <ListItemIcon>
            <CircularProgress
              size={24}
              {...(isScanning
                ? { variant: 'indeterminate' }
                : { variant: 'determinate', value: 100 })}
            />
          </ListItemIcon>
          <ListItemText
            primary="Find new photos"
            secondary={scanStatus.description}
          />
          {scanStatus.relatedPhoto ? (
            <ListItemIcon style={{ marginRight: '1ch' }}>
              <Box style={{ borderRadius: '50%', overflow: 'hidden' }}>
                <PhotoThumbnail photo={scanStatus.relatedPhoto} size={42} />
              </Box>
            </ListItemIcon>
          ) : null}
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={() => toggleScan()}
              checked={isScanning}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </SubList>
      <SubList>
        <ListSubheader>About</ListSubheader>
        <ListItem
          button
          onClick={() => {
            if (confirm('Are you sure?')) {
              Authentication.logout();
            }
          }}
        >
          <ListItemIcon>
            <ExitToAppOutlined />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            secondary="Remove account but keep photos"
          />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            if (confirm('Are you sure?')) {
              Database.destroy();
            }
          }}
        >
          <ListItemIcon>
            <WarningOutlined />
          </ListItemIcon>
          <ListItemText
            primary="Destroy everything"
            secondary="Remove all photos and accounts"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InfoOutlined />
          </ListItemIcon>
          <ListItemText primary="Version" secondary={pkg.version} />
        </ListItem>
      </SubList>
    </List>
  );
};
