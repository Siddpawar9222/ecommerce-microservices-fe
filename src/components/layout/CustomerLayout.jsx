import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar';
import CustomerFooter from './CustomerFooter';

const CustomerLayout = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <CustomerNavbar />
    <Box component="main" sx={{ flex: 1, bgcolor: 'background.default' }}>
      <Outlet />
    </Box>
    <CustomerFooter />
  </Box>
);

export default CustomerLayout;
