import { CSSProperties, FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';
import styles from './Modal.module.css';

const modalStack = (function () {
  let listeners: Array<() => void> = [];

  const handlePopState = () => {
    if (listeners.length) {
      const listener = listeners[listeners.length - 1];
      listeners = listeners.slice(0, -1);
      listener();
    }
  };

  window.addEventListener('popstate', handlePopState);

  return {
    push: (listener: () => void) => {
      window.history.pushState(null, document.title);
      listeners = [...listeners, listener];
    },
  };
})();

const Modal: FC<{
  priority: number;
  background?: 'default' | 'black';
  onCloseButtonClick: () => void;
}> = ({ priority, background = 'default', children, onCloseButtonClick }) => {
  useEffect(() => {
    modalStack.push(onCloseButtonClick);
  }, [onCloseButtonClick]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.history.back();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  return createPortal(
    <div
      className={styles.modal}
      style={
        {
          backgroundColor:
            background === 'default'
              ? 'var(--main-background)'
              : 'var(--black)',
          color:
            background === 'default' ? 'var(--main-color)' : 'var(--white)',
          zIndex: priority,
        } as CSSProperties
      }
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.closeButton}
            type="button"
            onClick={() => window.history.back()}
          >
            <span className={styles.closeButtonIcon}>
              <MdClose />
            </span>
            <span className={styles.closeButtonLabel}>Close</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>,
    document.body,
  );
};

export default Modal;
