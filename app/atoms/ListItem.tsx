import { FC, HTMLProps, MouseEventHandler, ReactNode } from 'react';
import styles from './ListItem.module.css';
import classNames from 'classnames';

export const ListItem: FC<{
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label: ReactNode;
  sublabel?: ReactNode;
  disabled?: boolean;
  pressed?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ leftIcon, rightIcon, label, sublabel, disabled, pressed, onClick }) => {
  let ButtonTagName = 'span';

  let buttonProps: HTMLProps<HTMLButtonElement | HTMLSpanElement> = {
    className: styles.item,
  };

  if (
    disabled !== undefined ||
    pressed !== undefined ||
    onClick !== undefined
  ) {
    ButtonTagName = 'button';
    buttonProps = {
      ...buttonProps,
      className: classNames(styles.item, styles.button),
      'aria-pressed': pressed,
      type: 'button',
      disabled,
      onClick,
    };
  }

  return (
    <li className={styles.listItem}>
      <ButtonTagName {...buttonProps}>
        {leftIcon ? <span className={styles.leftIcon}>{leftIcon}</span> : null}
        <span className={styles.content}>
          <span>{label}</span>
          {sublabel ? (
            <span className={styles.sublabel}>{sublabel}</span>
          ) : null}
        </span>
        {rightIcon ? (
          <span className={styles.rightIcon}>{rightIcon}</span>
        ) : null}
      </ButtonTagName>
    </li>
  );
};
