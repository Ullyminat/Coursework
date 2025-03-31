import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import useCabinetStore from '../store/store';

const CreateCabinetForm = ({ onCabinetCreated }) => {
  const { createCabinet } = useCabinetStore();
  
  const [formData, setFormData] = useState({
    cabinet: '',
    year: '',
    S: '',
    name: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cabinet) newErrors.cabinet = 'Обязательное поле';
    if (!formData.year) newErrors.year = 'Обязательное поле';
    if (!formData.S) newErrors.S = 'Обязательное поле';
    if (!formData.name) newErrors.name = 'Обязательное поле';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');
    
    try {
      await createCabinet({
        cabinet: Number(formData.cabinet),
        year: Number(formData.year),
        S: Number(formData.S),
        name: formData.name
      });
      setFormData({
        cabinet: '',
        year: '',
        S: '',
        name: ''
      });
      onCabinetCreated?.();
    } catch (error) {
      setErrorMessage(error.message || 'Ошибка при создании кабинета');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <Box 
      component="form" 
      id="create-cabinet-form" 
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1 }}
    >
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Номер кабинета"
            name="cabinet"
            type="name"
            value={formData.cabinet}
            onChange={handleChange}
            error={!!errors.cabinet}
            helperText={errors.cabinet}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Год постройки"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            error={!!errors.year}
            helperText={errors.year}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Площадь (м²)"
            name="S"
            type="number"
            value={formData.S}
            onChange={handleChange}
            error={!!errors.S}
            helperText={errors.S}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Название"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default CreateCabinetForm;