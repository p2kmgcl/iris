import React, { FC } from 'react';
import styles from './Spinner.css';

const Spinner: FC<{ size: 'regular' | 'large'; spinning?: boolean }> = ({
  size,
  spinning = true,
}) => (
  <div
    style={{
      fontSize: {
        regular: 2.5,
        large: 10,
      }[size],
    }}
    className={`${styles.spinner} ${spinning ? styles.spinning : ''}`}
  />
);

export default Spinner;
