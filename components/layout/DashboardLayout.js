'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuthStore } from '@/store/authStore';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Users Management', path: '/users', icon: <PeopleAltOutlinedIcon /> },
  { label: 'Products Management', path: '/products', icon: <Inventory2OutlinedIcon /> },
];

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    router.replace('/login');
  };

  const isCurrentActive = (itemPath) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(itemPath);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            color: '#ffffff',
            width: 40,
            height: 40,
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
          }}
        >
          <SchoolIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
            Help Study Abroad
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <Box sx={{ px: 2, py: 3, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1.5,
            display: 'block',
            fontWeight: 700,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const active = isCurrentActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.75 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.25,
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    fontWeight: active ? 600 : 500,
                    '&:hover': {
                      bgcolor: active ? 'rgba(37, 99, 235, 0.12)' : 'rgba(15, 23, 42, 0.04)',
                      color: active ? 'primary.main' : 'text.primary',
                    },
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: active ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sidebar Footer User Card */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            src={user?.image || ''}
            alt={user?.firstName || 'Admin'}
            sx={{ width: 36, height: 36 }}
          >
            {user?.firstName?.[0] || 'A'}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true }}>
              {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', noWrap: true, display: 'block' }}>
              {user?.email || 'admin@demo.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Top Navbar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { md: `${DRAWER_WIDTH}px` },
            bgcolor: '#ffffff',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, display: { md: 'none' } }}
                aria-label="open navigation menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 700 }}>
                {pathname.startsWith('/users')
                  ? 'Users Directory'
                  : pathname.startsWith('/products')
                  ? 'Products Inventory'
                  : 'Dashboard Overview'}
              </Typography>
            </Box>

            {/* Right Top Header Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="Admin Role"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 600, fontSize: 12 }}
              />

              <Box
                onClick={handleMenuOpen}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  p: 0.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <Avatar
                  src={user?.image || ''}
                  alt={user?.firstName || 'User'}
                  sx={{ width: 34, height: 34, border: '2px solid', borderColor: 'primary.light' }}
                >
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600, color: 'text.primary' }}
                >
                  {user?.firstName || 'Admin'}
                </Typography>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 200, mt: 1, borderRadius: 2 },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user?.username || 'admin'}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1 }}>
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </MenuItem>
              </Menu>

              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Navigation */}
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
          aria-label="admin navigation drawer"
        >
          {/* Mobile Temporary Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {drawerContent}
          </Drawer>

          {/* Desktop Permanent Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            mt: '64px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
