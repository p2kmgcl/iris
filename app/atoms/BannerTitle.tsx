import { FC } from 'react';
import styles from './BannerTitle.module.css';
import classNames from 'classnames';

export const BannerTitle: FC<{ overflowDirection?: 'start' | 'end' }> = ({
  children,
  overflowDirection,
}) => (
  <h1
    className={classNames(styles.title, {
      [styles.overflowStart]: overflowDirection === 'start',
    })}
  >
    {children}
  </h1>
);
