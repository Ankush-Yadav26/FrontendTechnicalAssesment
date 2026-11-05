'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // While hydration is resolving or unauthenticated, show a clean loader
  if (!isHydrated || !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress size={40} thickness={4} color="primary" />
        <Typography variant="body2" color="text.secondary">
          Verifying authentication session...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

