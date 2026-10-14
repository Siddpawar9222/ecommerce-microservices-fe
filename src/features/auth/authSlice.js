import { createSlice } from '@reduxjs/toolkit';

// ============================================================
// Auth Slice — manages current user and auth state
// ============================================================

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false, // true after initial session check
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
    },
    loginFailure(state, action) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = action.payload;
      state.isInitialized = true;
    },
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
    setInitialized(state, action) {
      state.isInitialized = true;
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  setInitialized,
  clearError,
} = authSlice.actions;

// --- Selectors ---
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role ?? null;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;

export default authSlice.reducer;
