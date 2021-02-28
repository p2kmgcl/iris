import { FC, ReactElement, useMemo } from 'react';
import styles from './List.css';

let nextCheckboxId = 0;

const List: FC = ({ children }) => {
  return <ul className={styles.list}>{children}</ul>;
};

export const ListItem: FC<{
  icon: ReactElement;
  title: ReactElement | string;
  subtitle: ReactElement | string;
}> = ({ icon, title, subtitle }) => {
  return (
    <li className={styles.listItem}>
      <span className={styles.listItemIcon}>{icon}</span>
      <span className={styles.listItemContent}>
        <span className={styles.listItemTitle}>{title}</span>
        <span className={styles.listItemSubtitle}>{subtitle}</span>
      </span>
    </li>
  );
};

export const ListToggleItem: FC<{
  icon: ReactElement;
  title: ReactElement | string;
  subtitle: ReactElement | string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange, icon, title, subtitle }) => {
  const checkboxId = useMemo(() => `list-toggle-item-${nextCheckboxId++}`, []);

  return (
    <li className={`${styles.listItem} ${styles.listToggleItem}`}>
      <input
        id={checkboxId}
        className={styles.listCheckbox}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <label className={styles.listLabel} htmlFor={checkboxId}>
        <span className={styles.listItemIcon}>{icon}</span>

        <span className={styles.listItemContent}>
          <span className={styles.listItemTitle}>{title}</span>
          <span className={styles.listItemSubtitle}>{subtitle}</span>
        </span>

        <span role="presentation" className={styles.listToggle} />
      </label>
    </li>
  );
};

export const ListButtonItem: FC<{
  icon: ReactElement;
  title: ReactElement | string;
  subtitle: ReactElement | string;
  onClick: () => void;
}> = ({ onClick, icon, title, subtitle }) => {
  return (
    <li className={`${styles.listItem} ${styles.listButtonItem}`}>
      <button
        className={styles.listButton}
        type="button"
        onClick={() => onClick()}
      >
        <span className={styles.listItemIcon}>{icon}</span>
        <span className={styles.listItemContent}>
          <span className={styles.listItemTitle}>{title}</span>
          <span className={styles.listItemSubtitle}>{subtitle}</span>
        </span>
      </button>
    </li>
  );
};

export const SubList: FC<{ title: ReactElement | string }> = ({
  title,
  children,
}) => {
  return (
    <li className={styles.subListItem}>
      <h1 className={styles.subListTitle}>{title}</h1>
      <ul className={styles.list}>{children}</ul>
    </li>
  );
};

export default List;
