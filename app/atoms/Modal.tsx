import { FC, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import classNames from 'classnames';
import { GoKebabVertical, MdArrowBack } from 'react-icons/all';
import { createPortal } from 'react-dom';

const MODAL_BASE_PRIORITY = 1000;
const MODAL_LAYER_SIZE = 100;

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

    getPriority: () => {
      return MODAL_BASE_PRIORITY + listeners.length * MODAL_LAYER_SIZE;
    },
  };
})();

const Modal: FC<{
  contrast?: boolean;
  options?: Array<{ label: string; onClick: () => void }>;
  onCloseButtonClick: () => void;
}> = ({ contrast, options, children, onCloseButtonClick }) => {
  const [priority, setPriority] = useState(-1);

  useEffect(() => {
    modalStack.push(onCloseButtonClick);
    setPriority(modalStack.getPriority());
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
    <div className={classNames(styles.modal, { [styles.contrast]: contrast })}>
      <div className={styles.header} style={{ zIndex: priority + 2 }}>
        <div className={styles.headerContent}>
          <button
            type="button"
            aria-label="Close"
            className={styles.headerButton}
            onClick={() => window.history.back()}
          >
            <MdArrowBack />
          </button>

          {options?.length ? (
            <button
              type="button"
              aria-label="View options"
              className={styles.headerButton}
              onClick={() => window.history.back()}
            >
              <GoKebabVertical />
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.content} style={{ zIndex: priority + 1 }}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
