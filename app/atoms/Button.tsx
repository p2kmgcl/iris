import React, { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.css';

export const Button: FC<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
> = (props) => <button className={styles.button} {...props} />;
