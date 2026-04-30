'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import styled from '@emotion/styled';

const SectionTitle = styled(Typography)`
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const FilterBox = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FilterControl = styled(FormControl)`
  min-width: 200px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

interface Product {
  _id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
}

interface Stock {
  _id: string;
  productId: Product;
  branchId: { _id: string; name: string };
  quantity: number;
}

interface Movement {
  _id: string;
  movementType: 'entry' | 'out' | 'transfer';
  productId: Product;
  quantity: number;
  status: 'pending' | 'processed' | 'failed';
  originBranch: { _id: string; name: string };
  destinationBranch?: { _id: string; name: string };
  reason?: string;
  createdAt: string;
}

interface Branch {
  _id: string;
  name: string;
}

export default function DashboardPage() {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [productsPage, setProductsPage] = useState(0);
  const [productsRowsPerPage, setProductsRowsPerPage] = useState(5);

  // Movements state
  const [movements, setMovements] = useState<Movement[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [movementsLoading, setMovementsLoading] = useState(true);
  const [movementsError, setMovementsError] = useState('');
  const [movementsPage, setMovementsPage] = useState(0);
  const [movementsRowsPerPage, setMovementsRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  // Fetch products and stocks
  useEffect(() => {
    const fetchProductsAndStocks = async () => {
      try {
        setProductsLoading(true);
        const [productsRes, stocksRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/stocks'),
        ]);

        const productsData = await productsRes.json();
        const stocksData = await stocksRes.json();

        if (productsData.success) {
          setProducts(productsData.data);
        }
        if (stocksData.success) {
          setStocks(stocksData.data);
        }
      } catch (err) {
        setProductsError('Failed to fetch products and stocks');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProductsAndStocks();
  }, []);

  // Fetch movements and branches
  useEffect(() => {
    const fetchMovementsAndBranches = async () => {
      try {
        setMovementsLoading(true);
        const [movementsRes, branchesRes] = await Promise.all([
          fetch('/api/movements'),
          fetch('/api/branches'),
        ]);

        const movementsData = await movementsRes.json();
        const branchesData = await branchesRes.json();

        if (movementsData.success) {
          setMovements(movementsData.data);
        }
        if (branchesData.success) {
          setBranches(branchesData.data);
        }
      } catch (err) {
        setMovementsError('Failed to fetch movements and branches');
      } finally {
        setMovementsLoading(false);
      }
    };

    fetchMovementsAndBranches();
  }, []);

  // Calculate total stock per product
  const getProductTotalStock = (productId: string) => {
    return stocks
      .filter((stock) => stock.productId._id === productId)
      .reduce((total, stock) => total + stock.quantity, 0);
  };

  // Get stock by branch for a product
  const getStockByBranch = (productId: string) => {
    return stocks.filter((stock) => stock.productId._id === productId);
  };

  // Filter movements
  const filteredMovements = movements.filter((movement) => {
    const matchStatus = !statusFilter || movement.status === statusFilter;
    const matchBranch = !branchFilter || movement.originBranch._id === branchFilter;
    return matchStatus && matchBranch;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get movement type label
  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'entry':
        return '📥 Entry';
      case 'out':
        return '📤 Out';
      case 'transfer':
        return '↔️ Transfer';
      default:
        return type;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Inventory Overview
        </Typography>
      </Box>

      {/* Products Section */}
      <SectionTitle variant="h6">Products Inventory</SectionTitle>
      {productsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {productsError}
        </Alert>
      )}
      {productsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell>SKU</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Total Stock</TableCell>
                  <TableCell>Stock by Branch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(
                    productsPage * productsRowsPerPage,
                    productsPage * productsRowsPerPage + productsRowsPerPage
                  )
                  .map((product) => (
                    <TableRow
                      key={product._id}
                      sx={{
                        '&:hover': { backgroundColor: '#F9FAFB' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={getProductTotalStock(product._id)}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {getStockByBranch(product._id).length > 0 ? (
                            getStockByBranch(product._id).map((stock) => (
                              <Chip
                                key={stock._id}
                                label={`${stock.branchId.name}: ${stock.quantity}`}
                                size="small"
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                              No stock
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={productsRowsPerPage}
            page={productsPage}
            onPageChange={(e, newPage) => setProductsPage(newPage)}
            onRowsPerPageChange={(e) => {
              setProductsRowsPerPage(parseInt(e.target.value, 10));
              setProductsPage(0);
            }}
          />
        </>
      )}

      {/* Movements Section */}
      <SectionTitle variant="h6">Movements</SectionTitle>
      {movementsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {movementsError}
        </Alert>
      )}

      {/* Filters */}
      <FilterBox>
        <FilterControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setMovementsPage(0);
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processed">Processed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FilterControl>

        <FilterControl size="small">
          <InputLabel>Branch</InputLabel>
          <Select
            value={branchFilter}
            label="Branch"
            onChange={(e) => {
              setBranchFilter(e.target.value);
              setMovementsPage(0);
            }}
          >
            <MenuItem value="">All Branches</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FilterControl>
      </FilterBox>

      {/* Movements Table */}
      {movementsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell>Type</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovements
                  .slice(
                    movementsPage * movementsRowsPerPage,
                    movementsPage * movementsRowsPerPage + movementsRowsPerPage
                  )
                  .map((movement) => (
                    <TableRow
                      key={movement._id}
                      sx={{
                        '&:hover': { backgroundColor: '#F9FAFB' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>{getMovementTypeLabel(movement.movementType)}</TableCell>
                      <TableCell>{movement.productId.name}</TableCell>
                      <TableCell align="center">{movement.quantity}</TableCell>
                      <TableCell>{movement.originBranch.name}</TableCell>
                      <TableCell>
                        {movement.destinationBranch
                          ? movement.destinationBranch.name
                          : movement.movementType === 'out'
                          ? 'Customer'
                          : 'Supplier'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={movement.status}
                          color={getStatusColor(movement.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(movement.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredMovements.length}
            rowsPerPage={movementsRowsPerPage}
            page={movementsPage}
            onPageChange={(e, newPage) => setMovementsPage(newPage)}
            onRowsPerPageChange={(e) => {
              setMovementsRowsPerPage(parseInt(e.target.value, 10));
              setMovementsPage(0);
            }}
          />
        </>
      )}
    </Box>
  );
}
