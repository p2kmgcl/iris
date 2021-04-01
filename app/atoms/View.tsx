import { FC } from 'react';
import classNames from 'classnames';
import styles from './View.module.css';

export const View: FC<{ centered?: boolean; padded?: boolean }> = ({
  children,
  centered,
  padded,
}) => (
  <div
    className={classNames({
      [styles.centered]: centered,
      [styles.padded]: padded,
    })}
  >
    {children}
  </div>
);
