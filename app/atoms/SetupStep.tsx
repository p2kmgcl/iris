import React, { FC } from 'react';
import styles from './SetupStep.css';

export const SetupStep: FC = ({ children }) => {
  return (
    <article className={styles.wrapper}>
      <div className={styles.content}>{children}</div>
    </article>
  );
};
