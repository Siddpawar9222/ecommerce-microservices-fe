import { Box, Typography, Button } from '@mui/material';
import { AlertCircle } from 'lucide-react';

// ============================================================
// ErrorMessage — inline error display for failed queries/mutations
// ============================================================

const ErrorMessage = ({ title = 'Something went wrong', message = '', onRetry = null, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'error.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          opacity: 0.2,
        }}
      />
      <AlertCircle size={32} color="#DC2626" style={{ marginBottom: 12 }} />
      <Typography variant="h6" color="error.main" gutterBottom>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mb: 3 }}>
          {message}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorMessage;
