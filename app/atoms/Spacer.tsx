import { FC } from 'react';

const SIZE = {
  small: 'calc(var(--spacing-unit) * 0.5)',
  regular: 'var(--spacing-unit)',
  large: 'calc(var(--spacing-unit) * 2)',
  extraLarge: 'calc(var(--spacing-unit) * 3)',
};

const Spacer: FC<{
  inline?: boolean;
  height?: keyof typeof SIZE;
  width?: keyof typeof SIZE;
}> = ({ inline, height = 'regular', width = 'regular' }) => (
  <span
    style={{
      display: inline ? 'inline-block' : 'block',
      height: height ? SIZE[height] : undefined,
      width: width ? SIZE[width] : undefined,
    }}
  />
);

export default Spacer;
