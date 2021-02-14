import React, { FC } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Button, Typography, useTheme } from '@material-ui/core';

export const ReadySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const theme = useTheme();

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
          stepReady();
        }}
      >
        Start scanning photos
      </Button>
    </>
  );
};
