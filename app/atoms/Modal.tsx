import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.css';

const Modal: FC = ({ children }) =>
  createPortal(
    <div className={styles.modal}>
      <div>{children}</div>
    </div>,
    document.body,
  );

export default Modal;
