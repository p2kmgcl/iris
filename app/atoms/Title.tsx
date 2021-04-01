import { FC } from 'react';
import styles from './Title.module.css';

export const Title: FC = ({ children }) => (
  <h1 className={styles.title}>{children}</h1>
);
