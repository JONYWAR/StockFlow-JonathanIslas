'use client';

import React, { useState } from 'react';
import { Box, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
import Link from 'next/link';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
      
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          width: '100%',
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component={Link} 
            href="/"
            sx={{ 
                fontWeight: 700,
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #5b61ff 0%, #4348cc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}
          >
            StockFlow
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          minHeight: '100vh',
          backgroundColor: '#F9FAFB',
          overflowY: 'auto',
        }}
      >
        <Toolbar sx={{ display: { md: 'none' } }} />
        {children}
      </Box>
    </Box>
  );
}
