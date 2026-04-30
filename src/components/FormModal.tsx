'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { FormEvent, ReactNode } from 'react';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  title: string;
  fields: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    select?: boolean;
    options?: { value: string; label: string }[];
    freeSolo?: boolean;
  }[];
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  submitButtonText?: string;
  initialData?: Record<string, any>;
  children?: ReactNode;
}

export function FormModal({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  loading = false,
  error,
  submitButtonText = 'Create',
  initialData,
  children,
}: FormModalProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [formError, setFormError] = React.useState<string>('');

  React.useEffect(() => {
    if (open) {
      setFormData(initialData || {});
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert to number if the input type is number
    const finalValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      await onSubmit(formData);
      setFormData({});
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    }
  };

  const handleClose = () => {
    setFormData({});
    setFormError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {(error || formError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || formError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {children}

            {fields.map((field) => {
              if (field.type === 'autocomplete') {
                return (
                  <Autocomplete
                    key={field.name}
                    freeSolo
                    options={field.options?.map((opt) => opt.value) || []}
                    value={formData[field.name] || ''}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: newValue,
                      }));
                    }}
                    onInputChange={(_, newInputValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: newInputValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={field.label}
                        required={field.required}
                        placeholder={field.placeholder}
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                );
              }

              return (
                <TextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type={field.type === 'select' ? 'text' : (field.type || 'text')}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  disabled={loading}
                  size="small"
                  select={field.select || field.type === 'select'}
                >
                  {(field.select || field.type === 'select') &&
                    field.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                </TextField>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 80 }}
          >
            {loading ? 'Loading...' : submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

