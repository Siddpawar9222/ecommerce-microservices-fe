import {
  Box, Container, Typography, Grid, Paper, Button, IconButton, Divider, Alert,
  TextField, InputAdornment, Chip,
} from '@mui/material';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart,
} from '../cartSlice';
import { formatCurrency } from '../../../utils/helpers';
import EmptyState from '../../../components/feedback/EmptyState';
import { DEFAULT_PRODUCT_IMAGE } from '../../../utils/constants';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const { subtotal, shipping, tax, total } = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse our collection and find something you love."
          action={{ label: 'Continue Shopping', onClick: () => {} }}
        />
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" component={Link} to="/shop" startIcon={<ArrowLeft size={16} />}>
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Shopping Cart
        <Chip label={`${items.reduce((s, i) => s + i.quantity, 0)} items`} size="small" sx={{ ml: 1.5, fontWeight: 600 }} />
      </Typography>

      <Grid container spacing={3}>
        {/* Cart items */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}
          >
            {items.map((item, idx) => (
              <Box key={item.productId}>
                {idx > 0 && <Divider />}
                <Box sx={{ p: 3 }}>
                  {/* Top row: image + product info */}
                  <Box sx={{ display: 'flex', gap: 2.5, mb: 2 }}>
                    <Box
                      component="img"
                      src={item.image || DEFAULT_PRODUCT_IMAGE}
                      alt={item.name}
                      onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                      sx={{
                        width: 88, height: 88, borderRadius: 2, objectFit: 'cover',
                        bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component={Link}
                        to={`/products/${item.productId}`}
                        sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight={600} sx={{ mt: 0.25 }}>
                        {formatCurrency(item.price)} each
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bottom row: quantity controls + line total + remove */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {/* Quantity stepper */}
                    <Box
                      sx={{
                        display: 'flex', alignItems: 'center', border: '1.5px solid', borderColor: 'divider',
                        borderRadius: 2, overflow: 'hidden',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        sx={{ borderRadius: 0 }}
                      >
                        <Minus size={14} />
                      </IconButton>
                      <Typography sx={{ px: 2, fontWeight: 700, minWidth: 36, textAlign: 'center', fontSize: '0.9375rem' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        disabled={item.quantity >= 10}
                        sx={{ borderRadius: 0 }}
                      >
                        <Plus size={14} />
                      </IconButton>
                    </Box>

                    {/* Line total */}
                    <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1, textAlign: { xs: 'left', sm: 'right' } }}>
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>

                    {/* Remove */}
                    <IconButton
                      size="small"
                      onClick={() => dispatch(removeFromCart(item.productId))}
                      color="error"
                      sx={{ border: '1px solid', borderColor: 'error.light', borderRadius: 1.5 }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Cart actions */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Button
                component={Link}
                to="/shop"
                startIcon={<ArrowLeft size={16} />}
                variant="outlined"
                size="small"
              >
                Continue Shopping
              </Button>
              <Button
                color="error"
                variant="text"
                size="small"
                startIcon={<Trash2 size={16} />}
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order summary */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Shipping</Typography>
                <Typography variant="body2" color={shipping === 0 ? 'success.main' : 'text.primary'}>
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Tax (9%)</Typography>
                <Typography variant="body2">{formatCurrency(tax)}</Typography>
              </Box>
            </Box>

            {shipping > 0 && (
              <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
                <Typography variant="caption">
                  Add {formatCurrency(100 - subtotal)} more for free shipping
                </Typography>
              </Alert>
            )}

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="primary">
                {formatCurrency(total)}
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/checkout"
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
            >
              Proceed to Checkout
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {['Visa', 'Mastercard', 'PayPal', 'UPI'].map((p) => (
                <Chip key={p} label={p} size="small" variant="outlined" sx={{ fontSize: '0.7rem', borderRadius: '6px' }} />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
