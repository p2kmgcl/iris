import React, { FC, FormEventHandler, useEffect, useState } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Database } from '../../utils/Database';
import { Authentication } from '../../utils/Authentication';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { PersonOutlined } from '@material-ui/icons';

export const LoginSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);

    const popupWindow = window.open() as Window;

    await Database.setConfiguration({ clientId });
    await Authentication.login(popupWindow);

    setLoading(false);
    stepReady();
  };

  useEffect(() => {
    Database.getConfiguration().then((configuration) => {
      if (
        configuration.clientId &&
        configuration.accessToken &&
        configuration.refreshToken
      ) {
        setClientId(configuration.clientId);
        setLoading(true);
        setTimeout(() => stepReady(), 2000);
      } else {
        setClientId(configuration.clientId);
      }
    });
  }, []);

  return (
    <>
      <Typography variant="h2" component="h1">
        Account
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box marginY="1em">
          <TextField
            disabled={loading}
            label="ClientId"
            variant="outlined"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
          />
        </Box>

        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          type="submit"
          startIcon={
            loading ? <CircularProgress size={16} /> : <PersonOutlined />
          }
        >
          {loading ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </>
  );
};
