import { selectIsAuthenticated, selectSessionStatus, selectUser } from './session.selectors';
import { useSessionStore } from './session.store';

export const useSessionUser = () => useSessionStore(selectUser);

export const useSessionStatus = () => useSessionStore(selectSessionStatus);

export const useIsAuthenticated = () => useSessionStore(selectIsAuthenticated);
