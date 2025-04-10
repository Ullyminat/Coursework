import React, { useState } from 'react';
import { Box, TextField, Alert, CircularProgress } from '@mui/material';
import useCabinetStore from '../store/store';

const CreateUMKForm = ({ onUMKCreated }) => {
  const { createUMK } = useCabinetStore();
  const [formData, setFormData] = useState({ name: '', year: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Обязательное поле';
    if (!formData.year) newErrors.year = 'Обязательное поле';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');
    
    try {
      await createUMK(formData.name, formData.year);
      setFormData({ name: '', year: '' });
      onUMKCreated?.();
    } catch (error) {
      setErrorMessage(error || 'Ошибка при создании УМК');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <Box component="form" id="create-umk-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <TextField
        fullWidth
        label="Название УМК"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Год издания"
        name="year"
        type="number"
        value={formData.year}
        onChange={handleChange}
        error={!!errors.year}
        helperText={errors.year}
        required
        inputProps={{ min: "1900", max: "2100" }}
      />
      
      <input type="submit" hidden />
    </Box>
  );
};

export default CreateUMKForm;