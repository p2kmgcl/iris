import React, { FC } from 'react';
import { ScanStatus } from '../ScanStatus';
import { Box, Button, useTheme } from '@material-ui/core';
import { Authentication } from '../../utils/Authentication';
import { Database } from '../../utils/Database';

export const SettingsTab: FC = () => {
  const theme = useTheme();

  return (
    <Box style={{ width: '100%' }}>
      <ScanStatus />

      <Box p={2}>
        <Button
          variant="outlined"
          onClick={() => {
            Authentication.logout();
          }}
        >
          Logout
        </Button>
      </Box>

      <Box p={2} paddingTop={0}>
        <Button
          variant="outlined"
          style={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          }}
          onClick={() => {
            Database.destroy();
          }}
        >
          Destroy everything
        </Button>
      </Box>
    </Box>
  );
};
