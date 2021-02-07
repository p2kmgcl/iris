import React, { FC, useEffect, useState } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { CenteredLayout } from '../../atoms/CenteredLayout';
import { Heading } from '../../atoms/Heading';
import { Graph } from '../../utils/Graph';
import { Button } from '../../atoms/Button';
import { List } from '../../atoms/List';
import { DriveItem } from '@microsoft/microsoft-graph-types';
import { LoadingMask } from '../../atoms/LoadingMask';
import { Database } from '../../utils/Database';

export const RootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [itemId, setItemId] = useState('root');
  const [item, setItem] = useState<DriveItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<
    Array<{ id: string; label: string }>
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
        .filter((child) => child.id && child.name && child.folder)
        .map((child) => ({
          id: child.id as string,
          label: child.name as string,
        }));

      setItem(item);

      if (item.parentReference?.id) {
        setChildren([
          { id: item.parentReference.id as string, label: '..' },
          ...filteredChildren,
        ]);
      } else {
        setChildren(filteredChildren);
      }

      setLoading(false);
    })();
  }, [itemId]);

  return (
    <CenteredLayout>
      <Heading level={1}>Where are your photos?</Heading>

      <LoadingMask loading={loading}>
        {item && children ? (
          <List
            label={item.name || ''}
            items={children}
            onItemClick={setItemId}
          />
        ) : null}
      </LoadingMask>

      <Button disabled={loading} onClick={handleChoose} variant="primary">
        {item?.parentReference?.id
          ? `Choose ${item?.name}`
          : 'Choose base directory'}
      </Button>
    </CenteredLayout>
  );
};
