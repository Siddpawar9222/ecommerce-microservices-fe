import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Grid, TextField, Select, MenuItem,
  FormControl, InputLabel, FormHelperText, FormControlLabel, Switch,
  InputAdornment, Stack, Divider, Skeleton,
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository } from '../../../services/repositories';
import { productSchema } from '../../../utils/validationSchemas';
import { CATEGORIES } from '../../../mocks/data/products';
import Toast from '../../../components/feedback/Toast';

const AdminProductFormPage = () => {
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const { data: existingProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => productRepository.getProductById(productId),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      brand: '',
      price: '',
      originalPrice: '',
      description: '',
      shortDescription: '',
      images: '',
    },
  });

  useEffect(() => {
    if (existingProduct) {
      reset({
        name: existingProduct.name || '',
        category: existingProduct.category || '',
        brand: existingProduct.brand || '',
        price: existingProduct.price?.toString() || '',
        originalPrice: existingProduct.originalPrice?.toString() || '',
        description: existingProduct.description || '',
        shortDescription: existingProduct.shortDescription || '',
        images: Array.isArray(existingProduct.images)
          ? existingProduct.images.join(', ')
          : existingProduct.images || '',
      });
    }
  }, [existingProduct, reset]);

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        description: formData.description,
        shortDescription: formData.shortDescription,
        images: formData.images.split(',').map((u) => u.trim()).filter(Boolean),
        tags: [formData.category.toLowerCase(), formData.brand.toLowerCase()],
      };

      if (isEditMode) {
        return productRepository.updateProduct(productId, payload);
      } else {
        return productRepository.createProduct(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setToast({
        open: true,
        message: `Product successfully ${isEditMode ? 'updated' : 'created'}!`,
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    },
    onError: (err) => {
      setToast({
        open: true,
        message: err?.message || 'Failed to save product.',
        severity: 'error',
      });
    },
  });

  const onSubmit = (data) => {
    saveMutation.mutate(data);
  };

  if (isEditMode && isLoadingProduct) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/admin/products"
          startIcon={<ArrowLeft size={16} />}
          sx={{ mb: 1.5 }}
        >
          Back to Products
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode
            ? `Update product details for ID #${productId}`
            : 'Fill in the information below to add a new product to your catalog.'}
        </Typography>
      </Box>

      {/* Form Paper */}
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container spacing={3}>
          {/* General Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main">
              General Information
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Product Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Brand"
              {...register('brand')}
              error={!!errors.brand}
              helperText={errors.brand?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category?.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Price ($)"
              type="number"
              inputProps={{ step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Original Price ($)"
              type="number"
              inputProps={{ step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              {...register('originalPrice')}
              error={!!errors.originalPrice}
              helperText={errors.originalPrice?.message || 'Optional compare-at price'}
            />
          </Grid>

          {/* Descriptions */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
              Product Details & Media
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              placeholder="A brief punchy summary shown on product cards"
              {...register('shortDescription')}
              error={!!errors.shortDescription}
              helperText={errors.shortDescription?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Full Description"
              placeholder="Detailed specifications, features, and overview"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URLs (Comma separated)"
              placeholder="https://images.unsplash.com/..., https://..."
              {...register('images')}
              error={!!errors.images}
              helperText={errors.images?.message || 'Enter one or more direct image links separated by commas'}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/admin/products"
            variant="outlined"
            disabled={isSubmitting || saveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save size={18} />}
            loading={isSubmitting || saveMutation.isPending}
          >
            {isEditMode ? 'Update Product' : 'Create Product'}
          </Button>
        </Box>
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

export default AdminProductFormPage;
