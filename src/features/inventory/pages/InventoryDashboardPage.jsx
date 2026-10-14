import {
  Box, Grid, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Stack,
} from '@mui/material';
import {
  Package, AlertTriangle, Layers, BookOpen, ArrowUpRight, Plus, RefreshCw,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { inventoryRepository } from '../../../services/repositories';
import { formatDate } from '../../../utils/helpers';

const InventoryDashboardPage = () => {
  const { data: inventoryData, isLoading, refetch } = useQuery({
    queryKey: ['inventory-all'],
    queryFn: () => inventoryRepository.getInventory({ pageSize: 100 }),
  });

  const { data: lowStockItems = [] } = useQuery({
    queryKey: ['inventory-low-stock'],
    queryFn: () => inventoryRepository.getLowStockProducts(),
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ['inventory-reservations'],
    queryFn: () => inventoryRepository.getReservations(),
  });

  const items = inventoryData?.items || [];
  const totalSKUs = items.length;
  const totalAvailable = items.reduce((sum, i) => sum + i.availableStock, 0);
  const totalReserved = items.reduce((sum, i) => sum + i.reservedStock, 0);
  const totalLowStock = lowStockItems.length;

  // Chart data: Top 6 items by total stock
  const chartData = [...items]
    .sort((a, b) => b.totalStock - a.totalStock)
    .slice(0, 6)
    .map((i) => ({
      name: i.productName.length > 15 ? i.productName.substring(0, 15) + '...' : i.productName,
      available: i.availableStock,
      reserved: i.reservedStock,
    }));

  const metrics = [
    {
      title: 'Total Products Tracked',
      value: totalSKUs.toString(),
      subtitle: 'Active inventory SKUs',
      icon: Package,
      color: '#4F46E5',
      bgColor: '#EEF2FF',
    },
    {
      title: 'Available Stock',
      value: totalAvailable.toLocaleString(),
      subtitle: 'Units ready for fulfillment',
      icon: Layers,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Reserved Stock',
      value: totalReserved.toLocaleString(),
      subtitle: 'Units held for pending orders',
      icon: BookOpen,
      color: '#06B6D4',
      bgColor: '#ECFEFF',
    },
    {
      title: 'Low Stock Alerts',
      value: totalLowStock.toString(),
      subtitle: 'Items at or below reorder point',
      icon: AlertTriangle,
      color: '#EF4444',
      bgColor: '#FEF2F2',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Inventory Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time warehouse stock levels, active reservations, and restock alerts.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            component={RouterLink}
            to="/inventory/stock"
            variant="contained"
            startIcon={<Plus size={18} />}
          >
            Adjust Stock
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={m.title}>
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
                    {m.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ my: 0.5 }}>
                    {m.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.subtitle}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    bgcolor: m.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: m.color,
                  }}
                >
                  <Icon size={26} />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts & Low Stock Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Top Stock Bar Chart */}
        <Grid item xs={12} lg={7}>
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
                Stock Levels by Top SKU
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comparison of Available vs Reserved inventory
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip />
                <Bar dataKey="available" name="Available" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reserved" name="Reserved" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Low Stock Alert Highlights */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: 380,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700} color="error.main">
                  Low Stock Attention
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Items requiring immediate replenishment
                </Typography>
              </Box>
              <Button component={RouterLink} to="/inventory/low-stock" size="small" endIcon={<ArrowUpRight size={14} />}>
                View All ({lowStockItems.length})
              </Button>
            </Box>

            <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Avail</TableCell>
                    <TableCell align="center">Threshold</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockItems.slice(0, 5).map((item) => (
                    <TableRow key={item.productId} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                          {item.productName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.availableStock}
                          size="small"
                          color="error"
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {item.lowStockThreshold}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={RouterLink}
                          to="/inventory/stock"
                          size="small"
                          variant="text"
                        >
                          Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Reservations Table */}
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
              Recent Order Reservations
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Latest items allocated and reserved for customer orders
            </Typography>
          </Box>
          <Button component={RouterLink} to="/inventory/reservations" size="small" endIcon={<ArrowUpRight size={16} />}>
            View Full Log
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation ID</TableCell>
                <TableCell>Order Ref</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.slice(0, 5).map((res) => (
                <TableRow key={res.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                      #{res.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" color="primary.main">
                      #{res.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {res.productName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={700}>
                      {res.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={res.status}
                      size="small"
                      color={res.status === 'RESERVED' ? 'info' : 'success'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(res.reservedAt)}
                    </Typography>
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

export default InventoryDashboardPage;
