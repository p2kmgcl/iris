import React, { FC } from 'react';
import { ScanStatus } from '../ScanStatus';
import { Box } from '@material-ui/core';

export const SettingsTab: FC = () => {
  return (
    <Box style={{ width: '100%' }}>
      <ScanStatus />
    </Box>
  );
};
