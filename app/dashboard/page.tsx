'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Inventory as ProductsIcon,
  LocationOn as BranchesIcon,
} from '@mui/icons-material';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Products',
      value: '--',
      icon: ProductsIcon,
      color: '#5B61FF',
      change: '+0%',
    },
    {
      title: 'Total Branches',
      value: '--',
      icon: BranchesIcon,
      color: '#0891B2',
      change: '+0%',
    },
    {
      title: 'Movements Today',
      value: '--',
      icon: TrendingIcon,
      color: '#10B981',
      change: '+0%',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Overview of your inventory system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#10B981' }}>
                        {stat.change}
                      </Typography>
                    </Box>
                    <Icon sx={{ fontSize: 32, color: stat.color, opacity: 0.2 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
