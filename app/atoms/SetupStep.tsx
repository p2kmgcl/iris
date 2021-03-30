import { FC } from 'react';
import styles from './SetupStep.module.css';

const SetupStep: FC = ({ children }) => {
  return (
    <article className={styles.wrapper}>
      <div className={styles.content}>{children}</div>
    </article>
  );
};

export default SetupStep;
