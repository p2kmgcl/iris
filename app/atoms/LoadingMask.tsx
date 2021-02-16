import React, { FC } from 'react';
import styles from './LoadingMask.css';
import { Spinner } from './Spinner';

export const LoadingMask: FC<{ loading?: boolean }> = ({
  loading = false,
  children,
}) => (
  <div className={styles.wrapper}>
    {children}

    {loading ? (
      <>
        <div className={styles.mask} />
        <div className={styles.spinner}>
          <Spinner size="large" />
        </div>
      </>
    ) : null}
  </div>
);
