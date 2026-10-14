import { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Chip, Button,
} from '@mui/material';
import { Search, RefreshCw, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { inventoryRepository } from '../../../services/repositories';
import { formatDate } from '../../../utils/helpers';
import EmptyState from '../../../components/feedback/EmptyState';

const ReservationHistoryPage = () => {
  const [search, setSearch] = useState('');

  const { data: reservations = [], isLoading, refetch } = useQuery({
    queryKey: ['inventory-reservations-full', search],
    queryFn: () => inventoryRepository.getReservations({ search }),
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Reservation History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Audit trail of inventory items allocated, held, or fulfilled for customer orders.
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
          placeholder="Search by Order ID or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        {reservations.length === 0 && !isLoading ? (
          <EmptyState
            icon={BookOpen}
            title="No reservations found"
            description="There are currently no active or historical reservations matching your search."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reservation ID</TableCell>
                  <TableCell>Order Reference</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product ID</TableCell>
                  <TableCell align="center">Reserved Qty</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reservation Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((res) => (
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
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        {res.productId}
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
                        color={res.status === 'RESERVED' ? 'info' : res.status === 'FULFILLED' ? 'success' : 'default'}
                        variant={res.status === 'RESERVED' ? 'filled' : 'outlined'}
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
        )}
      </Paper>
    </Box>
  );
};

export default ReservationHistoryPage;
