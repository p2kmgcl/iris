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
} from 'react-icons/all';
import PhotoLoader from '../../utils/PhotoLoader';
import { ListItem } from '../../atoms/ListItem';
import { InvisibleList } from '../../atoms/InvisibleList';
import { BannerTitle } from '../../atoms/BannerTitle';

const ScanStatus = () => {
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();
  const scanStatus = useScanStatus();

  return (
    <ListItem
      leftIcon={<Spinner size="regular" spinning={isScanning} />}
      label="Find new photos"
      sublabel={scanStatus.description}
      pressed={isScanning}
      onClick={() => toggleScan()}
    />
  );
};

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
          {photoCount} photos in {albumCount} albums
          <br />
          {megaBytes} megabytes
        </>,
      );
    };

    updateSpace();
    const intervalId = setInterval(updateSpace, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ListItem leftIcon={<AiOutlineHdd />} label="Used space" sublabel={space} />
  );
};

const SettingsTab: FC = () => (
  <>
    <BannerTitle>Scan</BannerTitle>

    <InvisibleList>
      <ScanStatus />
    </InvisibleList>

    <BannerTitle>About</BannerTitle>

    <InvisibleList>
      <ListItem
        leftIcon={<AiOutlineLogout />}
        label="Logout"
        sublabel="Remove account but keep photos"
        onClick={() => {
          if (confirm('Are you sure?')) {
            Authentication.logout();
          }
        }}
      />
      <ListItem
        leftIcon={<AiOutlineClear />}
        label="Clear database"
        sublabel="Remove all photos but keep account"
        onClick={() => {
          if (confirm('Are you sure?')) {
            PhotoLoader.clearThumbnailCache().then(() => {
              return Database.destroy();
            });
          }
        }}
      />
      <ListItem
        leftIcon={<AiOutlineInfoCircle />}
        label="Version"
        sublabel={pkg.version}
      />
      <UsedSpace />
    </InvisibleList>
  </>
);

export default SettingsTab;
