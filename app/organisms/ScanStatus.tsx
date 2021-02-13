import React, { FC, useEffect, useState } from 'react';
import { Database } from '../utils/Database';
import { AbortError, Scanner } from '../utils/Scanner';
import { Photo } from '../../types/Schema';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from '@material-ui/core';
import { PauseCircleOutline, PlayCircleOutline } from '@material-ui/icons';
import { PhotoThumbnail } from '../atoms/PhotoThumbnail';

export const ScanStatus: FC = () => {
  const theme = useTheme();
  const [scan, setScan] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastScannedPhoto, setLastScannedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!scan) {
      return;
    }

    const abortController = new AbortController();
    setError(null);

    Database.getConfiguration()
      .then(({ rootDirectoryId }) => {
        return Scanner.scan(
          rootDirectoryId,
          abortController.signal,
          setLastScannedPhoto,
        );
      })
      .then(() => {
        setScan(false);
      })
      .catch((error) => {
        setScan(false);

        if (!(error instanceof AbortError)) {
          setError(error);
        }
      });

    return () => {
      setLastScannedPhoto(null);
      abortController.abort();
    };
  }, [scan]);

  return (
    <Card style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
      <Box
        style={{
          width: '4em',
          height: '4em',
          padding: 8,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {lastScannedPhoto ? (
          <PhotoThumbnail photo={lastScannedPhoto} size="4em" />
        ) : (
          <Box
            style={{
              flexGrow: 1,
              backgroundColor: theme.palette.background.default,
            }}
          />
        )}
      </Box>

      <CardContent style={{ flexGrow: 1, overflow: 'hi  dden' }}>
        <Typography>{scan ? 'Scanning...' : 'Scanning stopped'}</Typography>
        <Typography
          variant="body2"
          style={{
            color: error
              ? theme.palette.error.main
              : theme.palette.text.secondary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {error
            ? error.toString()
            : scan && lastScannedPhoto?.dateTime
            ? new Date(lastScannedPhoto.dateTime).toLocaleString()
            : ''}
        </Typography>
      </CardContent>

      <Box style={{ flexShrink: 0 }}>
        <IconButton onClick={() => setScan(!scan)}>
          {scan ? <PauseCircleOutline /> : <PlayCircleOutline />}
        </IconButton>
      </Box>
    </Card>
  );
};
