type UnauthorizedListener = () => void;

const listeners = new Set<UnauthorizedListener>();

export const onUnauthorized = (listener: UnauthorizedListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const notifyUnauthorized = () => {
  listeners.forEach((listener) => listener());
};
