import React, { FC } from 'react';
import styles from './FileBrowser.css';
import { Spinner } from './Spinner';

export const FileBrowser: FC<{
  path: string[];
  items: Array<{ label: string; itemId: string; Icon: FC; disabled: boolean }>;
  onItemClick: (itemId: string) => void;
}> = ({ path: initialPath, items, onItemClick }) => {
  const filteredPath =
    initialPath.length >= 3
      ? [initialPath[0], '..', initialPath[initialPath.length - 1]]
      : initialPath;

  return (
    <div className={styles.wrapper}>
      {items.length ? (
        <>
          <ol className={styles.breadcrumbList}>
            {filteredPath.map((item, index) => (
              <li className={styles.breadcrumbItem} key={`${item}-${index}`}>
                <span className={styles.breadcrumbItemContent}>{item}</span>
              </li>
            ))}
          </ol>

          <ul className={styles.buttonList}>
            {items.map((item) => (
              <li className={styles.buttonListItem} key={item.itemId}>
                <button
                  disabled={item.disabled}
                  className={styles.buttonListButton}
                  type="button"
                  onClick={() => onItemClick(item.itemId)}
                >
                  <span className={styles.buttonListIcon}>{<item.Icon />}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.spinner}>
          <Spinner size="large" />
        </div>
      )}
    </div>
  );
};
