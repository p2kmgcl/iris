import React, { FC, useEffect, useState } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Graph } from '../../utils/Graph';
import { DriveItem } from '@microsoft/microsoft-graph-types';
import { LoadingMask } from '../../atoms/LoadingMask';
import { Database } from '../../utils/Database';
import { SetupStepTitle } from '../../atoms/SetupStepTitle';
import { Button } from '../../atoms/Button';
import {
  AiOutlineArrowUp,
  AiOutlineFile,
  AiOutlineFolder,
} from 'react-icons/ai';
import { Spacer } from '../../atoms/Spacer';
import { FileBrowser } from '../../atoms/FileBrowser';

export const RootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [itemId, setItemId] = useState('root');
  const [item, setItem] = useState<DriveItem | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<
    Array<{ itemId: string; label: string; Icon: FC; disabled: boolean }>
  >([]);

  const handleChoose = async () => {
    await Database.setConfiguration({ rootDirectoryId: itemId });
    stepReady();
  };

  useEffect(() => {
    setLoading(true);

    Database.getConfiguration().then((configuration) => {
      if (configuration.rootDirectoryId) {
        stepReady();
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);

    (async function () {
      const item = await Graph.getItem(itemId);
      const children = await Graph.getItemChildren(itemId);

      if (itemId === 'root' && item.id) {
        setItemId(item.id);
      }

      const filteredChildren = children
        .filter((child) => child.id && child.name)
        .map((child) => ({
          itemId: child.id as string,
          label: child.name as string,
          Icon: child.folder ? AiOutlineFolder : AiOutlineFile,
          disabled: !child.folder,
        }));

      setItem(item);

      if (item.parentReference?.id) {
        setChildren([
          {
            itemId: item.parentReference.id as string,
            label: '..',
            Icon: AiOutlineArrowUp,
            disabled: false,
          },
          ...filteredChildren,
        ]);
      } else {
        setChildren(filteredChildren);
      }

      setPath(
        item?.name
          ? item.parentReference?.path
              ?.replace(/^\/drive\/root:/, '')
              .split('/')
              .filter((chunk) => chunk)
              .map((chunk) => decodeURIComponent(chunk))
              .concat([item.name]) ?? ['/']
          : [],
      );

      setLoading(false);
    })();
  }, [itemId]);

  return (
    <>
      <SetupStepTitle>Gallery folder</SetupStepTitle>

      <LoadingMask loading={loading}>
        <FileBrowser path={path} items={children} onItemClick={setItemId} />
      </LoadingMask>

      <Spacer block size={2} />

      {item && item.name ? (
        <Button disabled={loading} onClick={handleChoose}>
          {`Choose ${item?.name}`}
        </Button>
      ) : null}
    </>
  );
};
