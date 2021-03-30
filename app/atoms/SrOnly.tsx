import { FC } from 'react';
import styles from './SrOnly.module.css';

export const SrOnly: FC = ({ children }) => {
  return <span className={styles.srOnly}>{children}</span>;
};
