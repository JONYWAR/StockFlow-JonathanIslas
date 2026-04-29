'use client';

import React from 'react';
import {Box, Card, CardContent, Typography, Button, Paper} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Inventory as ProductsIcon,
  LocationOn as BranchesIcon,
  SwapHoriz as MovementsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import styled from '@emotion/styled';

const StatCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(91, 97, 255, 0.15);
  }
`;

const IconBox = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
`;

export default function Dashboard() {
  const stats = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: ProductsIcon,
      link: '/dashboard/products',
      bgColor: '#EBF2FF',
      color: '#5B61FF',
    },
    {
      title: 'Branches',
      description: 'Manage your warehouse locations',
      icon: BranchesIcon,
      link: '/dashboard/branches',
      bgColor: '#F0FFFE',
      color: '#0891B2',
    },
    {
      title: 'Movements',
      description: 'Track inventory movements',
      icon: MovementsIcon,
      link: '/dashboard/movements',
      bgColor: '#FEF3EE',
      color: '#EA580C',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Welcome to StockFlow. Start managing your inventory system.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Grid key={stat.title}>
              <StatCard>
                <CardContent sx={{ flex: 1 }}>
                  <IconBox sx={{ backgroundColor: stat.bgColor }}>
                    <Icon sx={{ color: stat.color }} />
                  </IconBox>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {stat.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                    {stat.description}
                  </Typography>

                  <Button
                    component={Link}
                    href={stat.link}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: stat.color,
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Go to {stat.title}
                  </Button>
                </CardContent>
              </StatCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
