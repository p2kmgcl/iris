import React, { FC, useEffect, useState } from 'react';
import styles from './FilePicker.module.css';
import Spinner from './Spinner';
import Button from './Button';

const FilePicker: FC<{
  path: string[];
  itemId: string;
  itemChildren: Array<{
    label: string;
    itemId: string;
    Icon: FC;
    disabled: boolean;
  }>;
  onItemClick: (itemId: string) => void;
  onItemSelect: (itemId: string) => void;
}> = ({
  itemId,
  path: initialPath,
  itemChildren,
  onItemClick,
  onItemSelect,
}) => {
  const [buttonList, setButtonList] = useState<HTMLUListElement | null>(null);

  const filteredPath =
    initialPath.length >= 3
      ? [initialPath[0], '..', initialPath[initialPath.length - 1]]
      : initialPath;

  useEffect(() => {
    buttonList?.scrollTo({ left: 0, top: 0, behavior: 'auto' });
  }, [buttonList, itemChildren]);

  return (
    <div className={styles.wrapper}>
      {itemChildren.length ? (
        <>
          <ol className={styles.breadcrumbList}>
            {filteredPath.map((item, index) => (
              <React.Fragment key={`${item}-${index}`}>
                {index > 0 ? (
                  <span className={styles.breadcrumbSeparator}>/</span>
                ) : null}

                <li className={styles.breadcrumbItem}>{item}</li>
              </React.Fragment>
            ))}
          </ol>

          <ul className={styles.buttonList} ref={setButtonList}>
            {itemChildren.map((item) => (
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

      <div className={styles.footer}>
        {itemId && itemChildren.length ? (
          <Button onClick={() => onItemSelect(itemId)}>Select</Button>
        ) : null}
      </div>
    </div>
  );
};

export default FilePicker;
