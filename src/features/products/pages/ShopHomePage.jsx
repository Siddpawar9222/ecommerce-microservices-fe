import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Stack, Skeleton } from '@mui/material';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { productRepository } from '../../../services/repositories';
import { addToCart } from '../../cart/cartSlice';
import { selectIsInCart } from '../../cart/cartSlice';
import ProductCard, { ProductCardSkeleton } from '../../../components/common/ProductCard';
import { CATEGORIES } from '../../../mocks/data/products';

// ============================================================
// ShopHome — landing page for the customer storefront
// ============================================================

const categoryIcons = ['⚡', '👕', '📚', '🏠', '🏋️', '✨', '🎮'];

const ValuePropsRow = () => (
  <Box sx={{ bgcolor: 'grey.50', py: 5, borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
          { icon: Shield, title: 'Secure Checkout', desc: '100% protected payments' },
          { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free policy' },
          { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
        ].map(({ icon: Icon, title, desc }) => (
          <Grid item xs={6} md={3} key={title}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: '50%', bgcolor: 'primary.light',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  mb: 1.5, opacity: 0.85,
                }}
              >
                <Icon size={24} color="#2563EB" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
              <Typography variant="caption" color="text.secondary">{desc}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const ShopHomePage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  const { data: featured = [], isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productRepository.getFeaturedProducts(),
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 40%, #7C3AED 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        {[
          { size: 300, top: '-80px', right: '-80px', opacity: 0.06 },
          { size: 200, bottom: '-60px', left: '5%', opacity: 0.06 },
          { size: 150, top: '30%', right: '20%', opacity: 0.05 },
        ].map((s, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: s.size, height: s.size,
              borderRadius: '50%',
              bgcolor: 'white',
              opacity: s.opacity,
              top: s.top, bottom: s.bottom, left: s.left, right: s.right,
            }}
          />
        ))}

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="🚀 New arrivals every week"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, mb: 3, backdropFilter: 'blur(4px)' }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 2.5,
                  letterSpacing: '-0.03em',
                }}
              >
                Shop Smarter,{' '}
                <Box component="span" sx={{ opacity: 0.85, textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.4)' }}>
                  Live Better
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 400, opacity: 0.85, mb: 4, maxWidth: 480, lineHeight: 1.6 }}
              >
                Discover thousands of premium products — electronics, fashion, books, and more — all in one place with fast, free shipping.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)' },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  to="/shop?category=Electronics"
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Explore Electronics
                </Button>
              </Stack>

              {/* Stats */}
              <Stack direction="row" spacing={4} sx={{ mt: 5 }}>
                {[
                  { value: '10K+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '4.8★', label: 'Rating' },
                ].map(({ value, label }) => (
                  <Box key={label}>
                    <Typography variant="h5" fontWeight={800}>{value}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>{label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Hero image / illustration */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80"
                alt="Shopping experience"
                onError={(e) => { e.target.style.display = 'none'; }}
                sx={{
                  width: '100%',
                  maxWidth: 520,
                  borderRadius: 4,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                  display: 'block',
                  ml: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>Shop by Category</Typography>
          <Button component={Link} to="/shop" endIcon={<ArrowRight size={16} />} size="small">
            All categories
          </Button>
        </Box>
        <Grid container spacing={2}>
          {CATEGORIES.map((cat, idx) => (
            <Grid item xs={6} sm={4} md={3} lg={12 / 7} key={cat}>
              <Card
                component={Link}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2.5,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(37,99,235,0.12)',
                    borderColor: 'primary.light',
                  },
                }}
              >
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{categoryIcons[idx]}</Typography>
                <Typography variant="caption" fontWeight={600} textAlign="center" color="text.primary">
                  {cat}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>Featured Products</Typography>
            <Typography variant="body2" color="text.secondary">Hand-picked favourites for you</Typography>
          </Box>
          <Button component={Link} to="/shop" endIcon={<ArrowRight size={16} />} size="small">
            View all
          </Button>
        </Box>
        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <ProductCardSkeleton />
                </Grid>
              ))
            : featured.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isInCart={cartItems.some((i) => i.productId === product.id)}
                  />
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* Banner */}
      <Box
        sx={{
          mx: { xs: 2, md: 4 },
          mb: 6,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Free Shipping on Orders Over $100 🎉
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
          No coupon needed. Add qualifying items to your cart and enjoy free delivery.
        </Typography>
        <Button
          component={Link}
          to="/shop"
          variant="contained"
          size="large"
          sx={{ bgcolor: 'white', color: 'secondary.main', fontWeight: 700, '&:hover': { bgcolor: 'grey.100' } }}
        >
          Start Shopping
        </Button>
      </Box>

      <ValuePropsRow />
    </Box>
  );
};

export default ShopHomePage;
