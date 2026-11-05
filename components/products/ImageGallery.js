'use client';

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ImageGallery({ images = [], title = 'Product' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const validImages = Array.isArray(images) && images.length > 0
    ? images
    : ['https://via.placeholder.com/600x400?text=No+Image'];

  // Reset index when the product changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  // Ensure selectedIndex is always valid
  const safeIndex = selectedIndex < validImages.length ? selectedIndex : 0;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Main Image Display */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          position: 'relative',
          width: '100%',
          pt: { xs: '80%', sm: '70%' },
          bgcolor: '#f8fafc',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={validImages[safeIndex]}
          alt={`${title} - image ${safeIndex + 1}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            p: 3,
            transition: 'opacity 0.25s ease-in-out',
          }}
        />

        {/* Carousel Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              size="small"
              aria-label="Previous image"
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                boxShadow: 2,
                '&:hover': { bgcolor: '#ffffff' },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              size="small"
              aria-label="Next image"
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                boxShadow: 2,
                '&:hover': { bgcolor: '#ffffff' },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            {/* Counter badge */}
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              {safeIndex + 1} / {validImages.length}
            </Typography>
          </>
        )}
      </Paper>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mt: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 3 },
          }}
        >
          {validImages.map((img, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              sx={{
                width: 72,
                height: 72,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: safeIndex === idx ? 'primary.main' : 'divider',
                cursor: 'pointer',
                bgcolor: '#f8fafc',
                p: 0.5,
                transition: 'border-color 0.15s ease',
                '&:hover': {
                  borderColor: safeIndex === idx ? 'primary.main' : 'text.secondary',
                },
              }}
            >
              <Box
                component="img"
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
