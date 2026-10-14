import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Chip, Pagination, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, IconButton, Stack, Alert,
} from '@mui/material';
import { Search, RefreshCw, Sliders, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryRepository } from '../../../services/repositories';
import { formatDate } from '../../../utils/helpers';
import Toast from '../../../components/feedback/Toast';
import EmptyState from '../../../components/feedback/EmptyState';

const StockManagementPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [adjustItem, setAdjustItem] = useState(null);
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('Restock Shipment');
  const [adjustError, setAdjustError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory-stock', page, search],
    queryFn: () => inventoryRepository.getInventory({ page, pageSize, search }),
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, delta, reason }) =>
      inventoryRepository.updateStock(productId, { delta: Number(delta), reason }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['inventory-stock'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-all'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] });
      setToast({
        open: true,
        message: `Stock updated for ${updated.productName}. New available: ${updated.availableStock}`,
        severity: 'success',
      });
      handleCloseAdjust();
    },
    onError: (err) => {
      setAdjustError(err?.message || 'Failed to adjust stock.');
    },
  });

  const items = data?.items || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handleOpenAdjust = (item) => {
    setAdjustItem(item);
    setDelta('');
    setReason('Restock Shipment');
    setAdjustError('');
  };

  const handleCloseAdjust = () => {
    setAdjustItem(null);
    setDelta('');
    setAdjustError('');
  };

  const handleConfirmAdjust = () => {
    const deltaNum = Number(delta);
    if (!delta || isNaN(deltaNum) || deltaNum === 0) {
      setAdjustError('Please enter a non-zero adjustment amount.');
      return;
    }

    if (adjustItem.availableStock + deltaNum < 0) {
      setAdjustError('Stock adjustment would cause available stock to fall below zero.');
      return;
    }

    updateStockMutation.mutate({
      productId: adjustItem.productId,
      delta: deltaNum,
      reason,
    });
  };

  const calculatedNewAvailable = adjustItem && delta && !isNaN(Number(delta))
    ? adjustItem.availableStock + Number(delta)
    : adjustItem?.availableStock;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Stock Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Audit current warehouse inventory, manage safety thresholds, and execute stock adjustments.
        </Typography>
      </Box>

      {/* Filter and Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ flex: 1, minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#6B7280" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Paper>

      {/* Inventory Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell align="center">Total Stock</TableCell>
                <TableCell align="center">Reserved</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="center">Reorder Threshold</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isLow = item.availableStock <= item.lowStockThreshold;
                return (
                  <TableRow key={item.productId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                        {item.productId}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {item.totalStock}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="info.main" fontWeight={600}>
                        {item.reservedStock}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={isLow ? 'error.main' : 'success.main'}
                      >
                        {item.availableStock}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {item.lowStockThreshold}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isLow ? 'Low Stock' : 'In Stock'}
                        size="small"
                        color={isLow ? 'error' : 'success'}
                        variant={isLow ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.lastUpdated)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Sliders size={14} />}
                        onClick={() => handleOpenAdjust(item)}
                      >
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

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

      {/* Stock Adjustment Dialog */}
      {adjustItem && (
        <Dialog
          open={Boolean(adjustItem)}
          onClose={handleCloseAdjust}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              Adjust Inventory
            </Typography>
            <IconButton onClick={handleCloseAdjust} size="small">
              <X size={18} />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Product</Typography>
              <Typography variant="body1" fontWeight={700}>{adjustItem.productName}</Typography>
              <Typography variant="caption" color="text.secondary">ID: {adjustItem.productId}</Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Current Available:</Typography>
                <Typography variant="body2" fontWeight={600}>{adjustItem.availableStock} units</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">New Projected Available:</Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={calculatedNewAvailable < 0 ? 'error.main' : 'primary.main'}
                >
                  {calculatedNewAvailable} units
                </Typography>
              </Stack>
            </Box>

            {adjustError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {adjustError}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                size="small"
                label="Adjustment Quantity (+/-)"
                type="number"
                value={delta}
                onChange={(e) => { setDelta(e.target.value); setAdjustError(''); }}
                helperText="Use positive numbers to add stock (+50), negative to reduce (-10)"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Reason for Adjustment</InputLabel>
                <Select
                  value={reason}
                  label="Reason for Adjustment"
                  onChange={(e) => setReason(e.target.value)}
                >
                  <MenuItem value="Restock Shipment">Restock Shipment</MenuItem>
                  <MenuItem value="Inventory Audit Correction">Inventory Audit Correction</MenuItem>
                  <MenuItem value="Damaged / Shrinkage">Damaged / Shrinkage</MenuItem>
                  <MenuItem value="Customer Return Restock">Customer Return Restock</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseAdjust} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAdjust}
              variant="contained"
              loading={updateStockMutation.isPending}
            >
              Apply Adjustment
            </Button>
          </DialogActions>
        </Dialog>
      )}

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

export default StockManagementPage;
