import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../features/auth/authSlice';
import { RequireAuth, RequireRole, GuestOnly } from '../RouteGuards';
import { ROLES } from '../../../utils/constants';

const createMockStore = (initialAuthState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        ...initialAuthState,
      },
    },
  });
};

describe('RouteGuards', () => {
  it('redirects unauthenticated user to /login when accessing RequireAuth', () => {
    const store = createMockStore({ user: null, isInitialized: true });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <div>Secret Content</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders protected content when user is authenticated in RequireAuth', () => {
    const store = createMockStore({
      user: { id: 'usr-1', name: 'John', role: ROLES.CUSTOMER },
      isInitialized: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <div>Secret Content</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('redirects unauthorized role to /unauthorized in RequireRole', () => {
    const store = createMockStore({
      user: { id: 'usr-1', name: 'John', role: ROLES.CUSTOMER },
      isInitialized: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <RequireRole roles={[ROLES.ADMIN]}>
                  <div>Admin Panel</div>
                </RequireRole>
              }
            />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Unauthorized Access')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('allows authorized role to access RequireRole route', () => {
    const store = createMockStore({
      user: { id: 'usr-2', name: 'Admin', role: ROLES.ADMIN },
      isInitialized: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <RequireRole roles={[ROLES.ADMIN]}>
                  <div>Admin Panel</div>
                </RequireRole>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
