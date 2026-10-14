import { Box, Typography, Button } from '@mui/material';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../../../utils/constants';


const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const goHome = () => {
    if (role === ROLES.ADMIN) navigate('/admin/dashboard');
    else if (role === ROLES.INVENTORY_MANAGER) navigate('/inventory/dashboard');
    else navigate('/shop');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        p: 3,
        background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)',
      }}
    >
      <Box
        sx={{
          width: 96, height: 96, borderRadius: '50%', bgcolor: 'error.light',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, opacity: 0.9,
        }}
      >
        <ShieldOff size={44} color="#DC2626" />
      </Box>
      <Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="h6" fontWeight={400} color="error.main" gutterBottom>
        403 — Unauthorized
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mb: 4 }}>
        You don't have permission to view this page. This area requires a different role. Please contact an administrator if you believe this is an error.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<ArrowLeft size={18} />}
        onClick={goHome}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
