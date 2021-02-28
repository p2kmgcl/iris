import { FC } from 'react';

const Spacer: FC<{
  block?: boolean;
  axis?: 'x' | 'y' | 'both';
  size?: 0.25 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}> = ({ block = false, axis = 'both', size = 1 }) => (
  <span
    style={{
      display: block ? 'block' : 'inline-block',
      height: axis === 'x' ? 1 : `calc(var(--spacing-unit) * ${size})`,
      width: axis === 'y' ? 1 : `calc(var(--spacing-unit) * ${size})`,
    }}
  />
);

export default Spacer;
