export const readJson = <T>(response: Response) => response.json() as Promise<T>;
