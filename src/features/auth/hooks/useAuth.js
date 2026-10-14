import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { authRepository } from '../../../services/repositories';
import {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  setInitialized,
  clearError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
} from '../authSlice';


// ============================================================
// useAuth — auth operations and state
// ============================================================

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isInitialized = useSelector(selectIsInitialized);

  const login = useCallback(
    async (credentials) => {
      dispatch(setAuthLoading());
      try {
        const result = await authRepository.login(credentials);
        dispatch(loginSuccess(result));
        return result;
      } catch (err) {
        dispatch(loginFailure(err.message || 'Login failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authRepository.logout();
    } catch {
      // Swallow errors — always clear local state
    } finally {
      dispatch(logoutSuccess());
    }
  }, [dispatch]);

  const initSession = useCallback(async () => {
    try {
      const result = await authRepository.getCurrentUser();
      if (result) {
        dispatch(setInitialized({ user: result, token: null }));
      } else {
        dispatch(setInitialized(null));
      }
    } catch {
      dispatch(setInitialized(null));
    }
  }, [dispatch]);

  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    isAuthenticated,
    role,
    isLoading,
    error,
    isInitialized,
    login,
    logout,
    initSession,
    dismissError,
  };
};
