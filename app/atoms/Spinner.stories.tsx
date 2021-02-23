import React from 'react';
import Spinner from './Spinner';

export default {
  title: 'atoms/Spinner',
  component: Spinner,
};

export const Regular = () => <Spinner size="regular" />;
export const Large = () => <Spinner size="large" />;
