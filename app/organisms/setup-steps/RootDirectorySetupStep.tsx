import React, { FC, useEffect, useState } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Graph } from '../../utils/Graph';
import { DriveItem } from '@microsoft/microsoft-graph-types';
import { LoadingMask } from '../../atoms/LoadingMask';
import { Database } from '../../utils/Database';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ArrowUpwardOutlined, FolderOutlined } from '@material-ui/icons';

export const RootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const theme = useTheme();
  const [itemId, setItemId] = useState('root');
  const [item, setItem] = useState<DriveItem | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<
    Array<{ id: string; label: string; Icon: FC }>
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
          Icon: FolderOutlined,
        }));

      setItem(item);

      if (item.parentReference?.id) {
        setChildren([
          {
            id: item.parentReference.id as string,
            label: '..',
            Icon: ArrowUpwardOutlined,
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
      <Typography variant="h2" component="h1">
        Gallery folder
      </Typography>

      <Box
        style={{
          margin: '2em auto',
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',
        }}
      >
        <LoadingMask loading={loading}>
          {item && children ? (
            <List
              style={{
                width: '90vw',
                maxWidth: '60ch',
                height: '40em',
                maxHeight: '50vh',
                overflowY: 'auto',
                backgroundColor: theme.palette.background.default,
                borderBottom: `solid thin ${theme.palette.divider}`,
              }}
              subheader={
                <ListSubheader
                  component="div"
                  style={{
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  {path.length ? (
                    <Breadcrumbs
                      maxItems={2}
                      style={{
                        marginBottom: theme.spacing(2),
                        marginTop: theme.spacing(2),
                      }}
                    >
                      {path.map((chunk, index) => (
                        <Chip
                          key={`${chunk}-${index}`}
                          label={chunk}
                          size="small"
                        />
                      ))}
                    </Breadcrumbs>
                  ) : null}
                </ListSubheader>
              }
            >
              {children.map(({ id, label, Icon }) => (
                <ListItem
                  button
                  key={id}
                  onClick={() => setItemId(id)}
                  style={{ borderTop: `solid thin ${theme.palette.divider}` }}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText>{label}</ListItemText>
                </ListItem>
              ))}

              {children.length === 1 ? (
                <Box
                  style={{
                    color: theme.palette.text.disabled,
                    padding: theme.spacing(2),
                    margin: theme.spacing(4),
                  }}
                >
                  <Typography>Folder is empty</Typography>
                </Box>
              ) : null}
            </List>
          ) : (
            <Box marginY="4em">
              <CircularProgress />
            </Box>
          )}
        </LoadingMask>
      </Box>

      {item && item.name ? (
        <Button
          disabled={loading}
          onClick={handleChoose}
          variant="contained"
          color="primary"
        >
          {`Choose ${item?.name}`}
        </Button>
      ) : null}
    </>
  );
};
