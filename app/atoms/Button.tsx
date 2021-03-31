import { ButtonHTMLAttributes, FC } from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';

const Button: FC<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    large?: boolean;
  }
> = ({ large = false, ...props }) => (
  <button
    className={classNames(styles.button, { [styles.buttonLarge]: large })}
    {...props}
  />
);

export default Button;
