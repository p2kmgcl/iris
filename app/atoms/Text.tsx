import { FC } from 'react';

export const Text: FC<{
  align?: 'inherit' | 'left' | 'center' | 'right';
  variant?: 'default' | 'secondary';
  TagName?: 'p' | 'h1';
  size?: number;
  lineHeight?: number;
  block?: boolean;
}> = ({
  children,
  TagName = 'p',
  align = 'inherit',
  variant = 'default',
  size = 1,
  lineHeight = 1.5,
  block = false,
}) => {
  return (
    <TagName
      style={{
        textAlign: align,
        color:
          variant === 'default' ? 'var(--main-color)' : 'var(--disabled-color)',
        display: block ? 'block' : 'inline-block',
        fontSize: `${size}rem`,
        lineHeight: `${lineHeight}em`,
        margin: '0',
      }}
    >
      {children}
    </TagName>
  );
};
