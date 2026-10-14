import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box, Container, Grid, Typography, Paper, Button, TextField, MenuItem, Select,
  FormControl, InputLabel, FormHelperText, Divider, Stepper, Step, StepLabel,
  Alert, CircularProgress, Chip, Radio, RadioGroup, FormControlLabel, FormLabel,
} from '@mui/material';
import { CreditCard, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { selectCartItems, selectCartTotal, clearCart } from '../../cart/cartSlice';
import { orderRepository, paymentRepository } from '../../../services/repositories';
import { formatCurrency } from '../../../utils/helpers';
import { checkoutSchema } from '../../../utils/validationSchemas';
import { PAYMENT_METHODS, DEFAULT_PRODUCT_IMAGE } from '../../../utils/constants';
import { useAuth } from '../../auth/hooks/useAuth';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector(selectCartItems);
  const { subtotal, shipping, tax, total } = useSelector(selectCartTotal);

  const [activeStep, setActiveStep] = useState(0);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address?.line1 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: 'US',
      paymentMethod: 'Credit Card',
      notes: '',
    },
  });

  const paymentMethod = watch('paymentMethod');

  // Create order mutation
  const orderMutation = useMutation({
    mutationFn: (formData) => {
      const orderData = {
        customerId: user?.id,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        items: cartItems.map((i) => ({
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
          imageUrl: i.image,
        })),
        shippingAddress: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };
      return orderRepository.createOrder(orderData);
    },
    onSuccess: async (order) => {
      setCreatedOrder(order);
      setActiveStep(1);
      // Auto-initiate payment
      try {
        const payment = await paymentRepository.initiatePayment({
          orderId: order.id,
          customerId: user?.id,
          amount: order.total,
          method: order.paymentMethod,
        });
        setPaymentResult({ success: true, payment });
        // Update order status
        await orderRepository.updateOrderStatus(order.id, 'CONFIRMED');
        setActiveStep(2);
        dispatch(clearCart());
      } catch (err) {
        setPaymentError(err.message || 'Payment failed');
        setPaymentResult({ success: false, error: err.message });
        setActiveStep(2);
      }
    },
  });

  const onSubmit = async (formData) => {
    if (cartItems.length === 0) return;
    setPaymentError('');
    orderMutation.mutate(formData);
  };

  const isProcessing = orderMutation.isPending;

  // Step 0: Shipping form
  const ShippingStep = () => (
    <Box component="form" id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField label="First Name" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} id="checkout-firstName" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Last Name" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} id="checkout-lastName" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} id="checkout-email" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} id="checkout-phone" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Street Address" {...register('address')} error={!!errors.address} helperText={errors.address?.message} id="checkout-address" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="City" {...register('city')} error={!!errors.city} helperText={errors.city?.message} id="checkout-city" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="State" {...register('state')} error={!!errors.state} helperText={errors.state?.message} id="checkout-state" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="ZIP Code" {...register('zip')} error={!!errors.zip} helperText={errors.zip?.message} id="checkout-zip" />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small" error={!!errors.paymentMethod}>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Payment Method</FormLabel>
            <RadioGroup row defaultValue="Credit Card">
              {PAYMENT_METHODS.map((method) => (
                <FormControlLabel
                  key={method}
                  value={method}
                  control={<Radio size="small" {...register('paymentMethod')} />}
                  label={<Typography variant="body2">{method}</Typography>}
                />
              ))}
            </RadioGroup>
            {errors.paymentMethod && <FormHelperText>{errors.paymentMethod.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Order Notes (optional)"
            {...register('notes')}
            multiline
            rows={2}
            error={!!errors.notes}
            helperText={errors.notes?.message}
            id="checkout-notes"
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Step 1: Processing
  const PaymentStep = () => (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <CircularProgress size={56} sx={{ mb: 3 }} />
      <Typography variant="h5" fontWeight={700} gutterBottom>Processing Your Payment</Typography>
      <Typography color="text.secondary">
        Please wait while we securely process your {paymentMethod} payment…
      </Typography>
      <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 2 }}>
        Do not close or refresh this page
      </Typography>
    </Box>
  );

  // Step 2: Confirmation
  const ConfirmationStep = () => {
    const success = paymentResult?.success;
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box
          sx={{
            width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 3,
            bgcolor: success ? 'success.light' : 'error.light',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {success
            ? <Check size={40} color="#059669" />
            : <AlertCircle size={40} color="#DC2626" />}
        </Box>

        <Typography variant="h4" fontWeight={800} gutterBottom>
          {success ? 'Order Confirmed!' : 'Payment Failed'}
        </Typography>

        {success ? (
          <>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Thank you for your order! We've sent a confirmation to <strong>{createdOrder?.customerEmail}</strong>.
            </Typography>
            <Chip label={`Order #${createdOrder?.id}`} color="success" variant="outlined" sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={() => navigate('/my-orders')} startIcon={<ShoppingBag size={16} />}>
                View My Orders
              </Button>
              <Button variant="outlined" onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {paymentError || 'Payment was not completed. Your order has been placed but payment is pending.'}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your order <strong>#{createdOrder?.id}</strong> was created but payment was not confirmed. Please try again from your orders page.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" color="error" onClick={() => navigate('/my-orders')}>
                View Order & Retry
              </Button>
              <Button variant="outlined" onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Box>
    );
  };

  if (cartItems.length === 0 && activeStep === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/shop')}>Browse Products</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Checkout</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Left: form */}
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 2.5, md: 4 } }}>
            {activeStep === 0 && <ShippingStep />}
            {activeStep === 1 && <PaymentStep />}
            {activeStep === 2 && <ConfirmationStep />}
          </Paper>
        </Grid>

        {/* Right: order summary */}
        <Grid item xs={12} lg={5}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Order Summary ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Items */}
            <Box sx={{ maxHeight: 260, overflowY: 'auto', mb: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.productId} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                  <Box
                    component="img"
                    src={item.image || DEFAULT_PRODUCT_IMAGE}
                    onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                    alt={item.name}
                    sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700}>{formatCurrency(item.price * item.quantity)}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 1.5 }} />
            {[
              ['Subtotal', formatCurrency(subtotal)],
              ['Shipping', shipping === 0 ? 'FREE' : formatCurrency(shipping)],
              ['Tax (9%)', formatCurrency(tax)],
            ].map(([label, value]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2">{value}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="primary">{formatCurrency(total)}</Typography>
            </Box>

            {activeStep === 0 && (
              <Button
                type="submit"
                form="checkout-form"
                fullWidth
                variant="contained"
                size="large"
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={18} color="inherit" /> : <CreditCard size={18} />}
              >
                {isProcessing ? 'Processing…' : `Pay ${formatCurrency(total)}`}
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
