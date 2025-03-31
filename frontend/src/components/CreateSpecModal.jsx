import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';

const CreateSpecModal = ({ 
  open, 
  onClose, 
  onSpecCreated,
  loading,
  error,
  formComponent
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Создание новой специализации
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {formComponent}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: 'center', 
        p: 3,
        gap: 2
      }}>
        <Button 
          type="submit"
          form="create-spec-form"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            borderRadius: '8px',
            minWidth: '300px',
            px: 3
          }}
        >
          {loading ? (
            <CircularProgress 
              size={24} 
              sx={{ color: 'white' }} 
            />
          ) : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSpecModal;