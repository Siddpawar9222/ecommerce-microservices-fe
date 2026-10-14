import {
  Box, Grid, Paper, Typography, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, Chip, Stack,
} from '@mui/material';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight,
  Plus, AlertCircle, Eye,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { orderRepository, productRepository, customerRepository } from '../../../services/repositories';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { OrderStatusBadge, PaymentStatusBadge } from '../../../components/common/StatusBadge';

// Sample monthly analytics data for charts
const REVENUE_DATA = [
  { month: 'Jan', revenue: 4200, orders: 38 },
  { month: 'Feb', revenue: 5800, orders: 52 },
  { month: 'Mar', revenue: 7400, orders: 67 },
  { month: 'Apr', revenue: 6900, orders: 61 },
  { month: 'May', revenue: 9100, orders: 84 },
  { month: 'Jun', revenue: 11800, orders: 105 },
  { month: 'Jul', revenue: 14200, orders: 128 },
];

const CATEGORY_SALES = [
  { category: 'Audio', sales: 12500 },
  { category: 'Wearables', sales: 9800 },
  { category: 'Accessories', sales: 8400 },
  { category: 'Computers', sales: 15600 },
  { category: 'Gaming', sales: 7200 },
];

const AdminDashboardPage = () => {
  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders-recent'],
    queryFn: () => orderRepository.getOrders({ page: 1, pageSize: 5 }),
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: () => productRepository.getProducts({ pageSize: 1, activeOnly: false }),
  });

  const { data: customersData } = useQuery({
    queryKey: ['admin-customers-count'],
    queryFn: () => customerRepository.getCustomers({ pageSize: 1 }),
  });

  const recentOrders = ordersData?.items || [];
  const totalProducts = productsData?.total || 24;
  const totalCustomers = customersData?.total || 6;

  const kpis = [
    {
      title: 'Total Revenue',
      value: '$59,400',
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Total Orders',
      value: '535',
      change: '+8.4%',
      isPositive: true,
      icon: ShoppingCart,
      color: '#4F46E5',
      bgColor: '#EEF2FF',
    },
    {
      title: 'Active Products',
      value: totalProducts.toString(),
      change: '+3 new',
      isPositive: true,
      icon: Package,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      title: 'Customers',
      value: totalCustomers.toString(),
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: '#06B6D4',
      bgColor: '#ECFEFF',
    },
  ];

  return (
    <Box>
      {/* Page Title & Quick Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Admin Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here is what's happening with your store today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={RouterLink}
            to="/admin/products/new"
            variant="contained"
            startIcon={<Plus size={18} />}
          >
            Add Product
          </Button>
          <Button
            component={RouterLink}
            to="/admin/orders"
            variant="outlined"
          >
            Manage Orders
          </Button>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={kpi.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                    {kpi.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ my: 0.5 }}>
                    {kpi.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp size={14} color="#10B981" />
                    <Typography variant="caption" color="success.main" fontWeight={700}>
                      {kpi.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    bgcolor: kpi.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: kpi.color,
                  }}
                >
                  <Icon size={26} />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Area Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: 380,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Revenue & Sales Trends
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monthly performance over the last 7 months
                </Typography>
              </Box>
              <Chip label="2024 Year-to-Date" size="small" variant="outlined" />
            </Box>
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <ChartTooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Sales Bar Chart */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: 380,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Sales by Category
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Top performing product categories
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={CATEGORY_SALES} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="category" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <ChartTooltip formatter={(v) => [`$${v}`, 'Sales']} />
                <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Recent Orders
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Latest transactions placed across the store
            </Typography>
          </Box>
          <Button component={RouterLink} to="/admin/orders" size="small" endIcon={<ArrowUpRight size={16} />}>
            View All Orders
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{order.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{order.customerEmail}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(order.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={RouterLink}
                      to="/admin/orders"
                      size="small"
                      startIcon={<Eye size={14} />}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminDashboardPage;
