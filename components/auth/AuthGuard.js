'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If Zustand storage already completed before mount
    if (!useAuthStore.getState().isHydrated) {
      useAuthStore.setState({ isHydrated: true });
    }
  }, []);

  useEffect(() => {
    if (mounted && isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isHydrated, isAuthenticated, router]);

  // While hydration is resolving or user is unauthenticated, render loader
  if (!mounted || !isHydrated || !isAuthenticated) {
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
