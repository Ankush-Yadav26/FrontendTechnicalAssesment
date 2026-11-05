'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/products/ProductCard';
import { useProductStore } from '@/store/productStore';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Skeleton,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

export default function ProductsPage() {
  const {
    products,
    total,
    limit,
    skip,
    searchQuery,
    selectedCategory,
    categories,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    setCategory,
    setSearchQuery,
    setPage,
    setRowsPerPage,
    clearError,
  } = useProductStore();

  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const isInitialMount = useRef(true);

  // Calculate current zero-indexed page
  const page = useMemo(() => {
    return limit > 0 ? Math.floor(skip / limit) : 0;
  }, [skip, limit]);

  // Initial load once on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts({ limit: 12, skip: 0, query: searchQuery, category: selectedCategory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search: only fires when local search value changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, setSearchQuery]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleCategoryChange = useCallback(
    (e) => {
      setCategory(e.target.value);
    },
    [setCategory]
  );

  const handlePageChange = useCallback(
    (event, newPage) => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      const newLimit = parseInt(event.target.value, 10);
      setRowsPerPage(newLimit);
    },
    [setRowsPerPage]
  );

  const handleRefresh = useCallback(() => {
    fetchProducts({
      limit,
      skip,
      query: searchQuery,
      category: selectedCategory,
      forceRefresh: true,
    });
  }, [fetchProducts, limit, skip, searchQuery, selectedCategory]);

  const handleResetFilters = useCallback(() => {
    setLocalSearch('');
    setSearchQuery('');
    setCategory('all');
  }, [setSearchQuery, setCategory]);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        {/* Header Title & Actions */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Products Inventory
              </Typography>
              <Chip
                label={`${total} Items`}
                size="small"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Browse products, filter by category classification, and monitor inventory.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh Catalog
          </Button>
        </Box>

        {/* Filter Toolbar (Search + Category Select) */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Input */}
            <Grid item xs={12} sm={7} md={8}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products by title, brand, or description..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: localSearch && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch} aria-label="clear search">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category Dropdown */}
            <Grid item xs={12} sm={5} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-filter-label">Filter Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter-select"
                  value={selectedCategory}
                  label="Filter Category"
                  onChange={handleCategoryChange}
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: 0.5 }}>
                      <FilterAltOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        {/* Error Notification */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
            onClose={clearError}
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <Grid container spacing={2.5}>
            {Array.from(new Array(limit || 8)).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-card-${idx}`}>
                <Card sx={{ height: 360, p: 2 }}>
                  <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 1.5 }} />
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={16} />
                  <Skeleton variant="text" width="80%" height={16} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                    <Skeleton variant="text" width={60} height={28} />
                    <Skeleton variant="rounded" width={70} height={32} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : products.length === 0 ? (
          /* Empty State */
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Inventory2OutlinedIcon sx={{ fontSize: 54, color: 'text.secondary', opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450 }}>
                {searchQuery || selectedCategory !== 'all'
                  ? 'No matching catalog items were discovered with your current filter or search criteria.'
                  : 'No products are currently available in the system.'}
              </Typography>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button variant="outlined" size="small" onClick={handleResetFilters} sx={{ mt: 1 }}>
                  Reset Filters & Search
                </Button>
              )}
            </Box>
          </Card>
        ) : (
          /* Product Grid Display */
          <Grid container spacing={2.5}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* API-side Pagination Footer */}
        {total > 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%' }}>
              <TablePagination
                rowsPerPageOptions={[8, 12, 16, 24, 48]}
                component="div"
                count={total}
                rowsPerPage={limit}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Products per page:"
              />
            </Card>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
