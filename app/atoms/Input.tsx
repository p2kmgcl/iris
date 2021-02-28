import { InputHTMLAttributes, FC } from 'react';
import styles from './Input.css';

const Input: FC<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { label: string }
> = ({ label, ...props }) => (
  <label className={styles.wrapper}>
    <input className={styles.input} {...props} />
    <span className={styles.label}>{label}</span>
  </label>
);

export default Input;
