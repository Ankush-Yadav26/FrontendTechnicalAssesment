'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  TableRow,
  TableCell,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BusinessIcon from '@mui/icons-material/Business';

/**
 * UserTableRow - Memoized row component to avoid unnecessary re-renders
 * during parent updates or pagination changes.
 */
function UserTableRow({ user }) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/users/${user.id}`);
  };

  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'primary';
      case 'female':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <TableRow
      hover
      onClick={handleRowClick}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      {/* Name with Avatar */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}
          >
            {user.firstName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Email */}
      <TableCell>
        <Typography variant="body2" color="text.primary">
          {user.email}
        </Typography>
      </TableCell>

      {/* Gender */}
      <TableCell>
        <Chip
          label={user.gender || 'Unknown'}
          size="small"
          color={getGenderColor(user.gender)}
          variant="outlined"
          sx={{ textTransform: 'capitalize', fontWeight: 500 }}
        />
      </TableCell>

      {/* Phone */}
      <TableCell>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {user.phone}
        </Typography>
      </TableCell>

      {/* Company */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user.company?.name || 'Independent'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.company?.title || user.role || 'Staff'}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Action */}
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Tooltip title="View full profile">
          <IconButton
            size="small"
            color="primary"
            onClick={handleRowClick}
            aria-label={`View details for ${user.firstName}`}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

// React.memo prevents re-rendering when sibling rows or unrelated state updates occur
export default React.memo(UserTableRow);

