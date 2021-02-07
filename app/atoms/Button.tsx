import React, { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react';
import style from './Button.css';
import classNames from 'classnames';

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> & {
  variant?: 'default' | 'primary';
  loading?: boolean;
};

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  loading = false,
  ...props
}) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
    } else if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={classNames(style.button, {
        [style.buttonPrimary]: variant === 'primary',
        [style.buttonLoading]: loading,
      })}
      onClick={handleClick}
      type={type}
      {...props}
    >
      <span className={style.buttonContent} tabIndex={-1}>
        {children}
      </span>
    </button>
  );
};
