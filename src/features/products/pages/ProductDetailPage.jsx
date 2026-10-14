import { useState } from 'react';
import {
  Box, Container, Grid, Typography, Button, Rating, Chip, Divider, Skeleton,
  ToggleButton, ToggleButtonGroup, Alert, Breadcrumbs, Link as MuiLink, IconButton,
} from '@mui/material';
import { ShoppingCart, Heart, Share2, ChevronRight, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { productRepository } from '../../../services/repositories';
import { addToCart, selectCartItems } from '../../cart/cartSlice';
import { formatCurrency, discountPercent } from '../../../utils/helpers';
import { DEFAULT_PRODUCT_IMAGE } from '../../../utils/constants';
import ErrorMessage from '../../../components/feedback/ErrorMessage';
import Toast from '../../../components/feedback/Toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productRepository.getProductById(id),
    enabled: !!id,
  });

  const isInCart = cartItems.some((i) => i.productId === id);
  const discount = product ? discountPercent(product.originalPrice, product.price) : 0;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    setToast({ open: true, message: `${quantity}× "${product.name}" added to cart!`, severity: 'success' });
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_PRODUCT_IMAGE;
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={460} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="80%" height={48} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={52} sx={{ mt: 3, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <ErrorMessage
          title="Product not found"
          message="This product doesn't exist or has been removed."
          onRetry={refetch}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<ChevronRight size={14} />} sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/shop" color="text.secondary" underline="hover" sx={{ fontSize: '0.8125rem' }}>
          Shop
        </MuiLink>
        <MuiLink
          component={Link}
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          color="text.secondary"
          underline="hover"
          sx={{ fontSize: '0.8125rem' }}
        >
          {product.category}
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.8125rem' }}>
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={5}>
        {/* Images */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider',
              mb: 2,
              position: 'relative',
            }}
          >
            {discount > 0 && (
              <Chip
                label={`-${discount}%`}
                color="error"
                sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, fontWeight: 700 }}
              />
            )}
            <Box
              component="img"
              src={product.images?.[selectedImage] || DEFAULT_PRODUCT_IMAGE}
              alt={product.name}
              onError={handleImageError}
              sx={{
                width: '100%',
                height: { xs: 300, md: 460 },
                objectFit: 'cover',
                transition: 'opacity 0.3s',
              }}
            />
          </Box>

          {/* Thumbnail strip */}
          {product.images?.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
              {product.images.map((img, idx) => (
                <Box
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  sx={{
                    width: 72, height: 72, borderRadius: 2, overflow: 'hidden',
                    border: '2px solid',
                    borderColor: selectedImage === idx ? 'primary.main' : 'divider',
                    cursor: 'pointer', flexShrink: 0, bgcolor: 'grey.50',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    onError={handleImageError}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="overline" color="primary" fontWeight={600} letterSpacing="0.1em">
            {product.brand}
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5, mb: 1, lineHeight: 1.2 }}>
            {product.name}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating} ({product.reviewCount} reviews)
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              {formatCurrency(product.price)}
            </Typography>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                  {formatCurrency(product.originalPrice)}
                </Typography>
                <Chip label={`Save ${formatCurrency(product.originalPrice - product.price)}`} color="success" size="small" />
              </>
            )}
          </Box>

          {/* Short description */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            {product.shortDescription}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Quantity */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              QTY
            </Typography>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', border: '1.5px solid', borderColor: 'divider',
                borderRadius: 2, overflow: 'hidden',
              }}
            >
              <IconButton size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} sx={{ borderRadius: 0 }}>
                <Minus size={16} />
              </IconButton>
              <Typography sx={{ px: 2, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{quantity}</Typography>
              <IconButton size="small" onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10} sx={{ borderRadius: 0 }}>
                <Plus size={16} />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary">Max 10 per order</Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              color={isInCart ? 'success' : 'primary'}
            >
              {isInCart ? 'Add More to Cart' : 'Add to Cart'}
            </Button>
            {isInCart && (
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/cart"
              >
                View Cart
              </Button>
            )}
            <IconButton
              sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 2, flexShrink: 0 }}
            >
              <Heart size={20} />
            </IconButton>
          </Box>

          {/* Shipping info */}
          <Alert severity="success" sx={{ mb: 3 }}>
            ✓ {product.price >= 100 ? 'Qualifies for free shipping' : `Add ${formatCurrency(100 - product.price)} more for free shipping`}
          </Alert>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {product.tags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Description */}
      <Box sx={{ mt: 6, p: 4, bgcolor: 'white', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Product Description</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {product.description}
        </Typography>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </Container>
  );
};

export default ProductDetailPage;
