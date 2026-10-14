import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Select, MenuItem, FormControl,
  InputLabel, Pagination, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, Divider, Stack,
} from '@mui/material';
import { Search, Eye, RefreshCw, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderRepository } from '../../../services/repositories';
import { OrderStatusBadge, PaymentStatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import Toast from '../../../components/feedback/Toast';
import EmptyState from '../../../components/feedback/EmptyState';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrderListPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', page, status, search],
    queryFn: () => orderRepository.getOrders({
      page,
      pageSize,
      status: status === 'ALL' ? '' : status,
      search,
    }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => orderRepository.updateOrderStatus(id, newStatus),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setToast({
        open: true,
        message: `Order #${updated.id} status updated to ${updated.status}.`,
        severity: 'success',
      });
      setSelectedOrder(null);
    },
    onError: (err) => {
      setToast({ open: true, message: err?.message || 'Failed to update order status', severity: 'error' });
    },
  });

  const orders = data?.items || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setStatusToUpdate(order.status);
  };

  const handleSaveStatus = () => {
    if (selectedOrder && statusToUpdate) {
      updateStatusMutation.mutate({ id: selectedOrder.id, newStatus: statusToUpdate });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Order Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track customer purchases, update fulfillment status, and monitor payments.
        </Typography>
      </Box>

      {/* Filter and Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Search by Order ID, customer name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ flex: 1, minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#6B7280" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Paper>

      {/* Orders Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Date Placed</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{order.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{order.customerEmail}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items?.length || 0} items
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(order.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Eye size={14} />}
                      onClick={() => handleOpenDetail(order)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>

      {/* Order Status & Detail Modal */}
      {selectedOrder && (
        <Dialog
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              Order #{selectedOrder.id} Details
            </Typography>
            <IconButton onClick={() => setSelectedOrder(null)} size="small">
              <X size={18} />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedOrder.customerName} ({selectedOrder.customerEmail})</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Items Ordered</Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {selectedOrder.items?.map((it, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{it.name} x {it.quantity}</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatCurrency((it.unitPrice || it.price) * it.quantity)}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" fontWeight={700}>Total Amount</Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main">{formatCurrency(selectedOrder.total)}</Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Update Order Status</InputLabel>
                <Select
                  value={statusToUpdate}
                  label="Update Order Status"
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                >
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                  <MenuItem value="SHIPPED">SHIPPED</MenuItem>
                  <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                  <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSelectedOrder(null)} variant="outlined">
              Close
            </Button>
            <Button
              onClick={handleSaveStatus}
              variant="contained"
              loading={updateStatusMutation.isPending}
            >
              Save Status
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Toast */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

export default AdminOrderListPage;
