import React, { FC } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Button, Typography, useTheme } from '@material-ui/core';

export const WelcomePageSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h1" component="h1">
        Iris
      </Typography>

      <Typography
        component="p"
        variant="subtitle1"
        style={{ marginBottom: theme.spacing(2) }}
      >
        The missing OneDrive gallery.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={() => stepReady()}
      >
        Start
      </Button>
    </>
  );
};
