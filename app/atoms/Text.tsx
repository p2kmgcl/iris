import { FC } from 'react';

export const Text: FC<{
  variant?: 'default' | 'secondary';
  size?: number;
  block?: boolean;
}> = ({ children, variant = 'default', size = 1, block = false }) => {
  return (
    <span
      style={{
        color:
          variant === 'default' ? 'var(--main-color)' : 'var(--disabled-color)',
        display: block ? 'block' : 'inline',
        fontSize: `${size}rem`,
      }}
    >
      {children}
    </span>
  );
};
