import React, { FC } from 'react';
import styles from './LoadingMask.css';

export const LoadingMask: FC<{ loading?: boolean }> = ({
  loading = false,
  children,
}) => {
  return <div className={loading ? styles.mask : ''}>{children}</div>;
};
