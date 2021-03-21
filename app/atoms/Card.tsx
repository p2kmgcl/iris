import { FC } from 'react';
import styles from './Card.module.css';

export const Card: FC<{
  thumbnailURL: string;
  title: string;
  onClick: () => void;
}> = ({ title, thumbnailURL, onClick }) => (
  <button className={styles.card} type="button" onClick={onClick}>
    <span
      className={styles.thumbnail}
      role="img"
      style={{ backgroundImage: `url(${thumbnailURL})` }}
    />

    <span className={styles.title}>{title}</span>
  </button>
);
