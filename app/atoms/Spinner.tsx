import React, { FC } from 'react';
import styles from './Spinner.css';

export const Spinner: FC<{ size: 'regular' | 'large' }> = ({ size }) => (
  <div
    style={{
      fontSize: {
        regular: 2.5,
        large: 10,
      }[size],
    }}
    className={styles.spinner}
  />
);
