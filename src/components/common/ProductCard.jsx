import { Card, CardMedia, CardContent, CardActions, Box, Typography, Rating, Button, Skeleton, Chip, IconButton } from '@mui/material';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, discountPercent } from '../../utils/helpers';
import { DEFAULT_PRODUCT_IMAGE } from '../../utils/constants';

// ============================================================
// ProductCard — used in shop listing and featured sections
// ============================================================

export const ProductCardSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={220} />
    <CardContent sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
    </CardActions>
  </Card>
);

const ProductCard = ({ product, onAddToCart, isInCart = false }) => {
  const discount = discountPercent(product.originalPrice, product.price);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_PRODUCT_IMAGE;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
        },
        '&:hover .product-image': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <Chip
          label={`-${discount}%`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            fontWeight: 700,
            borderRadius: '6px',
          }}
        />
      )}

      {/* Wishlist */}
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '&:hover': { backgroundColor: 'white', color: 'error.main' },
        }}
      >
        <Heart size={16} />
      </IconButton>

      {/* Image */}
      <Box sx={{ overflow: 'hidden', bgcolor: 'grey.50' }}>
        <CardMedia
          component="img"
          height={220}
          image={product.images?.[0] || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography
          variant="caption"
          color="primary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          {product.category}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component={Link}
          to={`/products/${product.id}`}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mt: 0.25,
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s',
            lineHeight: 1.3,
            minHeight: '2.6em',
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.brand}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({product.reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1.5 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {formatCurrency(product.price)}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
              {formatCurrency(product.originalPrice)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant={isInCart ? 'outlined' : 'contained'}
          color="primary"
          startIcon={<ShoppingCart size={16} />}
          onClick={() => onAddToCart?.(product)}
          component={isInCart ? Link : 'button'}
          to={isInCart ? '/cart' : undefined}
          size="medium"
        >
          {isInCart ? 'View in Cart' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
