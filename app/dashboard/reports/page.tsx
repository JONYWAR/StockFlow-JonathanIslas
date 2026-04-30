'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Summarize as SummarizeIcon } from '@mui/icons-material';

interface Movement {
  _id: string;
  movementType: 'entry' | 'out' | 'transfer';
  quantity: number;
  originBranch: { _id: string; name: string };
  destinationBranch?: { _id: string; name: string };
  createdAt: string;
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Construct local start and end of the day to ensure timezone consistency
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59.999');

      const response = await fetch(`/api/reports?startDate=${start.toISOString()}&endDate=${end.toISOString()}`);
      const data = await response.json();

      if (data.success) {
        setMovements(data.data);
        setHasSearched(true);
      } else {
        setError(data.error || 'Failed to fetch report');
      }
    } catch (err) {
      setError('An error occurred while fetching the report');
    } finally {
      setLoading(false);
    }
  };

  // Aggregations
  const totalsByType = movements.reduce(
    (acc, mov) => {
      acc[mov.movementType] = (acc[mov.movementType] || 0) + mov.quantity;
      return acc;
    },
    { entry: 0, out: 0, transfer: 0 } as Record<string, number>
  );

  const totalsByBranch: Record<string, { name: string; entry: number; out: number; transferIn: number; transferOut: number }> = {};

  movements.forEach((mov) => {
    const originId = mov.originBranch._id;
    if (!totalsByBranch[originId]) {
      totalsByBranch[originId] = { name: mov.originBranch.name, entry: 0, out: 0, transferIn: 0, transferOut: 0 };
    }

    if (mov.movementType === 'entry') {
      totalsByBranch[originId].entry += mov.quantity;
    } else if (mov.movementType === 'out') {
      totalsByBranch[originId].out += mov.quantity;
    } else if (mov.movementType === 'transfer') {
      totalsByBranch[originId].transferOut += mov.quantity;
      
      if (mov.destinationBranch) {
        const destId = mov.destinationBranch._id;
        if (!totalsByBranch[destId]) {
          totalsByBranch[destId] = { name: mov.destinationBranch.name, entry: 0, out: 0, transferIn: 0, transferOut: 0 };
        }
        totalsByBranch[destId].transferIn += mov.quantity;
      }
    }
  });

  const branchSummary = Object.values(totalsByBranch).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Inventory Reports
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
        Analyze stock movements across branches and time periods
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SummarizeIcon />}
              onClick={fetchReport}
              disabled={loading}
              sx={{ height: '40px' }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : hasSearched ? (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#E0F2FE' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
                    Total Entries
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#0369A1' }}>{totalsByType.entry}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#FEF2F2' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
                    Total Outs
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#991B1B' }}>{totalsByType.out}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#F0F9FF' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
                    Total Transfers
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#075985' }}>{totalsByType.transfer}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Totals by Branch
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Branch Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Entries (+)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Outs (-)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Transfers In (+)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Transfers Out (-)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#111827' }}>Net Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchSummary.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="textSecondary">
                        No movements found for the selected period
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  branchSummary.map((branch) => {
                    const netChange = branch.entry + branch.transferIn - branch.out - branch.transferOut;
                    return (
                      <TableRow key={branch.name}>
                        <TableCell sx={{ fontWeight: 500 }}>{branch.name}</TableCell>
                        <TableCell align="right" sx={{ color: '#059669' }}>{branch.entry}</TableCell>
                        <TableCell align="right" sx={{ color: '#DC2626' }}>{branch.out}</TableCell>
                        <TableCell align="right" sx={{ color: '#059669' }}>{branch.transferIn}</TableCell>
                        <TableCell align="right" sx={{ color: '#DC2626' }}>{branch.transferOut}</TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 700, 
                          color: netChange > 0 ? '#059669' : netChange < 0 ? '#DC2626' : 'inherit' 
                        }}>
                          {netChange > 0 ? `+${netChange}` : netChange}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, color: '#6B7280' }}>
          <Typography variant="body1">
            Select a date range and click Generate Report to see data.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

