import React, { FC } from 'react';
import styles from './List.css';

export const List: FC<{
  label: string;
  items: Array<{ id: string; label: string }>;
  onItemClick: (id: string) => void;
}> = ({ label, onItemClick, items }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.header}>{label}</span>

      <ul className={styles.list}>
        {items.map((item) => (
          <li className={styles.listItem} key={item.id}>
            <button
              className={styles.button}
              type="button"
              onClick={() => onItemClick(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
