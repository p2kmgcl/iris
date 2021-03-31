import { FC, useEffect, useState } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Graph from '../../utils/Graph';
import LoadingMask from '../../atoms/LoadingMask';
import Database from '../../utils/Database';
import {
  AiOutlineArrowUp,
  AiOutlineFile,
  AiOutlineFolder,
} from 'react-icons/ai';
import FilePicker from '../../atoms/FilePicker';
import SetupStep from '../../atoms/SetupStep';

const PreRootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [itemId, setItemId] = useState('root');
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
  }, [stepReady]);

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
    <SetupStep fullScreen>
      <LoadingMask loading={loading || !children.length} rounded={false}>
        <FilePicker
          path={path}
          itemId={itemId}
          itemChildren={children}
          onItemClick={setItemId}
          onItemSelect={handleChoose}
        />
      </LoadingMask>
    </SetupStep>
  );
};

export default PreRootDirectorySetupStep;
