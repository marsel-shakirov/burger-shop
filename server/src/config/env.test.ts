import { describe, expect, it } from 'vitest';

import { env, parseEnv } from './env.ts';

const required = {
  DATABASE_URL: 'postgresql://user:password@db.example.com:5432/postgres',
  SUPABASE_URL: 'https://project.supabase.co',
  SUPABASE_SECRET_KEY: 'secret',
  CLIENT_ORIGIN: 'https://shop.example.com',
};

const defaults = {
  ...required,
  PORT: 3000,
  ALLOWED_ORIGINS: [],
  COOKIE_SECURE: true,
  TRUST_PROXY: undefined,
};

const parseWith = (overrides: Record<string, string | undefined>) =>
  parseEnv({ ...required, ...overrides });

describe('parseEnv', () => {
  it('подставляет значения по умолчанию для необязательных переменных', () => {
    expect(parseEnv(required)).toEqual(defaults);
  });

  it('считает пустые строки незаданными переменными', () => {
    expect(
      parseWith({ PORT: '', ALLOWED_ORIGINS: '', COOKIE_SECURE: '', TRUST_PROXY: '' }),
    ).toEqual(defaults);
  });

  it('не пропускает лишние переменные окружения в конфигурацию', () => {
    expect(parseWith({ HOME: '/home/user' })).not.toHaveProperty('HOME');
  });

  it.each(['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'CLIENT_ORIGIN'])(
    'падает без обязательной переменной %s',
    (name) => {
      expect(() => parseWith({ [name]: undefined })).toThrow(name);
    },
  );

  it('перечисляет все ошибки сразу', () => {
    const parse = () => parseEnv({ PORT: 'abc' });

    expect(parse).toThrow('Invalid environment variables');
    for (const name of [
      'PORT',
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_SECRET_KEY',
      'CLIENT_ORIGIN',
    ]) {
      expect(parse).toThrow(name);
    }
  });
});

describe('parseEnv: PORT', () => {
  it('превращает строку в число', () => {
    expect(parseWith({ PORT: '8080' }).PORT).toBe(8080);
  });

  it.each(['abc', '0', '65536', '3000.5', '-1'])('не принимает «%s»', (port) => {
    expect(() => parseWith({ PORT: port })).toThrow('PORT');
  });
});

describe('parseEnv: адреса', () => {
  it.each(['postgres://localhost/db', 'postgresql://localhost/db'])(
    'принимает DATABASE_URL %s',
    (url) => {
      expect(parseWith({ DATABASE_URL: url }).DATABASE_URL).toBe(url);
    },
  );

  it.each(['mysql://localhost/db', 'localhost:5432'])('не принимает DATABASE_URL %s', (url) => {
    expect(() => parseWith({ DATABASE_URL: url })).toThrow('DATABASE_URL');
  });

  it('убирает слеши на конце SUPABASE_URL', () => {
    expect(parseWith({ SUPABASE_URL: 'https://project.supabase.co//' }).SUPABASE_URL).toBe(
      'https://project.supabase.co',
    );
  });

  it.each(['project.supabase.co', 'ftp://project.supabase.co'])(
    'не принимает SUPABASE_URL %s',
    (url) => {
      expect(() => parseWith({ SUPABASE_URL: url })).toThrow('SUPABASE_URL');
    },
  );

  it.each([
    ['слеш на конце', 'https://shop.example.com/', 'https://shop.example.com'],
    ['путь', 'https://shop.example.com/profile', 'https://shop.example.com'],
    ['заглавные буквы в хосте', 'https://Shop.Example.COM', 'https://shop.example.com'],
    ['порт', 'http://localhost:5173/', 'http://localhost:5173'],
  ])('приводит CLIENT_ORIGIN к origin: %s', (_case, value, origin) => {
    expect(parseWith({ CLIENT_ORIGIN: value }).CLIENT_ORIGIN).toBe(origin);
  });

  it.each(['localhost:5173', 'shop.example.com', 'ftp://shop.example.com'])(
    'не принимает CLIENT_ORIGIN %s',
    (value) => {
      expect(() => parseWith({ CLIENT_ORIGIN: value })).toThrow('CLIENT_ORIGIN');
    },
  );

  it('разбирает ALLOWED_ORIGINS: пробелы, слеши и пустые элементы', () => {
    expect(
      parseWith({ ALLOWED_ORIGINS: ' https://a.test/ , http://192.168.31.43:5173 ,, ' })
        .ALLOWED_ORIGINS,
    ).toEqual(['https://a.test', 'http://192.168.31.43:5173']);
  });

  it('не принимает ALLOWED_ORIGINS с некорректным элементом', () => {
    expect(() => parseWith({ ALLOWED_ORIGINS: 'https://a.test,192.168.31.43:5173' })).toThrow(
      'ALLOWED_ORIGINS',
    );
  });
});

describe('parseEnv: COOKIE_SECURE', () => {
  it.each(['true', 'TRUE', '1', 'yes'])('включает secure при «%s»', (value) => {
    expect(parseWith({ COOKIE_SECURE: value }).COOKIE_SECURE).toBe(true);
  });

  it.each(['false', 'False', '0', 'no'])('выключает secure при «%s»', (value) => {
    expect(parseWith({ COOKIE_SECURE: value }).COOKIE_SECURE).toBe(false);
  });

  it('падает на опечатке вместо того, чтобы молча выбрать значение', () => {
    expect(() => parseWith({ COOKIE_SECURE: 'ture' })).toThrow('COOKIE_SECURE');
  });
});

describe('parseEnv: TRUST_PROXY', () => {
  it('превращает число прокси в number', () => {
    expect(parseWith({ TRUST_PROXY: '2' }).TRUST_PROXY).toBe(2);
  });

  it.each(['loopback', '10.0.0.0/8, loopback'])('передаёт «%s» как есть', (value) => {
    expect(parseWith({ TRUST_PROXY: value }).TRUST_PROXY).toBe(value);
  });
});

describe('env', () => {
  it('разобран из process.env', () => {
    expect(env).toEqual(parseEnv(process.env));
  });
});
