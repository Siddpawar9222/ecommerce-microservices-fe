import { Chip } from '@mui/material';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../utils/constants';

export const OrderStatusBadge = ({ status, size = 'small' }) => {
  const label = ORDER_STATUS_LABELS[status] || status;
  const color = ORDER_STATUS_COLORS[status] || 'default';
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      sx={{ fontWeight: 600, borderRadius: '6px' }}
    />
  );
};

export const PaymentStatusBadge = ({ status, size = 'small' }) => {
  const label = PAYMENT_STATUS_LABELS[status] || status;
  const color = PAYMENT_STATUS_COLORS[status] || 'default';
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600, borderRadius: '6px' }}
    />
  );
};
