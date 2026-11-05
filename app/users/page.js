'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTableRow from '@/components/users/UserTableRow';
import { useUserStore } from '@/store/userStore';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  Alert,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export default function UsersPage() {
  const {
    users,
    total,
    limit,
    skip,
    searchQuery,
    isLoading,
    error,
    fetchUsers,
    setPage,
    setRowsPerPage,
    setSearchQuery,
    clearError,
  } = useUserStore();

  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const isInitialMount = useRef(true);

  // Calculate zero-indexed page number for MUI TablePagination: page = skip / limit
  const page = useMemo(() => {
    return limit > 0 ? Math.floor(skip / limit) : 0;
  }, [skip, limit]);

  // Initial fetch on mount with default 10 per page
  useEffect(() => {
    fetchUsers({ limit: 10, skip: 0, query: searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search handler: only fires when user edits local search input
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, setSearchQuery]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    setSearchQuery('');
  }, [setSearchQuery]);

  const handlePageChange = useCallback(
    (event, newPage) => {
      setPage(newPage);
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
    fetchUsers({ limit, skip, query: searchQuery, forceRefresh: true });
  }, [fetchUsers, limit, skip, searchQuery]);

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
                Users Management
              </Typography>
              <Chip
                label={`${total} Total`}
                size="small"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage registered users, inspect corporate affiliations, and view profiles.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh Data
          </Button>
        </Box>

        {/* Filter & Search Bar */}
        <Card sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users by name, username, or email..."
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
        </Card>

        {/* Error Alert */}
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

        {/* Users Table */}
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="users directory table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 200 }}>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Loading State: Skeletons */}
                {isLoading ? (
                  Array.from(new Array(limit || 10)).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Box sx={{ width: '60%' }}>
                            <Skeleton variant="text" width="80%" height={20} />
                            <Skeleton variant="text" width="40%" height={16} />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={160} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rounded" width={60} height={24} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={120} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={140} />
                      </TableCell>
                      <TableCell align="right">
                        <Skeleton variant="circular" width={28} height={28} sx={{ ml: 'auto' }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  /* Empty State */
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <PeopleOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary">
                          No users found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                          {searchQuery
                            ? `We couldn't find any users matching "${searchQuery}". Try modifying your search keywords.`
                            : 'No user records are currently available.'}
                        </Typography>
                        {searchQuery && (
                          <Button variant="outlined" size="small" onClick={handleClearSearch} sx={{ mt: 1 }}>
                            Clear Search
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  /* Data Render */
                  users.map((user) => <UserTableRow key={user.id} user={user} />)
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* API-side Pagination Footer */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={total}
            rowsPerPage={limit}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Users per page:"
          />
        </Card>
      </Box>
    </DashboardLayout>
  );
}
