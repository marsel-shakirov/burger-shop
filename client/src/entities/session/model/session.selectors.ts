import type { SessionState } from './session.types';

export const selectUser = (state: SessionState) => state.user;

export const selectSessionStatus = (state: SessionState) => state.status;

export const selectIsAuthenticated = (state: SessionState) => state.status === 'authenticated';
