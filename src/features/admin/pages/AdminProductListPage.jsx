import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Select, MenuItem, FormControl,
  InputLabel, Switch, IconButton, Avatar, Chip, Pagination, Tooltip, Stack,
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Package, Check, X, RefreshCw } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository } from '../../../services/repositories';
import { formatCurrency } from '../../../utils/helpers';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Toast from '../../../components/feedback/Toast';
import EmptyState from '../../../components/feedback/EmptyState';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports'];

const AdminProductListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', page, category, search],
    queryFn: () => productRepository.getProducts({
      page,
      pageSize,
      category: category === 'All' ? '' : category,
      search,
      activeOnly: false,
    }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => productRepository.toggleProductStatus(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setToast({
        open: true,
        message: `Product is now ${updated.isActive ? 'Active' : 'Inactive'}.`,
        severity: 'success',
      });
    },
    onError: (err) => {
      setToast({ open: true, message: err?.message || 'Failed to update status', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productRepository.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setToast({ open: true, message: 'Product deleted successfully.', severity: 'success' });
      setDeleteDialog({ open: false, product: null });
    },
    onError: (err) => {
      setToast({ open: true, message: err?.message || 'Failed to delete product', severity: 'error' });
    },
  });

  const products = data?.items || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Product Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your store's products, pricing, inventory status, and visibility.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin/products/new"
          variant="contained"
          startIcon={<Plus size={18} />}
        >
          Add Product
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Search product, SKU or brand..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ flex: 1, minWidth: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#6B7280" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="medium"
          startIcon={<RefreshCw size={16} />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Paper>

      {/* Products Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {products.length === 0 && !isLoading ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your search criteria or category filter."
            action={{ label: 'Add New Product', onClick: () => navigate('/admin/products/new') }}
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={p.imageUrl}
                          variant="rounded"
                          sx={{ width: 44, height: 44, bgcolor: 'grey.100' }}
                        >
                          <Package size={20} color="#888" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 220 }}>
                            {p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.brand}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {p.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={p.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(p.price)}
                      </Typography>
                      {p.compareAtPrice && (
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {formatCurrency(p.compareAtPrice)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={p.stock <= 5 ? 'error.main' : 'text.primary'}
                      >
                        {p.stock} units
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={p.isActive ? 'Deactivate' : 'Activate'}>
                        <Switch
                          checked={p.isActive}
                          onChange={() => toggleMutation.mutate(p.id)}
                          size="small"
                          color="success"
                        />
                      </Tooltip>
                      <Typography variant="caption" color={p.isActive ? 'success.main' : 'text.secondary'} sx={{ ml: 0.5 }}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit Product">
                          <IconButton
                            size="small"
                            component={RouterLink}
                            to={`/admin/products/${p.id}/edit`}
                            color="primary"
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, product: p })}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteDialog.product?.name}"?`}
        confirmText="Delete"
        confirmColor="error"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteDialog.product?.id)}
        onClose={() => setDeleteDialog({ open: false, product: null })}
      />

      {/* Toast */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

export default AdminProductListPage;
