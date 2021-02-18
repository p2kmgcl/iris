import React from 'react';
import Input from './Input';

export default {
  title: 'atoms/Input',
  component: Input,
};

export const Default = () => <Input label="First name" type="text" />;

export const LongInput = () => (
  <Input label="First name" size={30} type="text" />
);

export const OverflowLabel = () => (
  <div
    style={{
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: '1em',
    }}
  >
    <Input
      label="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur nunc erat, quis semper dolor laoreet viverra. Nulla mollis lorem finibus, imperdiet mauris vitae, viverra risus. Nullam molestie facilisis justo, cursus feugiat mauris sollicitudin ut. Etiam quis cursus erat. Fusce mattis bibendum metus, vitae maximus nisi consectetur nec. Aenean id facilisis neque"
      type="text"
    />
  </div>
);
