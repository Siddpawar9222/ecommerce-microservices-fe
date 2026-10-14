import { Snackbar, Alert } from '@mui/material';

// ============================================================
// Toast notification component
// ============================================================

const Toast = ({ open, message, severity = 'success', onClose, duration = 4000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ minWidth: 300, boxShadow: 4 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
