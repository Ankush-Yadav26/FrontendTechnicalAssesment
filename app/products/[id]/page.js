'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ImageGallery from '@/components/products/ImageGallery';
import { useProductStore } from '@/store/productStore';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Chip,
  Rating,
  Divider,
  Skeleton,
  Alert,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ProductDetailPage() {
  const { id } = useParams();
  const {
    selectedProduct,
    isLoadingDetail,
    error,
    fetchProductById,
    clearSelectedProduct,
  } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => {
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  const p = selectedProduct;

  const originalPrice =
    p?.price && p?.discountPercentage > 0 && p?.discountPercentage < 100
      ? (p.price / (1 - p.discountPercentage / 100)).toFixed(2)
      : null;

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, maxWidth: 1200, mx: 'auto' }}>
        {/* Navigation Breadcrumb / Back Link */}
        <Box sx={{ mb: 3 }}>
          <Button
            component={Link}
            href="/products"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          >
            Back to Products
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Product Specifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed view of product assets, inventory status, commercial metrics, and customer reviews.
          </Typography>
        </Box>

        {/* Error Notification */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => fetchProductById(id, true)}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading Skeletons */}
        {isLoadingDetail || !p ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2, mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Skeleton variant="text" width="80%" height={36} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* Product Details Content */
          <Grid container spacing={3}>
            {/* Left: Image Gallery / Carousel */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2.5, height: '100%' }}>
                <ImageGallery images={p.images || [p.thumbnail]} title={p.title} />
              </Card>
            </Grid>

            {/* Right: Key Info & Pricing */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Brand & Category badges */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={p.category}
                    color="primary"
                    size="small"
                    sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                  />
                  {p.brand && (
                    <Chip
                      label={`Brand: ${p.brand}`}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  <Chip
                    label={`SKU: ${p.sku || 'N/A'}`}
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Box>

                {/* Title */}
                <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                  {p.title}
                </Typography>

                {/* Rating & Stock */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={Number(p.rating) || 0} precision={0.1} readOnly size="medium" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, ml: 0.5 }}>
                      {p.rating} / 5.0
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {p.stock > 0 ? (
                      <>
                        <CheckCircleOutlineIcon color="success" fontSize="small" />
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {p.availabilityStatus || 'In Stock'} ({p.stock} units)
                        </Typography>
                      </>
                    ) : (
                      <>
                        <WarningAmberIcon color="error" fontSize="small" />
                        <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                          Out of Stock
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Pricing Box */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(37, 99, 235, 0.04)',
                    borderColor: 'rgba(37, 99, 235, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${p.price}
                    </Typography>
                    {originalPrice && (
                      <Typography
                        variant="h6"
                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                      >
                        ${originalPrice}
                      </Typography>
                    )}
                    {p.discountPercentage > 0 && (
                      <Chip
                        label={`Save ${p.discountPercentage}%`}
                        color="error"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Inclusive of standard institutional administrative margin
                  </Typography>
                </Paper>

                {/* Description */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {p.description}
                </Typography>

                {/* Service badges */}
                <Grid container spacing={1.5} sx={{ mt: 'auto' }}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}
                    >
                      <LocalShippingOutlinedIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                        Shipping
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.shippingInformation || 'Standard Delivery'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}
                    >
                      <VerifiedUserOutlinedIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                        Warranty
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.warrantyInformation || '1 Year Manufacturer'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, height: '100%' }}
                    >
                      <AssignmentReturnOutlinedIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                        Return Policy
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.returnPolicy || '30 Days Return'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Bottom Row: Specifications Table & Customer Reviews */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Technical Specifications
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', width: '40%' }}>
                        Brand
                      </TableCell>
                      <TableCell>{p.brand || 'Generic'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{p.category}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Weight</TableCell>
                      <TableCell>{p.weight ? `${p.weight} kg / units` : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Dimensions</TableCell>
                      <TableCell>
                        {p.dimensions
                          ? `${p.dimensions.width}W × ${p.dimensions.height}H × ${p.dimensions.depth}D cm`
                          : 'Standard packaging'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Minimum Order</TableCell>
                      <TableCell>{p.minimumOrderQuantity || 1} unit(s)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Tags</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {p.tags?.map((tag) => (
                            <Chip key={tag} label={`#${tag}`} size="small" sx={{ fontSize: 11 }} />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </Grid>

            {/* Customer Reviews Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Customer Reviews
                  </Typography>
                  <Chip
                    label={`${p.reviews?.length || 0} Reviews`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />

                {p.reviews && p.reviews.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {p.reviews.map((rev, idx) => (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2, bgcolor: '#fafafa' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: 'secondary.main' }}>
                              {rev.reviewerName?.[0] || 'U'}
                            </Avatar>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {rev.reviewerName}
                            </Typography>
                          </Box>
                          <Rating value={rev.rating} precision={0.5} size="small" readOnly />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                          "{rev.comment}"
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {rev.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No customer reviews have been published for this item yet.
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
}
