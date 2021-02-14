import React, { FC, useState } from 'react';
import { useAsyncMemo } from '../../hooks/useAsyncMemo';
import { Database } from '../../utils/Database';
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Album } from '../../../types/Schema';
import { CloseOutlined } from '@material-ui/icons';
import { PhotoGrid } from '../../atoms/PhotoGrid';

export const AllAlbumsTab: FC = () => {
  const albumList = useAsyncMemo(() => Database.selectAlbumList(), [], []);
  const [album, setAlbum] = useState<Album | null>(null);
  const theme = useTheme();

  return (
    <Box
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'auto',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Dialog fullScreen open={!!album}>
        {album ? (
          <>
            <AppBar color="transparent" style={{ boxShadow: 'none' }}>
              <Toolbar style={{ justifyContent: 'flex-end' }}>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => setAlbum(null)}
                  aria-label="close"
                >
                  <CloseOutlined />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: theme.spacing(6),
                marginBottom: theme.spacing(6),
                height: '100%',
              }}
            >
              <Box
                style={{
                  padding: theme.spacing(3),
                  marginBottom: theme.spacing(2),
                }}
              >
                {isFinite(album.dateTime) ? (
                  <Typography
                    component="p"
                    variant="h6"
                    color="textSecondary"
                    style={{
                      marginBottom: theme.spacing(1),
                      marginLeft: theme.spacing(1),
                    }}
                  >
                    {new Date(album.dateTime).toLocaleDateString()}
                  </Typography>
                ) : null}

                <Typography component="h1" variant="h1">
                  {album.title}
                </Typography>
              </Box>

              <PhotoGrid albumItemId={album.itemId} />
            </Box>
          </>
        ) : null}
      </Dialog>

      {albumList.map((album) => (
        <Card
          onClick={() => setAlbum(album)}
          key={album.itemId}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '20ch',
            margin: theme.spacing(1),
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography
                style={{ height: '3em', overflow: 'hidden' }}
                variant="body1"
                component="h2"
              >
                {album.title}
              </Typography>

              {isFinite(album.dateTime) ? (
                <Typography variant="body2" color="textSecondary" component="p">
                  {new Date(album.dateTime).toLocaleDateString()}
                </Typography>
              ) : null}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};
