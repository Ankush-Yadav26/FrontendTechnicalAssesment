'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately inspect localStorage for existing session
    const authStorage = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    let hasToken = false;
    try {
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        hasToken = Boolean(parsed?.state?.token && parsed?.state?.isAuthenticated);
      }
    } catch (e) {
      hasToken = false;
    }

    if (hasToken) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
