import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      DATABASE_URL: 'postgres://test:test@127.0.0.1:1/test',
      SUPABASE_URL: 'http://supabase.test',
      SUPABASE_SECRET_KEY: 'test-secret-key',
      CLIENT_ORIGIN: 'http://localhost:5173',
      ALLOWED_ORIGINS: '',
      COOKIE_SECURE: 'false',
      TRUST_PROXY: '',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.types.ts', 'src/types/**', 'src/server.ts'],
      reporter: ['text-summary', 'html'],
    },
  },
});
