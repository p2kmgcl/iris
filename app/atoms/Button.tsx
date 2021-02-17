import React, { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.css';

const Button: FC<Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>> = (
  props,
) => <button className={styles.button} {...props} />;

export default Button;
