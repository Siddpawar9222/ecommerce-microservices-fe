import { Box, Typography, Button } from '@mui/material';
import { PackageSearch, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

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
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', md: '10rem' },
          fontWeight: 900,
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          mb: 2,
        }}
      >
        404
      </Typography>
      <PackageSearch size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
      <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380, mb: 4 }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<Home size={18} />}
        onClick={() => navigate('/')}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
