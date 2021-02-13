import React, { FC } from 'react';
import { Box, CircularProgress, useTheme } from '@material-ui/core';

export const LoadingMask: FC<{ loading?: boolean }> = ({
  loading = false,
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      style={{
        position: 'relative',
      }}
    >
      {children}

      {loading ? (
        <>
          <Box
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: theme.palette.background.default,
              zIndex: 1,
              opacity: 0.5,
              cursor: 'progress',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              zIndex: 2,
              cursor: 'progress',
            }}
          >
            <CircularProgress />
          </Box>
        </>
      ) : null}
    </Box>
  );
};
