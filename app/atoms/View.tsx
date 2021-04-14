import { FC } from 'react';
import classNames from 'classnames';
import styles from './View.module.css';

export const View: FC<{ centered?: boolean; fixedWidth?: boolean, padded?: boolean }> = ({
  children,
  centered,
  fixedWidth,
  padded,
}) => (
  <div
    className={classNames({
      [styles.centered]: centered,
      [styles.fixedWidth]: fixedWidth,
      [styles.padded]: padded,
    })}
  >
    {children}
  </div>
);
