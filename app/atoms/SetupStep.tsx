import { FC } from 'react';
import styles from './SetupStep.css';

const SetupStep: FC<{ title: string }> = ({ title, children }) => {
  return (
    <article className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </div>
    </article>
  );
};

export default SetupStep;
