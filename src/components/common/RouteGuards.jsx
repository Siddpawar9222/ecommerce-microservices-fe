import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROLES } from '../../utils/constants';

// ============================================================
// Route Guards
// ============================================================

/**
 * Requires authentication. Redirects unauthenticated users to /login.
 */
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Requires a specific role. Redirects unauthorized users to /unauthorized.
 */
export const RequireRole = ({ children, roles }) => {
  const { isAuthenticated, role, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/**
 * Redirects authenticated users away from /login.
 */
export const GuestOnly = ({ children }) => {
  const { isAuthenticated, role, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
    if (role === ROLES.INVENTORY_MANAGER) return <Navigate to="/inventory/dashboard" replace />;
    return <Navigate to="/shop" replace />;
  }

  return children;
};
