'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Box, CircularProgress } from '@mui/material';

export default function GuestGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!useAuthStore.getState().isHydrated) {
      useAuthStore.setState({ isHydrated: true });
    }
  }, []);

  useEffect(() => {
    if (mounted && isHydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [mounted, isHydrated, isAuthenticated, router]);

  if (!mounted || !isHydrated || isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress size={36} />
      </Box>
    );
  }

  return <>{children}</>;
}
