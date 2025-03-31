import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Box
} from '@mui/material';
import useCabinetStore from '../store/store';

const EditUserCabinetsModal = ({ 
  open, 
  onClose, 
  userId,
  currentCabinets 
}) => {
  const { 
    allCabinets, 
    fetchAllCabinets, 
    cabinetsLoading, 
    cabinetsError,
    addUserCabinets
  } = useCabinetStore();
  
  const [selectedCabinets, setSelectedCabinets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchAllCabinets();
      setSelectedCabinets(currentCabinets || []);
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await addUserCabinets(userId, selectedCabinets);
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении кабинетов');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChip = (cabinetId) => {
    setSelectedCabinets(prev => prev.filter(id => id !== cabinetId));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Редактирование кабинетов пользователя
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Кабинеты</InputLabel>
            <Select
              multiple
              value={selectedCabinets}
              onChange={(e) => setSelectedCabinets(e.target.value)}
              renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((cabinetId) => {
                        const cabinet = allCabinets.find(c => c._id === cabinetId);
                        console.log('cabinet:',cabinet)
                        console.log('All Cabinets:',allCabinets)
                        if (!cabinet) return null;

                        return (
                        <Chip 
                            key={cabinetId}
                            label={`${cabinet.name} (№${cabinet.cabinet})`}
                            onDelete={
                            cabinetsLoading 
                                ? null 
                                : () => handleDeleteChip(cabinetId)
                            }
                        />
                        );
                    })}
                    </Box>
              )}
            >
              {cabinetsLoading && (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              )}
              
              {cabinetsError && (
                <MenuItem disabled>
                  <Alert severity="error">{cabinetsError}</Alert>
                </MenuItem>
              )}
              
              {allCabinets.map((cabinet) => (
                <MenuItem key={cabinet._id} value={cabinet._id}>
                  <Checkbox checked={selectedCabinets.includes(cabinet._id)} />
                  <ListItemText 
                    primary={`${cabinet.name} (№${cabinet.cabinet})`}
                    secondary={`Площадь: ${cabinet.S} м², Год: ${cabinet.year}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || cabinetsLoading}
          sx={{ borderRadius: '8px', minWidth: '300px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserCabinetsModal;