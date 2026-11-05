'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Box, CircularProgress } from '@mui/material';

export default function GuestGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || isAuthenticated) {
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

