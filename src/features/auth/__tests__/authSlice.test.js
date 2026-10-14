import { describe, it, expect } from 'vitest';
import authReducer, {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  setInitialized,
  clearError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from '../authSlice';

describe('authSlice reducer & selectors', () => {
  const initialTestState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isInitialized: false,
  };

  const sampleUser = {
    id: 'usr-001',
    name: 'Alex Johnson',
    email: 'customer@demo.com',
    role: 'CUSTOMER',
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialTestState);
  });

  it('should handle setAuthLoading', () => {
    const nextState = authReducer(initialTestState, setAuthLoading());
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should handle loginSuccess', () => {
    const payload = { user: sampleUser, token: 'mock-token-xyz' };
    const nextState = authReducer(initialTestState, loginSuccess(payload));
    expect(nextState.user).toEqual(sampleUser);
    expect(nextState.token).toBe('mock-token-xyz');
    expect(nextState.isLoading).toBe(false);
    expect(nextState.isInitialized).toBe(true);
  });

  it('should handle loginFailure', () => {
    const nextState = authReducer(initialTestState, loginFailure('Invalid credentials'));
    expect(nextState.user).toBeNull();
    expect(nextState.error).toBe('Invalid credentials');
    expect(nextState.isLoading).toBe(false);
  });

  it('should handle logoutSuccess', () => {
    const loggedInState = {
      user: sampleUser,
      token: 'token',
      isLoading: false,
      error: null,
      isInitialized: true,
    };
    const nextState = authReducer(loggedInState, logoutSuccess());
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
  });

  it('should test selectors correctly', () => {
    const rootState = {
      auth: {
        user: sampleUser,
        token: 'token',
        isLoading: false,
        error: null,
        isInitialized: true,
      },
    };

    expect(selectCurrentUser(rootState)).toEqual(sampleUser);
    expect(selectIsAuthenticated(rootState)).toBe(true);
    expect(selectUserRole(rootState)).toBe('CUSTOMER');
  });
});
