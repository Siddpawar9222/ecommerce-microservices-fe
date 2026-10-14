import { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Divider, Skeleton, Card, CardContent,
  Stack, Avatar, Step, Stepper, StepLabel,
} from '@mui/material';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, CreditCard } from 'lucide-react';
import { orderRepository } from '../../../services/repositories';
import { OrderStatusBadge, PaymentStatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import ErrorMessage from '../../../components/feedback/ErrorMessage';
import Toast from '../../../components/feedback/Toast';

const ORDER_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const { data: order, isLoading, isError, refetch } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: () => orderRepository.getOrderById(orderId),
    enabled: !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderRepository.cancelOrder(orderId),
    onSuccess: (updated) => {
      queryClient.setQueryData(['order-detail', orderId], updated);
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      setToast({ open: true, message: 'Order has been successfully cancelled.', severity: 'success' });
      setCancelDialogOpen(false);
    },
    onError: (err) => {
      setToast({ open: true, message: err?.message || 'Failed to cancel order.', severity: 'error' });
    },
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={240} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ErrorMessage
          title="Order not found"
          message={`Unable to find order details for #${orderId}.`}
          onRetry={refetch}
        />
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button component={RouterLink} to="/my-orders" startIcon={<ArrowLeft size={16} />}>
            Back to My Orders
          </Button>
        </Box>
      </Container>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const activeStep = ORDER_STEPS.indexOf(order.status);
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        component={RouterLink}
        to="/my-orders"
        startIcon={<ArrowLeft size={16} />}
        sx={{ mb: 3 }}
      >
        Back to My Orders
      </Button>

      {/* Header card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" fontWeight={700}>
                Order #{order.id}
              </Typography>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)} • Estimated delivery by {formatDate(order.estimatedDelivery)}
            </Typography>
          </Box>

          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setCancelDialogOpen(true)}
              startIcon={<XCircle size={16} />}
            >
              Cancel Order
            </Button>
          )}
        </Box>

        {/* Stepper tracking */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {isCancelled ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
              <XCircle size={22} />
              <Typography variant="subtitle1" fontWeight={600}>
                This order was cancelled
              </Typography>
            </Box>
          ) : (
            <Stepper activeStep={activeStep >= 0 ? activeStep : 0} alternativeLabel>
              {ORDER_STEPS.map((step) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Box>
      </Paper>

      {/* Order Content */}
      <Grid container spacing={3}>
        {/* Items List */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Items in Order ({order.items.length})
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.productId || item.name} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.image ? (
                            <Avatar
                              src={item.image}
                              variant="rounded"
                              sx={{ width: 48, height: 48 }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1.5,
                                bgcolor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Package size={20} color="#888" />
                            </Box>
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {item.name || item.productName}
                            </Typography>
                            {item.sku && (
                              <Typography variant="caption" color="text.secondary">
                                SKU: {item.sku}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(item.unitPrice || item.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700}>
                          {formatCurrency((item.unitPrice || item.price) * item.quantity)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Delivery address */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <MapPin size={18} color="#4F46E5" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Shipping Address
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {order.shippingAddress?.fullName || order.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress?.addressLine1 || order.shippingAddress?.line1}
                  {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode || order.shippingAddress?.zip}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress?.country || 'United States'}
                </Typography>
                {order.shippingAddress?.phone && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Phone: {order.shippingAddress.phone}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <CreditCard size={18} color="#4F46E5" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Order Summary
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Shipping</Typography>
                  <Typography variant="body2">
                    {order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Estimated Tax</Typography>
                  <Typography variant="body2">{formatCurrency(order.tax)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    {formatCurrency(order.total)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Payment Method: <strong>{order.paymentMethod || 'Credit Card'}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        confirmColor="error"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate()}
        onClose={() => setCancelDialogOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
};

export default OrderDetailPage;
