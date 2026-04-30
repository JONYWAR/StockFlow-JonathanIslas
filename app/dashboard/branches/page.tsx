'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { FormModal } from '@/src/components/FormModal';
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

const BranchCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);

    .action-buttons {
      opacity: 1;
    }
  }
`;

const ActionButtons = styled(Box)`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;

  @media (max-width: 600px) {
    opacity: 1;
  }
`;

interface Branch {
  _id: string;
  name: string;
  location: string;
  createdAt: string;
}

const BRANCH_FIELDS = [
  { name: 'name', label: 'Branch Name', required: true },
  { name: 'location', label: 'Location', required: true },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [editData, setEditData] = useState<Branch | null>(null);

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/branches');
      const data = await response.json();

      if (data.success) {
        setBranches(data.data);
      } else {
        setError(data.error || 'Failed to fetch branches');
      }
    } catch (err) {
      setError('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Create/Update branch
  const handleSubmit = async (formData: any) => {
    try {
      setSubmitError('');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/branches/${editingId}` : '/api/branches';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save branch');
      }

      setOpenModal(false);
      setEditingId(null);
      setEditData(null);
      fetchBranches();
    } catch (err: any) {
      setSubmitError(err.message);
      throw err;
    }
  };

  // Delete branch
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete branch');
      }

      fetchBranches();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch._id);
    setEditData(branch);
    setOpenModal(true);
  };

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Branches
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Manage your warehouse and store locations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingId(null);
            setEditData(null);
            setOpenModal(true);
          }}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add Branch
        </Button>
      </HeaderBox>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {branches.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">No branches found. Create one to get started.</Alert>
            </Grid>
          ) : (
            branches.map((branch) => (
              <Grid item xs={12} sm={6} md={4} key={branch._id}>
                <BranchCard>
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <LocationIcon
                        sx={{
                          color: '#0891B2',
                          fontSize: '24px',
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {branch.name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        pl: '32px',
                        mb: 2,
                      }}
                    >
                      {branch.location}
                    </Typography>

                    <ActionButtons className="action-buttons">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(branch)}
                          sx={{ color: '#5B61FF' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(branch._id)}
                          sx={{ color: '#EF4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ActionButtons>
                  </CardContent>
                </BranchCard>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <FormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingId(null);
          setEditData(null);
          setSubmitError('');
        }}
        onSubmit={handleSubmit}
        title={editingId ? 'Edit Branch' : 'Create Branch'}
        fields={BRANCH_FIELDS}
        submitButtonText={editingId ? 'Update' : 'Create'}
        error={submitError}
        initialData={editData || undefined}
      />
    </Box>
  );
}

