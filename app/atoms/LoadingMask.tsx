import { FC } from 'react';
import styles from './LoadingMask.module.css';
import Spinner from './Spinner';

const LoadingMask: FC<{ loading?: boolean }> = ({
  loading = false,
  children,
}) => (
  <div className={`${styles.wrapper} ${loading ? styles.wrapperLoading : ''}`}>
    {children}

    {loading ? (
      <>
        <div className={styles.mask} />
        <div className={styles.spinner}>
          <Spinner size="large" />
        </div>
      </>
    ) : null}
  </div>
);

export default LoadingMask;
