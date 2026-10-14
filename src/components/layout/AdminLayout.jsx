import { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Avatar, Divider, Tooltip, Chip,
} from '@mui/material';
import { Menu as MenuIcon, LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronLeft } from 'lucide-react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const DRAWER_WIDTH = 240;
const DRAWER_MINI = 64;

const adminNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const drawerWidth = collapsed ? DRAWER_MINI : DRAWER_WIDTH;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const DrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography variant="caption" fontWeight={800} color="white">SH</Typography>
        </Box>
        {!collapsed && (
          <Typography variant="h6" fontWeight={800} color="primary.main" noWrap>
            Admin Panel
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {adminNavItems.map(({ label, icon: Icon, path }) => (
          <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={collapsed ? label : ''} placement="right">
              <ListItemButton
                component={NavLink}
                to={path}
                sx={{
                  borderRadius: 2,
                  minHeight: 44,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1.5 : 2,
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '& .MuiListItemText-primary': { color: 'white', fontWeight: 700 },
                  },
                  '&:hover:not(.active)': { bgcolor: 'grey.100' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: 'text.secondary' }}>
                  <Icon size={20} />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User info */}
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
              {getInitials(user?.name)}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
              <Chip label="Admin" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
            </Box>
          </Box>
        )}
        <Tooltip title="Sign Out" placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, color: 'error.main', px: collapsed ? 1.5 : 2, justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1.5, color: 'error.main' }}>
              <LogOut size={18} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.875rem', color: 'error.main' }} />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, transition: 'width 0.3s ease', overflowX: 'hidden' },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <DrawerContent />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              onClick={() => { setCollapsed((c) => !c); setMobileOpen((o) => !o); }}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              {collapsed ? <MenuIcon size={20} /> : <ChevronLeft size={20} />}
            </IconButton>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ flex: 1 }}>
              ShopHub Admin
            </Typography>
            <Chip label="Admin" color="primary" size="small" />
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.8rem', cursor: 'pointer' }}>
              {getInitials(user?.name)}
            </Avatar>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1, bgcolor: 'grey.50', p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
