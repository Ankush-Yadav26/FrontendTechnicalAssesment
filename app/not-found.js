'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          maxWidth: 480,
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The requested page does not exist or has been relocated within the Help Study Abroad portal.
        </Typography>
        <Button
          component={Link}
          href="/dashboard"
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{ borderRadius: 2 }}
        >
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
