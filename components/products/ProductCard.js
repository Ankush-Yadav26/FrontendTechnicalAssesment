'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

/**
 * ProductCard - Memoized component to optimize rendering in large product grids.
 */
function ProductCard({ product }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const imageSrc = product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300?text=No+Image';

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px -8px rgba(0, 0, 0, 0.12)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Category & Discount Tags */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <Chip
          label={product.category}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            fontWeight: 600,
            textTransform: 'capitalize',
            fontSize: 11,
          }}
        />
        {product.discountPercentage > 0 && (
          <Chip
            label={`-${Math.round(product.discountPercentage)}%`}
            size="small"
            color="error"
            sx={{ fontWeight: 700, fontSize: 11 }}
          />
        )}
      </Box>

      {/* Product Image */}
      <Box sx={{ position: 'relative', pt: '75%', bgcolor: '#f8fafc' }}>
        <CardMedia
          component="img"
          image={imageSrc}
          alt={product.title}
          loading="lazy"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            p: 2,
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.3,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
          title={product.title}
        >
          {product.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: 12,
            mb: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: 36,
          }}
        >
          {product.description}
        </Typography>

        {/* Rating & Stock */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating value={Number(product.rating) || 0} precision={0.1} size="small" readOnly />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {product.rating}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: product.stock > 10 ? 'success.main' : 'warning.main',
              fontWeight: 600,
            }}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Typography>
        </Box>

        {/* Price & Action */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
              ${product.price}
            </Typography>
            {product.discountPercentage > 0 && (
              <Typography
                variant="caption"
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </Typography>
            )}
          </Box>

          <Button
            size="small"
            variant="outlined"
            endIcon={<VisibilityOutlinedIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            sx={{ textTransform: 'none', py: 0.5, px: 1.25 }}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default React.memo(ProductCard);

