import React, { FC } from 'react';
import style from './CenteredLayout.css';

export const CenteredLayout: FC = ({ children }) => {
  return <div className={style.layout}>{children}</div>;
};
