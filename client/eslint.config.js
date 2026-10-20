import js from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities'];
const LAYERS = ['app', ...SLICED_LAYERS, 'shared'];

const publicApiPattern = {
  regex: `^@/(${SLICED_LAYERS.join('|')})/[^/]+/(?!@x/)`,
  message: 'Import a slice through its public API (index.ts).',
};

const getLayerPatterns = (layer) => {
  const upperLayers = LAYERS.slice(0, LAYERS.indexOf(layer));
  const patterns = [publicApiPattern];

  if (upperLayers.length > 0) {
    patterns.push({
      regex: `^@/(${upperLayers.join('|')})(/|$)`,
      message: `The ${layer} layer cannot import from upper layers.`,
    });
  }

  if (layer === 'entities') {
    patterns.push({
      regex: '^@/entities/[^/]+$',
      message: 'Import another entity through its @x API.',
    });
  } else if (SLICED_LAYERS.includes(layer)) {
    patterns.push({
      regex: `^@/${layer}/`,
      message: 'Slices on the same layer cannot import each other.',
    });
  }

  return patterns;
};

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'jsx-a11y-x/no-redundant-roles': ['error', { nav: ['navigation'], ul: ['list'] }],
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/shared/ui/modal/modal.tsx', 'src/pages/home/ui/product-sort-menu.tsx'],
    rules: {
      'jsx-a11y-x/click-events-have-key-events': 'off',
      'jsx-a11y-x/no-noninteractive-element-interactions': 'off',
    },
  },
  ...LAYERS.map((layer) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': ['error', { patterns: getLayerPatterns(layer) }],
    },
  })),
]);
