import { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, TextField, Button, Avatar,
  Chip, Divider, Card, CardContent, Stack,
} from '@mui/material';
import { User, Mail, Phone, MapPin, Calendar, Package, Save, CheckCircle } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInitials, formatDate } from '../../../utils/helpers';
import Toast from '../../../components/feedback/Toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 234-5678',
    line1: user?.address?.line1 || '42 Maple Avenue',
    city: user?.address?.city || 'Austin',
    state: user?.address?.state || 'TX',
    zip: user?.address?.zip || '78701',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setToast({ open: true, message: 'Profile updated successfully (mock update)', severity: 'success' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information, address, and account preferences.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center', p: 3 }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {user?.email}
            </Typography>
            <Chip
              label={user?.role || 'CUSTOMER'}
              color="primary"
              size="small"
              sx={{ fontWeight: 600, mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2} textAlign="left">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Mail size={18} color="#6B7280" />
                <Typography variant="body2">{user?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone size={18} color="#6B7280" />
                <Typography variant="body2">{formData.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Calendar size={18} color="#6B7280" />
                <Typography variant="body2">Member since {user?.createdAt ? formatDate(user.createdAt) : 'Jan 2024'}</Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                component={RouterLink}
                to="/my-orders"
                variant="outlined"
                fullWidth
                startIcon={<Package size={16} />}
              >
                View My Orders
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Profile Details & Address */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSave}
            sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Personal Information
              </Typography>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                onClick={() => isEditing ? handleSave({ preventDefault: () => {} }) : setIsEditing(true)}
                startIcon={isEditing ? <Save size={16} /> : undefined}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  disabled
                  helperText="Email cannot be changed in demo mode"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Role"
                  value={user?.role || 'CUSTOMER'}
                  disabled
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Default Shipping Address
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="line1"
                  value={formData.line1}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State / Province"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
};

export default ProfilePage;
