import React, { CSSProperties, FC } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.css';
import { MdClose } from 'react-icons/all';

const Modal: FC<{
  priority: number;
  background?: 'default' | 'black';
  onCloseButtonClick: () => void;
}> = ({ priority, background = 'default', children, onCloseButtonClick }) => {
  return createPortal(
    <div
      className={styles.modal}
      style={
        {
          '--background-color':
            background === 'default' ? 'var(--dark)' : 'var(--black)',
          zIndex: priority,
        } as CSSProperties
      }
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onCloseButtonClick}
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
