import { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Stack, Alert, ButtonGroup,
} from '@mui/material';
import { AlertTriangle, CheckCircle2, Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryRepository } from '../../../services/repositories';
import Toast from '../../../components/feedback/Toast';
import EmptyState from '../../../components/feedback/EmptyState';

const LowStockAlertsPage = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ['inventory-low-stock-page'],
    queryFn: () => inventoryRepository.getLowStockProducts(),
  });

  const restockMutation = useMutation({
    mutationFn: ({ productId, amount }) =>
      inventoryRepository.updateStock(productId, { delta: amount, reason: 'Quick Restock Button' }),
    onSuccess: (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock-page'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stock'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-all'] });
      setToast({
        open: true,
        message: `Restocked +${variables.amount} units for ${updated.productName}!`,
        severity: 'success',
      });
    },
    onError: (err) => {
      setToast({ open: true, message: err?.message || 'Failed to restock item', severity: 'error' });
    },
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box>
          <Button
            component={RouterLink}
            to="/inventory/dashboard"
            startIcon={<ArrowLeft size={16} />}
            sx={{ mb: 1 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Low Stock Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Replenishment monitor for products that have reached or dropped below safety threshold levels.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => refetch()}
        >
          Refresh Alerts
        </Button>
      </Box>

      {/* Low stock warning banner */}
      {items.length > 0 && (
        <Alert severity="warning" icon={<AlertTriangle size={20} />} sx={{ mb: 3, borderRadius: 2 }}>
          There are currently <strong>{items.length} product(s)</strong> with inventory levels at or below their reorder threshold. Replenish immediately using the quick restock controls below.
        </Alert>
      )}

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {items.length === 0 && !isLoading ? (
          <EmptyState
            icon={CheckCircle2}
            title="All stock levels healthy!"
            description="There are currently no items at or below their low-stock thresholds."
            action={{ label: 'View All Stock', onClick: () => {} }}
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product ID</TableCell>
                  <TableCell align="center">Available Stock</TableCell>
                  <TableCell align="center">Threshold</TableCell>
                  <TableCell>Deficit</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell align="right">Quick Restock Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const deficit = Math.max(0, item.lowStockThreshold - item.availableStock);
                  const isCritical = item.availableStock <= 5;

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
                        <Typography variant="body2" fontWeight={800} color="error.main">
                          {item.availableStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {item.lowStockThreshold}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="warning.dark">
                          -{deficit} units
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isCritical ? 'CRITICAL' : 'WARNING'}
                          size="small"
                          color={isCritical ? 'error' : 'warning'}
                          sx={{ fontWeight: 700, borderRadius: '6px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <ButtonGroup size="small" variant="outlined">
                          <Button
                            onClick={() => restockMutation.mutate({ productId: item.productId, amount: 10 })}
                            disabled={restockMutation.isPending}
                          >
                            +10
                          </Button>
                          <Button
                            onClick={() => restockMutation.mutate({ productId: item.productId, amount: 25 })}
                            disabled={restockMutation.isPending}
                          >
                            +25
                          </Button>
                          <Button
                            onClick={() => restockMutation.mutate({ productId: item.productId, amount: 50 })}
                            disabled={restockMutation.isPending}
                          >
                            +50
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

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

export default LowStockAlertsPage;
