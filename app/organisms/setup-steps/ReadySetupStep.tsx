import React, { FC } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Button, Typography, useTheme } from '@material-ui/core';
import { useToggleScan } from '../../contexts/ScanContext';

export const ReadySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const theme = useTheme();
  const toggleScan = useToggleScan();

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        style={{ marginBottom: theme.spacing(2) }}
      >
        You're ready to go!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={() => {
          toggleScan();
          stepReady();
        }}
      >
        Start scanning photos
      </Button>
    </>
  );
};
