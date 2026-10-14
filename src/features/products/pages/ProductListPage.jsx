import { useState, useEffect, useMemo } from 'react';

import {
  Box, Container, Grid, Typography, TextField, InputAdornment, Select, MenuItem, FormControl,
  InputLabel, Pagination, Chip, Skeleton, Stack, Drawer, Button, IconButton, Divider,
} from '@mui/material';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { productRepository } from '../../../services/repositories';
import { addToCart, selectCartItems } from '../../cart/cartSlice';
import ProductCard, { ProductCardSkeleton } from '../../../components/common/ProductCard';
import EmptyState from '../../../components/feedback/EmptyState';
import ErrorMessage from '../../../components/feedback/ErrorMessage';
import { CATEGORIES, SORT_OPTIONS, ITEMS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { debounce, parseSortParam } from '../../../utils/helpers';
import { PackageSearch } from 'lucide-react';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  // Derived state from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'createdAt_desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);

  const [localSearch, setLocalSearch] = useState(search);

  const { sortBy, sortDir } = parseSortParam(sort);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', { search, category, sort, page, pageSize }],
    queryFn: () =>
      productRepository.getProducts({ search, category, sortBy, sortDir, page, pageSize, activeOnly: true }),
    keepPreviousData: true,
  });

  // Debounced search update
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchParams((p) => {
          const next = new URLSearchParams(p);
          if (value) next.set('search', value);
          else next.delete('search');
          next.set('page', '1');
          return next;
        });
      }, 400),
    [setSearchParams]
  );


  useEffect(() => {
    debouncedSetSearch(localSearch);
  }, [localSearch, debouncedSetSearch]);

  // Sync local input if URL search changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const setParam = (key, value) => {
    setSearchParams((p) => {
      const next = new URLSearchParams(p);
      if (value) next.set(key, value);
      else next.delete(key);
      next.set('page', '1');
      return next;
    });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  const FilterPanel = () => (
    <Box sx={{ p: { xs: 2, md: 0 }, minWidth: { md: 200 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Filters</Typography>
        {category && (
          <Button size="small" onClick={() => setParam('category', '')}>Clear</Button>
        )}
      </Box>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
        Category
      </Typography>
      <Stack spacing={0.5}>
        <Chip
          label="All Categories"
          variant={!category ? 'filled' : 'outlined'}
          color={!category ? 'primary' : 'default'}
          clickable
          size="small"
          onClick={() => setParam('category', '')}
          sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
        />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            variant={category === cat ? 'filled' : 'outlined'}
            color={category === cat ? 'primary' : 'default'}
            clickable
            size="small"
            onClick={() => setParam('category', cat)}
            sx={{ justifyContent: 'flex-start', borderRadius: '8px' }}
          />
        ))}
      </Stack>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          {category || 'All Products'}
        </Typography>
        {data && (
          <Typography variant="body2" color="text.secondary">
            {data.total} product{data.total !== 1 ? 's' : ''} found
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar filters — desktop */}
        <Grid item md={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            sx={{
              position: 'sticky',
              top: 80,
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: 2,
            }}
          >
            <FilterPanel />
          </Box>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9.5}>
          {/* Controls bar */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 3,
              alignItems: 'center',
            }}
          >
            {/* Search */}
            <TextField
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search products…"
              size="small"
              sx={{ flex: '1 1 200px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#9CA3AF" />
                  </InputAdornment>
                ),
                endAdornment: localSearch ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setLocalSearch('')}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              id="product-search"
            />

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sort}
                label="Sort By"
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Page size */}
            <FormControl size="small" sx={{ minWidth: 90 }}>
              <InputLabel id="size-label">Show</InputLabel>
              <Select
                labelId="size-label"
                value={pageSize}
                label="Show"
                onChange={(e) => {
                  setSearchParams((p) => {
                    const next = new URLSearchParams(p);
                    next.set('pageSize', String(e.target.value));
                    next.set('page', '1');
                    return next;
                  });
                }}
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mobile filter toggle */}
            <Button
              variant="outlined"
              startIcon={<SlidersHorizontal size={16} />}
              size="small"
              onClick={() => setFilterOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              Filters {category && `(1)`}
            </Button>
          </Box>

          {/* Active filter chips */}
          {(search || category) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {search && (
                <Chip
                  label={`Search: "${search}"`}
                  onDelete={() => { setLocalSearch(''); setParam('search', ''); }}
                  size="small"
                />
              )}
              {category && (
                <Chip
                  label={`Category: ${category}`}
                  onDelete={() => setParam('category', '')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Products grid */}
          {isLoading ? (
            <Grid container spacing={2.5}>
              {Array.from({ length: pageSize }).map((_, i) => (
                <Grid item xs={12} sm={6} lg={4} key={i}>
                  <ProductCardSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : isError ? (
            <ErrorMessage
              title="Failed to load products"
              message="There was a problem fetching products. Please try again."
              onRetry={refetch}
            />
          ) : !data?.items?.length ? (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              description={
                search || category
                  ? 'Try adjusting your search or filters.'
                  : 'No products available right now.'
              }
              action={
                (search || category)
                  ? {
                      label: 'Clear Filters',
                      onClick: () => { setLocalSearch(''); setSearchParams({}); },
                    }
                  : null
              }
            />
          ) : (
            <>
              <Grid container spacing={2.5}>
                {data.items.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      isInCart={cartItems.some((i) => i.productId === product.id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setSearchParams((p) => { const n = new URLSearchParams(p); n.set('page', String(v)); return n; })}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="bottom"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80vh', overflow: 'auto' } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight={700}>Filters</Typography>
            <IconButton size="small" onClick={() => setFilterOpen(false)}><X size={20} /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <FilterPanel />
          <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={() => setFilterOpen(false)}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductListPage;
