import { FC } from 'react';
import styles from './Circle.module.css';

export const Circle: FC = ({ children }) => {
  return <span className={styles.circle}>{children}</span>;
};
