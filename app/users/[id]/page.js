'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useUserStore } from '@/store/userStore';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Skeleton,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    selectedUser,
    isLoadingDetail,
    error,
    fetchUserById,
    clearSelectedUser,
  } = useUserStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
    return () => {
      clearSelectedUser();
    };
  }, [id, fetchUserById, clearSelectedUser]);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, maxWidth: 1200, mx: 'auto' }}>
        {/* Navigation Breadcrumb / Back Link */}
        <Box sx={{ mb: 3 }}>
          <Button
            component={Link}
            href="/users"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          >
            Back to Users
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            User Profile Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive profile information, company affiliation, and account parameters.
          </Typography>
        </Box>

        {/* Error Notification */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => fetchUserById(id, true)}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading Skeletons */}
        {isLoadingDetail || !selectedUser ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="70%" height={32} sx={{ mx: 'auto' }} />
                <Skeleton variant="text" width="50%" height={20} sx={{ mx: 'auto', mb: 2 }} />
                <Divider sx={{ my: 2 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* User Profile Content */
          <Grid container spacing={3}>
            {/* Left Column: Quick Profile Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Avatar
                  src={selectedUser.image}
                  alt={selectedUser.firstName}
                  sx={{
                    width: 110,
                    height: 110,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    border: '3px solid',
                    borderColor: 'primary.main',
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  @{selectedUser.username}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Role: ${selectedUser.role || 'User'}`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                  />
                  <Chip
                    label={selectedUser.gender}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Chip
                    label={`Age: ${selectedUser.age}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Quick Contact Box */}
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                    DIRECT CONTACT
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <EmailOutlinedIcon fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <PhoneOutlinedIcon fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedUser.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <LocationOnOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.3 }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.address?.address}, {selectedUser.address?.city},{' '}
                      {selectedUser.address?.state} {selectedUser.address?.postalCode},{' '}
                      {selectedUser.address?.country || 'USA'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Right Column: Detailed Categorized Information */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Employment & Organization */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <BusinessOutlinedIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Company & Employment
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Company Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedUser.company?.name || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Job Title
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedUser.company?.title || 'Staff'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.company?.department || 'Operations'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Work Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedUser.company?.address?.address}, {selectedUser.company?.address?.city}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>

                {/* Personal & Physical Specs */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <PersonOutlineIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Personal Attributes & Education
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Birth Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedUser.birthDate || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Blood Group
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedUser.bloodGroup || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Height / Weight
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedUser.height} cm / {selectedUser.weight} kg
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Eye / Hair
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedUser.eyeColor} / {selectedUser.hair?.color} ({selectedUser.hair?.type})
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <SchoolOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>University:</strong> {selectedUser.university || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Financial & Technical Details */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <AccountBalanceOutlinedIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Financial & System Parameters
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Card Type & Number (Masked)
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {selectedUser.bank?.cardType} - •••• {selectedUser.bank?.cardNumber?.slice(-4) || '••••'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Card Expire: {selectedUser.bank?.cardExpire} | Currency: {selectedUser.bank?.currency}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Crypto Wallet
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CurrencyBitcoinIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedUser.crypto?.coin || 'Bitcoin'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', color: 'text.secondary' }}>
                        {selectedUser.crypto?.wallet || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        IP Address
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedUser.ip}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        MAC Address
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedUser.macAddress}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
}

