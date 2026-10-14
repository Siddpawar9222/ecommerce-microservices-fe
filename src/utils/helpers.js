// ============================================================
// Utility helpers
// ============================================================

/**
 * Format a number as USD currency.
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount ?? 0);
};

/**
 * Format a date string to a human-readable format.
 */
export const formatDate = (isoString, options = {}) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(isoString));
};

/**
 * Format a date with time.
 */
export const formatDateTime = (isoString) =>
  formatDate(isoString, { hour: '2-digit', minute: '2-digit' });

/**
 * Truncate text to a max length.
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
};

/**
 * Calculate discount percentage.
 */
export const discountPercent = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

/**
 * Get initials from a name string.
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
};

/**
 * Debounce a function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Parse sort param like "price_asc" into { sortBy, sortDir }
 */
export const parseSortParam = (param) => {
  if (!param) return { sortBy: 'createdAt', sortDir: 'desc' };
  const [sortBy, sortDir] = param.split('_');
  return { sortBy, sortDir };
};
