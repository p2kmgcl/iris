import React from 'react';
import FileBrowser from './FileBrowser';
import {
  BiFoodTag,
  FaCat,
  FaPizzaSlice,
  GiCheeseWedge,
  GiGoat,
} from 'react-icons/all';

export default {
  title: 'atoms/FileBrowser',
  component: FileBrowser,
};

export const Default = () => {
  return (
    <FileBrowser
      items={[
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: false,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: true,
          Icon: FaCat,
        },
      ]}
      path={[]}
      onItemClick={() => {}}
    />
  );
};

export const Breadcrumbs = () => {
  return (
    <FileBrowser
      path={['Games', 'Latest']}
      items={[
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: false,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: false,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: true,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: false,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: false,
          Icon: FaPizzaSlice,
        },
      ]}
      onItemClick={() => {}}
    />
  );
};

export const OverflowBreadcrumbs = () => {
  return (
    <FileBrowser
      path={[
        'Games that are listed because this is an example',
        'Latest',
        'Today',
        'Best of nice games that are really beautiful and you should really play',
      ]}
      items={[
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: false,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: false,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: true,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: false,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: false,
          Icon: FaPizzaSlice,
        },
      ]}
      onItemClick={() => {}}
    />
  );
};

export const LongList = () => {
  return (
    <FileBrowser
      items={[
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: false,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: false,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: false,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: false,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: false,
          Icon: FaPizzaSlice,
        },
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: false,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: false,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: false,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: false,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: false,
          Icon: FaPizzaSlice,
        },
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: false,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: false,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: false,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: false,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: false,
          Icon: FaPizzaSlice,
        },
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: true,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: true,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: true,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: true,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: true,
          Icon: FaPizzaSlice,
        },
        {
          itemId: 'taco',
          label: 'Taco',
          disabled: true,
          Icon: BiFoodTag,
        },
        {
          itemId: 'gato',
          label: 'Gato',
          disabled: true,
          Icon: FaCat,
        },
        {
          itemId: 'cabra',
          label: 'Cabra',
          disabled: true,
          Icon: GiGoat,
        },
        {
          itemId: 'queso',
          label: 'Queso',
          disabled: true,
          Icon: GiCheeseWedge,
        },
        {
          itemId: 'pizza',
          label: 'Pizza',
          disabled: true,
          Icon: FaPizzaSlice,
        },
      ]}
      path={[]}
      onItemClick={() => {}}
    />
  );
};

export const Loading = () => {
  return <FileBrowser items={[]} path={[]} onItemClick={() => {}} />;
};
