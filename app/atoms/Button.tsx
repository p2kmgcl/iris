import { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';

const Button: FC<{
  large?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ large = false, disabled, onClick, children }) => (
  <button
    type="button"
    className={classNames(styles.button, { [styles.large]: large })}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
