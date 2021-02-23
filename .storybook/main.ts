import { cssRule } from '../webpack.config';

export default {
  stories: ['../app/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  webpackFinal: async (config: {
    module: { rules: Array<{ test?: RegExp }> };
  }) => {
    config.module.rules = config.module.rules
      .filter((rule) => rule.test?.toString() !== '/\\.css$/')
      .concat([cssRule]);

    return config;
  },
};
