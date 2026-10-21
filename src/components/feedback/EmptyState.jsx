import { Box, Typography, Button } from '@mui/material';
import { PackageSearch } from 'lucide-react';

// ============================================================
// EmptyState — used for empty lists, no search results, etc.
// ============================================================

const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'Nothing here yet',
  description = '',
  action = null,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        px: 2,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 16px rgba(37,99,235,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <Icon size={36} color="#6B7280" />
      </Box>
      <Typography variant="h6" color="text.primary" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mb: 3 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button variant="contained" onClick={action.onClick} size="large">
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
