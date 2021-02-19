import React, { FC, LiHTMLAttributes } from 'react';
import pkg from '../../../package.json';
import Authentication from '../../utils/Authentication';
import Database from '../../utils/Database';
import {
  useIsScanning,
  useScanStatus,
  useToggleScan,
} from '../../contexts/ScanContext';
import Spinner from '../../atoms/Spinner';
import {
  AiOutlineInfo,
  AiOutlineLogout,
  AiOutlineWarning,
} from 'react-icons/ai';

const SettingsTab: FC = () => {
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();
  const scanStatus = useScanStatus();

  return (
    <List>
      <SubList>
        <ListSubheader>Scan</ListSubheader>
        <ListItem>
          <Spinner size="regular" />
          <span>Find new photos</span>
          <span>{scanStatus.description}</span>

          <label>
            toggle
            <input
              type="checkbox"
              onChange={() => toggleScan()}
              checked={isScanning}
            />
          </label>
        </ListItem>
      </SubList>
      <SubList>
        <ListSubheader>About</ListSubheader>
        <ListItem
          onClick={() => {
            if (confirm('Are you sure?')) {
              Authentication.logout();
            }
          }}
        >
          <AiOutlineLogout />
          <span>Logout</span>
          <span>Remove account but keep photos</span>
        </ListItem>
        <ListItem
          onClick={() => {
            if (confirm('Are you sure?')) {
              Database.destroy();
            }
          }}
        >
          <AiOutlineWarning />
          <span>Destroy everything</span>
          <span>Remove all photos and accounts</span>
        </ListItem>
        <ListItem>
          <AiOutlineInfo />
          <span>Version</span>
          <span>{pkg.version}</span>
        </ListItem>
      </SubList>
    </List>
  );
};

const List: FC = ({ children }) => (
  <ul style={{ padding: 0, width: '100%' }}>{children}</ul>
);

const ListItem: FC<LiHTMLAttributes<HTMLLIElement>> = ({ ...props }) => {
  return (
    <li
      {...props}
      style={{ paddingLeft: 'var(--spacing-unit)', width: '100%' }}
    />
  );
};

const ListSubheader: FC = ({ children }) => {
  return <h2 style={{ backgroundColor: 'var(--dark-l1)' }}>{children}</h2>;
};

const SubList: FC = ({ children }) => (
  <li style={{ padding: 0, width: '100%' }}>
    <ul style={{ padding: 0, width: '100%' }}>{children}</ul>
  </li>
);

export default SettingsTab;
