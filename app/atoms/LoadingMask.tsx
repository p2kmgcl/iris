import React, { FC } from 'react';
import { Box, CircularProgress } from '@material-ui/core';

export const LoadingMask: FC<{ loading?: boolean }> = ({
  loading = false,
  children,
}) => {
  return (
    <Box
      style={{
        position: 'relative',
        pointerEvents: loading ? 'none' : 'initial',
      }}
    >
      <Box style={{ opacity: loading ? 0.7 : 1 }}>{children}</Box>
      {loading ? (
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
    </Box>
  );
};
