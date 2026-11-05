'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GuestGuard from '@/components/auth/GuestGuard';
import { useAuthStore } from '@/store/authStore';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    const res = await login(username.trim(), password.trim());
    if (res.success) {
      router.push('/dashboard');
    }
  };

  const handleFillDemo = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setValidationErrors({});
    clearError();
  };

  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 440,
            width: '100%',
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          }}
        >
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header Brand */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  mb: 1.5,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                <SchoolIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Help Study Abroad
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Admin Portal & Management System
              </Typography>
            </Box>

            {/* Error Notification */}
            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={clearError}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors((prev) => ({ ...prev, username: null }));
                  }
                }}
                error={Boolean(validationErrors.username)}
                helperText={validationErrors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                error={Boolean(validationErrors.password)}
                helperText={validationErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.3,
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </Box>

            {/* Demo Credentials Quick-Fill Helper */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(241, 245, 249, 0.7)',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <KeyIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  DummyJSON Demo Credentials
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Click below to auto-fill valid DummyJSON credentials:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="emilys / emilyspass"
                  size="small"
                  onClick={() => handleFillDemo('emilys', 'emilyspass')}
                  color="primary"
                  variant="outlined"
                  sx={{ cursor: 'pointer', fontWeight: 600, fontSize: 11 }}
                />
                <Chip
                  label="michaelw / michaelwpass"
                  size="small"
                  onClick={() => handleFillDemo('michaelw', 'michaelwpass')}
                  variant="outlined"
                  sx={{ cursor: 'pointer', fontSize: 11 }}
                />
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </GuestGuard>
  );
}
