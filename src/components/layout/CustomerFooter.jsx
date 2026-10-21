import { Box, Container, Grid, Typography, Link as MuiLink, Divider, Stack, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Globe, Code2, Share2 } from 'lucide-react';

const CustomerFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={800} color="white" sx={{ mb: 1.5 }}>
              Shop<span style={{ color: '#818CF8' }}>Hub</span>
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ maxWidth: 280, lineHeight: 1.7 }}>
              A professional e-commerce platform showcasing a full-stack microservices architecture with React & Spring Boot.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
              {[
                { Icon: Code2, label: 'GitHub' },
                { Icon: Globe, label: 'Website' },
                { Icon: Share2, label: 'Share' },
              ].map(({ Icon, label }) => (
                <IconButton
                  key={label}
                  size="small"
                  aria-label={label}
                  sx={{
                    color: 'grey.400',
                    '&:hover': {
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={18} />
                </IconButton>
              ))}
            </Stack>

          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="overline" color="grey.500" sx={{ mb: 2, display: 'block' }}>
              Shop
            </Typography>
            {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'].map((c) => (
              <MuiLink
                key={c}
                component={Link}
                to={`/shop?category=${encodeURIComponent(c)}`}
                color="grey.400"
                underline="hover"
                display="block"
                variant="body2"
                sx={{ mb: 0.75, '&:hover': { color: 'white' } }}
              >
                {c}
              </MuiLink>
            ))}
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="overline" color="grey.500" sx={{ mb: 2, display: 'block' }}>
              Account
            </Typography>
            {[['My Orders', '/my-orders'], ['Cart', '/cart'], ['Profile', '/profile']].map(([label, path]) => (
              <MuiLink
                key={label}
                component={Link}
                to={path}
                color="grey.400"
                underline="hover"
                display="block"
                variant="body2"
                sx={{ mb: 0.75, '&:hover': { color: 'white' } }}
              >
                {label}
              </MuiLink>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="overline" color="grey.500" sx={{ mb: 2, display: 'block' }}>
              Project Info
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ lineHeight: 1.7 }}>
              This is a portfolio project demonstrating a scalable e-commerce frontend built with React + MUI, backed by Java Spring Boot microservices. Demo credentials are provided on the login page.
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'grey.800', mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="grey.600">
            © {new Date().getFullYear()} ShopHub. Built for portfolio demonstration.
          </Typography>
          <Typography variant="caption" color="grey.600">
            Mock data only — no real transactions
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerFooter;
