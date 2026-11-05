'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check both Zustand in-memory state and localStorage
    const authStorage = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    let hasSession = false;
    try {
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        hasSession = Boolean(parsed?.state?.token && parsed?.state?.isAuthenticated);
      }
    } catch (e) {
      hasSession = false;
    }

    if (hasSession || (token && isAuthenticated)) {
      setAuthorized(true);
    } else {
      router.replace('/login');
    }
  }, [router, token, isAuthenticated]);

  if (!authorized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          bgcolor: 'background.default',
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
