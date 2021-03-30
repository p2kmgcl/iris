import { FC } from 'react';
import styles from './SetupStep.module.css';

const SetupStep: FC<{ fullScreen?: boolean }> = ({
  children,
  fullScreen = false,
}) => {
  return (
    <article
      className={`${styles.wrapper} ${
        fullScreen ? styles.wrapperFullScreen : ''
      }`}
    >
      <div className={styles.content}>{children}</div>
    </article>
  );
};

export default SetupStep;
