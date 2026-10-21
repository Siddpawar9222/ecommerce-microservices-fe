import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Avatar, Menu, MenuItem,
  Divider, Container, InputBase, Drawer, List, ListItem, ListItemText, ListItemButton,
} from '@mui/material';
import { ShoppingCart, Search, Menu as MenuIcon, Package, User, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { selectCartCount } from '../../features/cart/cartSlice';
import { getInitials } from '../../utils/helpers';
import { CATEGORIES } from '../../mocks/data/products';

// ============================================================
// Customer-facing Navbar
// ============================================================

const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserMenu = (e) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ backgroundColor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 }, py: 0.5 }}>
            {/* Mobile menu button */}
            <IconButton sx={{ mr: 1, display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
              <MenuIcon size={22} color="#374151" />
            </IconButton>

            {/* Logo */}
            <Typography
              component={Link}
              to="/shop"
              variant="h5"
              fontWeight={800}
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                letterSpacing: '-0.03em',
                mr: 4,
                flexShrink: 0,
              }}
            >
              Shop<span style={{ color: '#7C3AED' }}>Hub</span>
            </Typography>

            {/* Nav links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 3 }}>
              {['Shop', 'Electronics', 'Clothing', 'Books'].map((item) => (
                <Button
                  key={item}
                  component={Link}
                  to={item === 'Shop' ? '/shop' : `/shop?category=${encodeURIComponent(item)}`}
                  sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.875rem', px: 1.5 }}
                >
                  {item}
                </Button>
              ))}
            </Box>

            {/* Search */}
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                backgroundColor: 'grey.50',
                borderRadius: 2,
                border: '1.5px solid',
                borderColor: 'grey.200',
                px: 1.5,
                py: 0.75,
                mr: 2,
                '&:focus-within': { borderColor: 'primary.main', backgroundColor: 'white' },
                transition: 'all 0.2s',
              }}
            >
              <Search size={18} color="#9CA3AF" />
              <InputBase
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                inputProps={{ 'aria-label': 'search products' }}
              />
            </Box>

            {/* Right actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
              {/* Orders */}
              <IconButton
                component={Link}
                to="/my-orders"
                sx={{ color: 'text.secondary' }}
                title="My Orders"
              >
                <Package size={22} />
              </IconButton>

              {/* Cart */}
              <IconButton component={Link} to="/cart" title="Cart">
                <Badge badgeContent={cartCount} color="primary" max={99}>
                  <ShoppingCart size={22} color="#374151" />
                </Badge>
              </IconButton>

              {/* User menu */}
              {user ? (
                <>
                  <IconButton onClick={handleUserMenu} size="small" sx={{ ml: 0.5 }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: 'primary.main',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    PaperProps={{ sx: { minWidth: 200, mt: 1 } }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                      <User size={16} style={{ marginRight: 10 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={() => { handleUserMenuClose(); navigate('/my-orders'); }}>
                      <Package size={16} style={{ marginRight: 10 }} /> My Orders
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <LogOut size={16} style={{ marginRight: 10 }} /> Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button variant="contained" component={Link} to="/login" size="small" sx={{ ml: 1 }}>
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ px: 2, mb: 2 }}>
            Shop<span style={{ color: '#7C3AED' }}>Hub</span>
          </Typography>
          <Divider />

          {/* Mobile Search */}
          <Box
            sx={{
              mx: 2, my: 1.5,
              display: 'flex', alignItems: 'center',
              backgroundColor: 'grey.50', borderRadius: 2,
              border: '1.5px solid', borderColor: 'grey.200',
              px: 1.5, py: 0.75,
              '&:focus-within': { borderColor: 'primary.main', backgroundColor: 'white' },
              transition: 'all 0.2s',
            }}
          >
            <Search size={16} color="#9CA3AF" />
            <InputBase
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleSearch(e);
                if (e.key === 'Enter') setMobileOpen(false);
              }}
              sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
              inputProps={{ 'aria-label': 'search products' }}
            />
          </Box>
          <Divider />

          <List>
            {['All Products', ...CATEGORIES].map((cat) => (
              <ListItem key={cat} disablePadding>
                <ListItemButton
                  component={Link}
                  to={cat === 'All Products' ? '/shop' : `/shop?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary={cat} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default CustomerNavbar;
