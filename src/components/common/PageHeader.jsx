import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// ============================================================
// PageHeader — consistent page title + breadcrumbs
// ============================================================

const PageHeader = ({ title, subtitle, breadcrumbs = [], action = null }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<ChevronRight size={14} />}
          aria-label="breadcrumb"
          sx={{ mb: 1.5 }}
        >
          {breadcrumbs.map((crumb, idx) =>
            crumb.href ? (
              <Link
                key={idx}
                component={RouterLink}
                to={crumb.href}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.8125rem', fontWeight: 500 }}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={idx} sx={{ fontSize: '0.8125rem', fontWeight: 500 }} color="text.primary">
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader;
