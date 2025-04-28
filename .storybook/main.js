import { mergeConfig } from 'vite';
import path from 'path';

export default {
  // Only include stories from the root level and subdirectories, but exclude node_modules
  stories: ['../stories/**/*.stories.tsx', '!../node_modules/**/*'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  addons: [
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
],

  features: {
    storyStoreV7: false,
    previewMdx2: true,
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      base: './',

      resolve: {
        alias: {
          assert: path.resolve(__dirname, './assert_fallback.cjs'),
        },
      },
    });
  },

  docs: {
    autodocs: true,
  },
};
