'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useProductStore } from '@/store/productStore';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Skeleton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { users, total: totalUsers, isLoading: usersLoading, fetchUsers } = useUserStore();
  const {
    products,
    total: totalProducts,
    categories,
    isLoading: productsLoading,
    fetchProducts,
    fetchCategories,
  } = useProductStore();

  useEffect(() => {
    // Initial dashboard data load
    fetchUsers({ limit: 5, skip: 0 });
    fetchProducts({ limit: 4, skip: 0 });
    fetchCategories();
  }, [fetchUsers, fetchProducts, fetchCategories]);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        {/* Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            bgcolor: 'primary.main',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Administrator'}!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 600 }}>
              Here is your administrative command center. Monitor registered users, inspect catalog
              inventory, and view comprehensive analytical metrics.
            </Typography>
          </Box>
          <Chip
            icon={<VerifiedUserIcon sx={{ '&&': { color: '#ffffff' } }} />}
            label="Session Active"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}
          />
        </Paper>

        {/* Overview Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Users Metric */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Users
                  </Typography>
                  <Avatar sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: 'primary.main', width: 44, height: 44 }}>
                    <PeopleAltIcon />
                  </Avatar>
                </Box>
                {usersLoading && totalUsers === 0 ? (
                  <Skeleton variant="text" width={80} height={48} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {totalUsers}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Live from DummyJSON users database
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Products Metric */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Products
                  </Typography>
                  <Avatar sx={{ bgcolor: 'rgba(22, 163, 74, 0.1)', color: 'success.main', width: 44, height: 44 }}>
                    <Inventory2Icon />
                  </Avatar>
                </Box>
                {productsLoading && totalProducts === 0 ? (
                  <Skeleton variant="text" width={80} height={48} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {totalProducts}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Available in products catalog
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Categories Metric */}
          <Grid item xs={12} sm={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Categories
                  </Typography>
                  <Avatar sx={{ bgcolor: 'rgba(217, 119, 6, 0.1)', color: 'warning.main', width: 44, height: 44 }}>
                    <CategoryIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {categories.length}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Diverse product classifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Navigation Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Users Navigation Banner */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}>
                  <PeopleAltIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Users Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View, search, and paginate through customer profiles and corporate details.
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  component={Link}
                  href="/users"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Users Directory
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Products Navigation Banner */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 42, height: 42 }}>
                  <Inventory2Icon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Products Inventory
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse responsive product grid, filter by category, and view rich product specs.
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  component={Link}
                  href="/products"
                  variant="contained"
                  color="success"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Products Catalog
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Preview Sections */}
        <Grid container spacing={3}>
          {/* Recent Users Preview */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Users
                </Typography>
                <Button component={Link} href="/users" size="small" endIcon={<ArrowForwardIcon />}>
                  View All
                </Button>
              </Box>
              <Divider />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Company</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.slice(0, 5).map((u) => (
                      <TableRow
                        key={u.id}
                        hover
                        component={Link}
                        href={`/users/${u.id}`}
                        sx={{ textDecoration: 'none', cursor: 'pointer' }}
                      >
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={u.image} alt={u.firstName} sx={{ width: 28, height: 28 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {u.firstName} {u.lastName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {u.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {u.company?.name || 'N/A'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Featured Products Preview */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Featured Products
                </Typography>
                <Button component={Link} href="/products" size="small" endIcon={<ArrowForwardIcon />}>
                  Catalog
                </Button>
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                {products.slice(0, 4).map((p) => (
                  <Paper
                    key={p.id}
                    component={Link}
                    href={`/products/${p.id}`}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      textDecoration: 'none',
                      color: 'inherit',
                      borderRadius: 2,
                      transition: 'background-color 0.15s',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                    }}
                  >
                    <Box
                      component="img"
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.title}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        objectFit: 'cover',
                        bgcolor: '#f1f5f9',
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, noWrap: true }}>
                        {p.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip label={p.category} size="small" sx={{ fontSize: 11, height: 20 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {p.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${p.price}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
