import { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.css';

const Button: FC<Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>> = (
  props,
) => <button className={styles.button} {...props} />;

export default Button;
