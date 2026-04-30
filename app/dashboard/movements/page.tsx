'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowDownward as InIcon,
  ArrowUpward as OutIcon,
  SwapHoriz as TransferIcon,
} from '@mui/icons-material';
import { FormModal } from '@/src/components/FormModal';
import MovementDetailsModal from '@/src/components/MovementDetailsModal';
import styled from '@emotion/styled';

const HeaderBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterBox = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

interface Movement {
  _id: string;
  movementType: 'entry' | 'out' | 'transfer';
  productId: { _id: string; name: string };
  quantity: number;
  status: 'pending' | 'processed' | 'failed';
  originBranch: { _id: string; name: string };
  destinationBranch?: { _id: string; name: string };
  reason?: string;
  failureReason?: string;
  createdAt: string;
}

interface Branch {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
}

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
  processed: 'success',
  pending: 'warning',
  failed: 'error',
};

const movementIcons: Record<'entry' | 'out' | 'transfer', React.ReactNode> = {
  entry: <InIcon fontSize="small" sx={{ mr: 0.5 }} />,
  out: <OutIcon fontSize="small" sx={{ mr: 0.5 }} />,
  transfer: <TransferIcon fontSize="small" sx={{ mr: 0.5 }} />,
};


export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const dynamicMovementFields = [
    {
      name: 'movementType',
      label: 'Movement Type',
      type: 'select',
      options: [
        { value: 'entry', label: 'Stock Entry' },
        { value: 'out', label: 'Stock Out' },
        { value: 'transfer', label: 'Transfer' },
      ],
      required: true,
    },
    {
      name: 'productId',
      label: 'Product',
      type: 'select',
      options: products.map((p) => ({ value: p._id, label: p.name })),
      required: true,
    },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    {
      name: 'originBranch',
      label: 'Origin Branch',
      type: 'select',
      options: branches.map((b) => ({ value: b._id, label: b.name })),
      required: true,
    },
    {
      name: 'destinationBranch',
      label: 'Destination Branch',
      type: 'select',
      options: branches.map((b) => ({ value: b._id, label: b.name })),
    },
    { name: 'reason', label: 'Reason' },
  ];

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [movRes, branchRes, prodRes] = await Promise.all([
        fetch('/api/movements'),
        fetch('/api/branches'),
        fetch('/api/products'),
      ]);

      const movData = await movRes.json();
      const branchData = await branchRes.json();
      const prodData = await prodRes.json();

      if (movData.success) setMovements(movData.data);
      if (branchData.success) setBranches(branchData.data);
      if (prodData.success) setProducts(prodData.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create movement
  const handleSubmit = async (formData: any) => {
    try {
      setSubmitError('');
      const response = await fetch('/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create movement');
      }

      setOpenModal(false);
      fetchData();
    } catch (err: any) {
      setSubmitError(err.message);
      throw err;
    }
  };

  // Delete movement
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movement?')) return;

    try {
      const response = await fetch(`/api/movements/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete movement');
      }

      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Filter movements
  const filteredMovements = movements.filter((mov) => {
    const statusMatch = !statusFilter || mov.status === statusFilter;
    const branchMatch = !branchFilter || mov.originBranch._id === branchFilter;
    return statusMatch && branchMatch;
  });

  const handleRowClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setDetailsModalOpen(true);
  };

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Movements
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Track inventory movements across branches
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Create Movement
        </Button>
      </HeaderBox>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FilterBox>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processed">Processed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            value={branchFilter}
            label="Branch"
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <MenuItem value="">All Branches</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterBox>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Product</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      No movements found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMovements.map((movement) => (
                  <TableRow
                    key={movement._id}
                    onClick={() => handleRowClick(movement)}
                    sx={{
                      '&:hover': { backgroundColor: '#F9FAFB', cursor: 'pointer' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {movementIcons[movement.movementType]}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {movement.movementType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{movement.productId.name}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {movement.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>{movement.originBranch?.name}</TableCell>
                    <TableCell>
                      {movement.destinationBranch?.name || 'Supplier/Customer'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={movement.status}
                        size="small"
                        color={statusColors[movement.status]}
                        variant="filled"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(movement._id);
                          }}
                          sx={{ color: '#EF4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <FormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSubmitError('');
        }}
        onSubmit={handleSubmit}
        title="Create Movement"
        fields={dynamicMovementFields}
        submitButtonText="Create"
        error={submitError}
      />

      <MovementDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedMovement(null);
        }}
        movement={selectedMovement}
      />
    </Box>
  );
}

