import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.css';
import { MdClose } from 'react-icons/all';

const Modal: FC<{
  background?: 'default' | 'black';
  onCloseButtonClick: () => void;
}> = ({ background = 'default', children, onCloseButtonClick }) => (
  <>
    {createPortal(
      <div
        className={styles.modal}
        style={{
          backgroundColor:
            background === 'default' ? 'var(--dark)' : 'var(--black)',
        }}
      >
        <div className={styles.header}>
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

        <div className={styles.content}>{children}</div>
      </div>,
      document.body,
    )}
  </>
);

export default Modal;
