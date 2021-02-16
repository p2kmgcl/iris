import React, { FC } from 'react';
import styles from './SetupStepTitle.css';

export const SetupStepTitle: FC = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>;
};
