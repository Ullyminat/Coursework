import React, { useState } from 'react';
import {
  Box,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import useCabinetStore from '../store/store';

const CreateSpecForm = ({ onSpecCreated }) => {
  const { createSpec } = useCabinetStore();
  
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название специализации обязательно');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await createSpec(name);
      setName('');
      onSpecCreated?.();
    } catch (err) {
      setError(err.message || 'Ошибка при создании специализации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      id="create-spec-form" 
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1 }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Название специализации"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        error={!!error}
        helperText={error}
        required
        sx={{ mb: 2 }}
      />
      
      <input type="submit" hidden />
    </Box>
  );
};

export default CreateSpecForm;