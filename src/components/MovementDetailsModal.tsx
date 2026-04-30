'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowDownward as InIcon,
  ArrowUpward as OutIcon,
  SwapHoriz as TransferIcon,
  Event as EventIcon,
  Inventory as ProductIcon,
  LocationOn as BranchIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

interface Movement {
  _id: string;
  movementType: 'entry' | 'out' | 'transfer';
  productId: { _id: string; name: string } | null;
  quantity: number;
  status: 'pending' | 'processed' | 'failed';
  originBranch: { _id: string; name: string } | null;
  destinationBranch?: { _id: string; name: string } | null;
  reason?: string;
  failureReason?: string;
  createdAt: string;
}

interface MovementDetailsModalProps {
  open: boolean;
  onClose: () => void;
  movement: Movement | null;
}

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
  processed: 'success',
  pending: 'warning',
  failed: 'error',
};

const movementIcons: Record<'entry' | 'out' | 'transfer', React.ReactNode> = {
  entry: <InIcon color="primary" />,
  out: <OutIcon color="secondary" />,
  transfer: <TransferIcon color="action" />,
};

export default function MovementDetailsModal({
  open,
  onClose,
  movement,
}: MovementDetailsModalProps) {
  if (!movement) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
        Movement Details
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          label={movement.status}
          size="small"
          color={statusColors[movement.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2 }}>
                  {movementIcons[movement.movementType]}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Movement Type
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                    {movement.movementType}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Product & Quantity */}
            <Grid item xs={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <ProductIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Product
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {movement.productId?.name || '[Deleted Product]'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Quantity
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  {movement.quantity}
                </Typography>
              </Box>
            </Grid>

            {/* Branches */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <BranchIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Origin Branch
                  </Typography>
                  <Typography variant="body1">
                    {movement.originBranch?.name || '[Deleted Branch]'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <BranchIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Destination Branch
                  </Typography>
                  <Typography variant="body1">
                    {movement.destinationBranch?.name || 'Supplier/Customer'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Date */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">{formatDate(movement.createdAt)}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* ID */}
            <Grid item xs={12}>
               <Box>
                  <Typography variant="caption" color="text.secondary">
                    Movement ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#F3F4F6', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                    {movement._id}
                  </Typography>
                </Box>
            </Grid>

            {/* Reason / Notes */}
            {movement.reason && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#EFF6FF',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: '#DBEAFE'
                }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#1E40AF', fontWeight: 600 }}>
                      User Reason / Notes
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1E40AF' }}>
                      {movement.reason}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Failure Reason */}
            {movement.failureReason && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#FEF2F2',
                  borderRadius: 1,
                  display: 'flex',
                  gap: 1.5,
                  border: '1px solid',
                  borderColor: '#FEE2E2'
                }}>
                  <ErrorIcon sx={{ color: '#EF4444' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#991B1B', fontWeight: 600 }}>
                      Failure Reason
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B91C1C' }}>
                      {movement.failureReason}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
