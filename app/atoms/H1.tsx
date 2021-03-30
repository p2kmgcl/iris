import { FC } from 'react';
import styles from './H1.module.css';

export const H1: FC = ({ children }) => {
  return <h1 className={styles.h1}>{children}</h1>;
};
