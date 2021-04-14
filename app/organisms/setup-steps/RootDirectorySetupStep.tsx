import { FC, ReactNode, useEffect, useState } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Graph from '../../utils/Graph';
import Database from '../../utils/Database';
import { BannerTitle } from '../../atoms/BannerTitle';
import Button from '../../atoms/Button';
import styles from './RootDirectorySetupStep.module.css';
import Spinner from '../../atoms/Spinner';
import { InvisibleList } from '../../atoms/InvisibleList';
import { ListItem } from '../../atoms/ListItem';
import { CornerLeftUp, File, Folder } from 'react-feather';
import { View } from '../../atoms/View';

const PreRootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [buttonList, setButtonList] = useState<HTMLDivElement | null>(null);
  const [itemId, setItemId] = useState('root');
  const [path, setPath] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<
    Array<{ itemId: string; label: string; icon: ReactNode; disabled: boolean }>
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
          icon: child.folder ? <Folder /> : <File />,
          disabled: !child.folder,
        }));

      if (item.parentReference?.id) {
        setChildren([
          {
            itemId: item.parentReference.id as string,
            label: '..',
            icon: <CornerLeftUp />,
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
              .concat([item.name])
              .join('/') ?? '/'
          : '',
      );

      setLoading(false);
    })();
  }, [itemId]);

  useEffect(() => {
    buttonList?.scrollTo({ left: 0, top: 0, behavior: 'auto' });
  }, [buttonList, children]);

  return (    <View fixedWidth>
    <div className={styles.wrapper}>
      <BannerTitle overflowDirection="start">{path}</BannerTitle>

      <div className={styles.content} ref={setButtonList}>
        <InvisibleList>
          {children.map((child) => (
            <ListItem
              key={child.itemId}
              disabled={child.disabled}
              leftIcon={child.icon}
              label={child.label}
              onClick={() => setItemId(child.itemId)}
            />
          ))}
        </InvisibleList>
      </div>

      <div className={styles.footer}>
        <Button disabled={loading} onClick={handleChoose}>
          Select this folder
        </Button>
      </div>

      {loading || !children.length ? (
        <div className={styles.loadingMask}>
          <Spinner size="large" />
        </div>
      ) : null}
    </div></View>
  );
};

export default PreRootDirectorySetupStep;
