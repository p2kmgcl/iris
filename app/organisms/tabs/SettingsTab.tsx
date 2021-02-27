import React, { FC } from 'react';
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
  AiOutlineClear,
  AiOutlineHdd,
  AiOutlineInfoCircle,
  AiOutlineLogout,
  AiOutlineWarning,
} from 'react-icons/ai';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import List, {
  ListButtonItem,
  ListItem,
  ListToggleItem,
  SubList,
} from '../../atoms/List';

const SettingsTab: FC = () => {
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();
  const scanStatus = useScanStatus();

  const space = useAsyncMemo(
    () =>
      window.navigator?.storage
        ?.estimate?.()
        .then((estimation: any) =>
          estimation?.usage
            ? `${Math.round(estimation.usage / Math.pow(2, 20))} MB`
            : '???',
        ) ?? '???',
    [],
    '',
  );

  return (
    <List>
      <SubList title="Scan">
        <ListToggleItem
          icon={<Spinner size="regular" spinning={isScanning} />}
          title="Find new photos"
          subtitle={scanStatus.description}
          checked={isScanning}
          onChange={() => toggleScan()}
        />
      </SubList>
      <SubList title="About">
        <ListButtonItem
          icon={<AiOutlineLogout />}
          title="Logout"
          subtitle="Remove account but keep photos"
          onClick={() => {
            if (confirm('Are you sure?')) {
              Authentication.logout();
            }
          }}
        />
        <ListButtonItem
          icon={<AiOutlineClear />}
          title="Clear database"
          subtitle="Remove all photos but keep account"
          onClick={() => {
            if (confirm('Are you sure?')) {
              Database.destroy();
            }
          }}
        />
        <ListItem
          icon={<AiOutlineInfoCircle />}
          title="Version"
          subtitle={pkg.version}
        />
        <ListItem icon={<AiOutlineHdd />} title="Used space" subtitle={space} />
      </SubList>
    </List>
  );
};

export default SettingsTab;
