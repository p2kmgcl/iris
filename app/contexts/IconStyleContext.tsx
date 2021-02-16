import React, { FC } from 'react';
import styles from './IconStyleContext.css';
import { IconContext } from 'react-icons';

export const IconStyleContextProvider: FC = ({ children }) => (
  <IconContext.Provider value={{ className: styles.icon }}>
    {children}
  </IconContext.Provider>
);
