import { fileURLToPath, URL } from 'node:url';

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const withCompiler = !process.env.COVERAGE;

export default defineConfig({
  plugins: [
    react(),
    ...(withCompiler ? [babel({ presets: [reactCompilerPreset()] })] : []),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/shared/testing/**',
        'src/**/index.ts',
        'src/**/*.types.ts',
        'src/app/entrypoint/**',
      ],
      reporter: ['text-summary', 'html'],
      thresholds: {
        lines: 99,
        branches: 95,
        functions: 99,
        statements: 98,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          include: ['src/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./src/shared/testing/setup-dom.ts'],
        },
      },
    ],
  },
});
