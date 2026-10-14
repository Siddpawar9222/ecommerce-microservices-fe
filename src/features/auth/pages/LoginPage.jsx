import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box, Card, CardContent, Typography, TextField, Button, InputAdornment,
  IconButton, Alert, Divider, Chip, Stack, CircularProgress,
} from '@mui/material';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../authValidation';
import { ROLES } from '../../../utils/constants';


// Demo credentials for quick login
const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'customer@demo.com', password: 'Customer@123', color: 'primary', role: ROLES.CUSTOMER },
  { label: 'Admin', email: 'admin@demo.com', password: 'Admin@123', color: 'secondary', role: ROLES.ADMIN },
  { label: 'Inventory', email: 'inventory@demo.com', password: 'Inventory@123', color: 'success', role: ROLES.INVENTORY_MANAGER },
];

const getRoleRedirect = (role) => {
  if (role === ROLES.ADMIN) return '/admin/dashboard';
  if (role === ROLES.INVENTORY_MANAGER) return '/inventory/dashboard';
  return '/shop';
};

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await login(data);
      const redirect = from || getRoleRedirect(result.user.role);
      navigate(redirect, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    }
  };

  const quickLogin = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 50%, #FDF4FF 100%)',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3, bgcolor: 'primary.main',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1.5,
            }}
          >
            <ShoppingBag size={28} color="white" />
          </Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Shop<span style={{ color: '#7C3AED' }}>Hub</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to your account
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>

            {/* Demo quick-login */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Zap size={14} color="#D97706" />
                <Typography variant="caption" fontWeight={600} color="warning.main" textTransform="uppercase" letterSpacing="0.08em">
                  Quick Demo Login
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {DEMO_ACCOUNTS.map((account) => (
                  <Chip
                    key={account.role}
                    label={account.label}
                    color={account.color}
                    variant="outlined"
                    size="small"
                    clickable
                    onClick={() => quickLogin(account)}
                    sx={{ flex: 1, fontWeight: 600, cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary">or enter credentials</Typography>
            </Divider>

            {/* Server error */}
            {serverError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setServerError('')}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <TextField
                {...register('email')}
                label="Email Address"
                type="email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} color="#9CA3AF" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
                id="login-email"
              />

              {/* Password */}
              <TextField
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#9CA3AF" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
                id="login-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>
            </Box>

            {/* Credentials reference */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Demo Credentials
              </Typography>
              {DEMO_ACCOUNTS.map((a) => (
                <Box key={a.role} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{a.label}:</Typography>
                  <Typography variant="caption" fontFamily="monospace" color="text.primary">{a.email}</Typography>
                </Box>
              ))}
              <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                Passwords follow role name format (e.g. Customer@123)
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ mt: 2 }}>
          Portfolio demo only. No real data is stored or transmitted.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
