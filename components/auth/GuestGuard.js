'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

export default function GuestGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has an active stored session
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

    if (hasSession) {
      router.replace('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
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
        <CircularProgress size={36} />
      </Box>
    );
  }

  return <>{children}</>;
}
