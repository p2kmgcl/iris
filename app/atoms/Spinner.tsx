import React, { FC } from 'react';
import styles from './Spinner.css';

export const Spinner: FC<{ size: 'large' }> = ({ size }) => (
  <div
    style={{
      fontSize: {
        large: 10,
      }[size],
    }}
    className={styles.spinner}
  />
);
