import { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Avatar, Chip, Pagination,
  Button,
} from '@mui/material';
import { Search, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { customerRepository } from '../../../services/repositories';
import { getInitials, formatDate } from '../../../utils/helpers';
import EmptyState from '../../../components/feedback/EmptyState';

const AdminCustomerListPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: () => customerRepository.getCustomers({ page, pageSize, search }),
  });

  const customers = data?.items || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View registered customer accounts, contact details, and locations.
        </Typography>
      </Box>

      {/* Filter & Search */}
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
          placeholder="Search customer by name or email..."
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

      {/* Customer Table */}
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
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Member Since</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 700 }}>
                        {getInitials(c.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {c.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {c.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                      <Mail size={14} color="#6B7280" />
                      <Typography variant="body2">{c.email}</Typography>
                    </Box>
                    {c.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone size={14} color="#6B7280" />
                        <Typography variant="caption" color="text.secondary">{c.phone}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.address ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MapPin size={14} color="#6B7280" />
                        <Typography variant="body2">
                          {c.address.city}, {c.address.state}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Not provided
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={c.role} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(c.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
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
    </Box>
  );
};

export default AdminCustomerListPage;
