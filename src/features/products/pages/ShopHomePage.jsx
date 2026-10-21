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

const categoryThemes = [
  { bg: '#EFF6FF', color: '#1D4ED8' }, // Electronics - Blue
  { bg: '#F5F3FF', color: '#6D28D9' }, // Clothing - Purple
  { bg: '#FFFBEB', color: '#B45309' }, // Books - Amber
  { bg: '#ECFDF5', color: '#047857' }, // Home & Kitchen - Emerald
  { bg: '#FEF2F2', color: '#B91C1C' }, // Sports & Outdoors - Rose
  { bg: '#FDF2F8', color: '#BE185D' }, // Beauty & Health - Pink
  { bg: '#F0FDFA', color: '#0F766E' }, // Toys & Games - Teal
];

const ValuePropsRow = () => (
  <Box sx={{ bgcolor: 'grey.50', py: 5, borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100', color: '#2563EB', bg: '#EFF6FF' },
          { icon: Shield, title: 'Secure Checkout', desc: '100% protected payments', color: '#059669', bg: '#ECFDF5' },
          { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free policy', color: '#7C3AED', bg: '#F5F3FF' },
          { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: '#D97706', bg: '#FFFBEB' },
        ].map(({ icon: Icon, title, desc, color, bg }) => (
          <Grid item xs={6} md={3} key={title}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 56, height: 56, borderRadius: '50%', bgcolor: bg,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  mb: 1.5, transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.08)' },
                }}
              >
                <Icon size={26} color={color} />
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

            {/* Hero image / interactive card preview */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 25px 60px -15px rgba(30, 58, 138, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.4)',
                  ml: 'auto',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.75,
                }}
              >
                {/* Header inside floating card */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 8px rgba(37,99,235,0.6)' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.dark', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ⚡ Popular in Cart
                    </Typography>
                  </Box>
                  <Chip
                    label="3 items"
                    size="small"
                    sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#EFF6FF', color: 'primary.main', border: '1px solid #BFDBFE' }}
                  />
                </Box>

                {/* Mock product cards */}
                {[
                  {
                    emoji: '🎧',
                    name: 'Premium Headphones',
                    price: '$299',
                    badge: '⭐ 4.9 Rating',
                    badgeBg: '#FEF3C7',
                    badgeColor: '#B45309',
                    iconBg: '#EFF6FF',
                  },
                  {
                    emoji: '💻',
                    name: 'Ultra Laptop Pro',
                    price: '$1,499',
                    badge: '🔥 Best Seller',
                    badgeBg: '#FEE2E2',
                    badgeColor: '#DC2626',
                    iconBg: '#EEF2FF',
                  },
                  {
                    emoji: '👟',
                    name: 'Sport Runner Shoes',
                    price: '$89',
                    badge: '🏷️ 20% OFF',
                    badgeBg: '#DCFCE7',
                    badgeColor: '#15803D',
                    iconBg: '#ECFDF5',
                  },
                ].map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: 2.5,
                      p: 1.5,
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#EFF6FF',
                        borderColor: '#BFDBFE',
                        transform: 'translateX(3px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '1.5rem',
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: item.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.emoji}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.25 }} noWrap>
                        {item.name}
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          mt: 0.5,
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                          bgcolor: item.badgeBg,
                          color: item.badgeColor,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.badge}
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark', flexShrink: 0 }}>
                      {item.price}
                    </Typography>
                  </Box>
                ))}

                {/* Cart total bar */}
                <Box
                  sx={{
                    mt: 0.5,
                    borderRadius: 2.5,
                    bgcolor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        bgcolor: '#DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      🛒
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#1E3A8A', lineHeight: 1.2 }}>
                        Cart Total
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.72rem', fontWeight: 600 }}>
                        Free shipping applied 🎉
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                      borderRadius: 2,
                      px: 2,
                      py: 0.65,
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                      $1,887.00
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">Shop by Category</Typography>
            <Typography variant="body2" color="text.secondary">Explore our wide selection of collections</Typography>
          </Box>
          <Button component={Link} to="/shop" endIcon={<ArrowRight size={16} />} size="small" sx={{ fontWeight: 700 }}>
            All categories
          </Button>
        </Box>
        <Grid container spacing={2}>
          {CATEGORIES.map((cat, idx) => {
            const theme = categoryThemes[idx] || { bg: '#EFF6FF', color: '#1D4ED8' };
            return (
              <Grid item xs={6} sm={4} md={3} lg={true} key={cat}>
                <Card
                  component={Link}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  sx={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2.5,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    bgcolor: 'background.paper',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(37,99,235,0.12)',
                      borderColor: theme.color,
                      '& .cat-icon-box': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <Box
                    className="cat-icon-box"
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      bgcolor: theme.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      mb: 1.5,
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {categoryIcons[idx]}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    textAlign="center"
                    color="text.primary"
                    sx={{ fontSize: '0.875rem', lineHeight: 1.25 }}
                  >
                    {cat}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
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
