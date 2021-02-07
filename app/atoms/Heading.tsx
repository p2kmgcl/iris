import React, { FC, HTMLProps } from 'react';

export const Heading: FC<
  Omit<HTMLProps<HTMLHeadingElement>, 'className'> & {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }
> = ({ level, ...props }) => {
  const TagName = `h${level}`;

  return <TagName {...props} />;
};
