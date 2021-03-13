import { FC, useEffect, useState } from 'react';
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
} from 'react-icons/ai';
import List, {
  ListButtonItem,
  ListItem,
  ListToggleItem,
  SubList,
} from '../../atoms/List';

const UsedSpace = () => {
  const [space, setSpace] = useState<JSX.Element>(<></>);

  useEffect(() => {
    const updateSpace = async () => {
      const estimation = await window.navigator?.storage?.estimate?.();
      const megaBytes = Math.round((estimation?.usage || 0) / Math.pow(2, 20));
      const photoCount = await Database.selectPhotoCount();
      const albumCount = await Database.selectAlbumCount();

      setSpace(
        <>
          <div>
            {photoCount} photos in {albumCount} albums
          </div>
          <div>{megaBytes} megabytes</div>
        </>,
      );
    };

    updateSpace();
    const intervalId = setInterval(updateSpace, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return space;
};

const SettingsTab: FC = () => {
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();
  const scanStatus = useScanStatus();

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
        <ListItem
          icon={<AiOutlineHdd />}
          title="Used space"
          subtitle={<UsedSpace />}
        />
      </SubList>
    </List>
  );
};

export default SettingsTab;
