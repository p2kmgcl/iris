import React, { FC } from 'react';
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
import {
  useIsScanning,
  useLastScannedPhoto,
  useScanError,
  useToggleScan,
} from '../contexts/ScanContext';

export const ScanStatus: FC = () => {
  const theme = useTheme();
  const isScanning = useIsScanning();
  const toggleScan = useToggleScan();
  const lastScannedPhoto = useLastScannedPhoto();
  const scanError = useScanError();

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

      <CardContent style={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography>
          {isScanning ? 'Scanning...' : 'Scanning stopped'}
        </Typography>
        <Typography
          variant="body2"
          style={{
            color: scanError
              ? theme.palette.error.main
              : theme.palette.text.secondary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {scanError
            ? scanError.toString()
            : isScanning && lastScannedPhoto?.dateTime
            ? new Date(lastScannedPhoto.dateTime).toLocaleString()
            : ''}
        </Typography>
      </CardContent>

      <Box style={{ flexShrink: 0 }}>
        <IconButton onClick={toggleScan}>
          {isScanning ? <PauseCircleOutline /> : <PlayCircleOutline />}
        </IconButton>
      </Box>
    </Card>
  );
};
