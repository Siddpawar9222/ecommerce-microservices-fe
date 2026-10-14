import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import store from '../store/store';
import theme from '../theme/theme';
import { useAuth } from '../features/auth/hooks/useAuth';

// Create a persistent QueryClient with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AuthInitializer = ({ children }) => {
  const { initSession } = useAuth();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return children;
};

export const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthInitializer>{children}</AuthInitializer>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProviders;
