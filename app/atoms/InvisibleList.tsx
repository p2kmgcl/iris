import { FC } from 'react';
import styles from './InvisibleList.module.css';

export const InvisibleList: FC = ({ children }) => (
  <ul className={styles.list}>{children}</ul>
);
