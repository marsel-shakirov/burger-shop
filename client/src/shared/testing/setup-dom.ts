import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { installDomPolyfills } from './dom-polyfills';

installDomPolyfills();

afterEach(() => {
  cleanup();
  localStorage.clear();
});
