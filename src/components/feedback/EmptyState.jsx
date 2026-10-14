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
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Icon size={32} color="#9CA3AF" />
      </Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
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
