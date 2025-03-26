import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import gif from '../assets/t2.gif'

const SuccessModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Успешное сохранение!
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          py: 4
        }}>
          <img 
            src={gif}
            alt="Success"
            style={{ 
              width: '150px', 
              height: '150px', 
              objectFit: 'contain' 
            }} 
          />
          <Typography variant="body1" textAlign="center">
            Схема успешно сохранена на сервере
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ minWidth: '300px' }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;