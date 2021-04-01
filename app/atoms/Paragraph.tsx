import { FC } from 'react';
import styles from './Paragraph.module.css';
import classNames from 'classnames';

export const Paragraph: FC<{ secondary?: boolean }> = ({
  children,
  secondary,
}) => (
  <p
    className={classNames(styles.paragraph, {
      [styles.secondary]: secondary,
    })}
  >
    {children}
  </p>
);
