import React, { FC } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Button, Typography, useTheme } from '@material-ui/core';

export const WelcomePageSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        style={{ marginBottom: theme.spacing(2) }}
      >
        Iris
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
