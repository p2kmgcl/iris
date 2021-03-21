import { FC } from 'react';
import styles from './IconStyleContext.module.css';
import { IconContext } from 'react-icons';

const IconStyleContextProvider: FC = ({ children }) => (
  <IconContext.Provider value={{ className: styles.icon }}>
    {children}
  </IconContext.Provider>
);

export default IconStyleContextProvider;
