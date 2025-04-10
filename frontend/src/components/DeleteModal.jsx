import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import deleteGif from '../assets/t3.gif';

const DeleteModal = ({ 
  open,
  onClose,
  onConfirm,
  itemName,
  type = 'элемент',
  isLoading = false
}) => {
  // Функция для правильного склонения слова
  const getTypeDeclaration = () => {
    const types = {
      'кабинет': { preposition: 'кабинет', accusative: 'кабинет' },
      'специальность': { preposition: 'специальность', accusative: 'специальность' },
      'умк': { preposition: 'УМК', accusative: 'УМК' },
      'пользователь': { preposition: 'пользователя', accusative: 'пользователя' }
    };
    
    return types[type.toLowerCase()] || { preposition: type, accusative: type };
  };

  const { preposition, accusative } = getTypeDeclaration();

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
        {`Подтверждение удаления ${preposition}`}
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
            src={deleteGif}
            alt="Delete confirmation"
            style={{ 
              width: '150px', 
              height: '150px', 
              objectFit: 'contain',
            }} 
          />
          <Typography variant="body1" textAlign="center">
            {`Вы уверены, что хотите удалить ${accusative}`}
          </Typography>
          
          {itemName && (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                textAlign: 'center',
                maxWidth: '80%',
                wordBreak: 'break-word'
              }}
            >
              {`«${itemName}»?`}
            </Typography>
          )}
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'error.main',
              fontWeight: 500
            }}
          >
            Это действие нельзя отменить!
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: 'center', 
        py: 2,
        gap: 2,
        pb: 4
      }}>
        <Button 
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            minWidth: '300px',
            borderRadius: '8px',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress 
              size={24} 
              sx={{ color: 'white' }} 
            />
          ) : 'Удалить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;