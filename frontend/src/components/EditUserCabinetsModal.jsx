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
    addUserCabinets,
    fetchUser,
    userDetails,
    fetchUsers
  } = useCabinetStore();
  
  const [selectedCabinets, setSelectedCabinets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка данных при открытии модалки
  useEffect(() => {
    if (open) {
      const loadData = async () => {
        try {
          setLoading(true);
          await fetchAllCabinets();
          if (userId) {
            const user = await fetchUser(userId);
            // Удаляем дубликаты кабинетов
            setSelectedCabinets([...new Set(user.cabinets || [])]);
          }
        } catch (err) {
          setError('Ошибка загрузки данных');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [open, userId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      // Удаляем дубликаты перед отправкой
      const uniqueCabinets = [...new Set(selectedCabinets)];
      await addUserCabinets(userId, uniqueCabinets);
      // Обновляем список пользователей после изменения
      await fetchUsers();
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

  const getCabinetInfo = (cabinetId) => {
    const cabinet = allCabinets.find(c => c._id === cabinetId);
    return {
      name: cabinet?.name || 'Неизвестный кабинет',
      cabinet: cabinet?.cabinet || '?',
      exists: !!cabinet
    };
  };

  // Удаляем дубликаты перед рендерингом
  const uniqueSelectedCabinets = [...new Set(selectedCabinets)];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Редактирование кабинетов
        {userDetails && ` - ${userDetails.surname} ${userDetails.name}`}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Кабинеты</InputLabel>
            <Select
              multiple
              value={uniqueSelectedCabinets}
              onChange={(e) => {
                // Удаляем дубликаты при изменении
                const uniqueValues = [...new Set(e.target.value)];
                setSelectedCabinets(uniqueValues);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((cabinetId) => {
                    const { name, cabinet } = getCabinetInfo(cabinetId);
                    return (
                      <Chip 
                        key={`${cabinetId}-${Math.random().toString(36).substr(2, 9)}`}
                        label={`${name} (№${cabinet})`}
                        onDelete={() => handleDeleteChip(cabinetId)}
                        disabled={loading}
                      />
                    );
                  })}
                </Box>
              )}
              disabled={loading || cabinetsLoading}
            >
              {cabinetsLoading ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <CircularProgress size={24} />
                  </Box>
                </MenuItem>
              ) : cabinetsError ? (
                <MenuItem disabled>
                  <Alert severity="error">{cabinetsError}</Alert>
                </MenuItem>
              ) : (
                allCabinets.map((cabinet) => (
                  <MenuItem key={cabinet._id} value={cabinet._id}>
                    <Checkbox 
                      checked={uniqueSelectedCabinets.includes(cabinet._id)} 
                      disabled={loading}
                    />
                    <ListItemText 
                      primary={`${cabinet.name} (№${cabinet.cabinet})`}
                      secondary={`Площадь: ${cabinet.S} м², Год: ${cabinet.year}`}
                    />
                  </MenuItem>
                ))
              )}
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
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserCabinetsModal;