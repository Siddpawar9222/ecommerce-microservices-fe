// ============================================================
// Mock Auth Repository
// Implements the auth contract using in-memory mock data.
// IMPORTANT: This is for demo/learning purposes only.
//            Real auth must use the Identity Service + JWT.
// ============================================================

import { MOCK_CREDENTIALS, MOCK_USERS } from '../data/users';
import { withDelay, generateId } from '../utils/mockHelpers';

const SESSION_KEY = '_mock_session';

// Load persisted demo session on startup
const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveSession = (user) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};

// --- Mock Auth Repository ---

/**
 * Authenticate user with email + password.
 * @returns {{ user, token }} on success
 * @throws {{ message }} on failure
 */
const login = async ({ email, password }) => {
  return withDelay(() => {
    const cred = MOCK_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.passwordPlain === password
    );

    if (!cred) {
      throw { message: 'Invalid email or password. Please check your credentials.' };
    }

    const user = MOCK_USERS.find((u) => u.id === cred.userId);
    if (!user) {
      throw { message: 'User account not found.' };
    }

    // Fake token — never use for real security
    const token = `mock-token-${generateId()}`;
    const session = { user, token };
    saveSession(session);
    return session;
  });
};

/**
 * Return the currently logged-in user from session.
 * @returns {object|null}
 */
const getCurrentUser = async () => {
  return withDelay(() => {
    const session = loadSession();
    return session ? session.user : null;
  });
};

/**
 * Log out the current user.
 */
const logout = async () => {
  return withDelay(() => {
    clearSession();
    return { success: true };
  });
};

export const mockAuthRepository = {
  login,
  getCurrentUser,
  logout,
};
