import { createHash } from 'node:crypto';

const RANGE_URL = 'https://api.pwnedpasswords.com/range/';
const TIMEOUT_MS = 2000;

export async function isPasswordPwned(password: string): Promise<boolean> {
  const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(`${RANGE_URL}${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(`Pwned Passwords check skipped: HTTP ${response.status}`);
      return false;
    }

    const body = await response.text();

    return body.split('\r\n').some((line) => {
      const [lineSuffix, count] = line.split(':');
      return lineSuffix === suffix && Number(count) > 0;
    });
  } catch (error) {
    console.warn('Pwned Passwords check skipped', error);
    return false;
  }
}
