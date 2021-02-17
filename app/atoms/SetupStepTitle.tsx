import React, { FC } from 'react';
import styles from './SetupStepTitle.css';

const SetupStepTitle: FC = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>;
};

export default SetupStepTitle;
