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
  }[];
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  submitButtonText?: string;
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
  children,
}: FormModalProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [formError, setFormError] = React.useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

            {fields.map((field) => (
              <TextField
                key={field.name}
                fullWidth
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={handleChange}
                disabled={loading}
                size="small"
                select={field.select}
              >
                {field.select &&
                  field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </TextField>
            ))}
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

