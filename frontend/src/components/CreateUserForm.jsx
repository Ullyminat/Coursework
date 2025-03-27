import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Checkbox,
  ListItemText
} from '@mui/material';
import useCabinetStore from '../store/store';

const CreateUserForm = ({ onUserCreated }) => {
  const { 
    createUser, 
    allCabinets, 
    fetchAllCabinets, 
    cabinetsLoading, 
    cabinetsError 
  } = useCabinetStore();
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    password: '',
    role: 'user',
    cabinets: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchAllCabinets();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Обязательное поле';
    if (!formData.surname) newErrors.surname = 'Обязательное поле';
    if (!formData.email) newErrors.email = 'Обязательное поле';
    if (!formData.password) newErrors.password = 'Обязательное поле';
    if (formData.password.length < 6) newErrors.password = 'Минимум 6 символов';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');
    
    try {
      await createUser(formData);
      setFormData({
        name: '',
        surname: '',
        patronymic: '',
        email: '',
        password: '',
        role: 'user',
        cabinets: []
      });
      onUserCreated?.();
    } catch (error) {
      setErrorMessage(error.message || 'Ошибка при создании пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCabinetsChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      cabinets: typeof value === 'string' ? value.split(',') : value,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Создание нового пользователя
            </Typography>
          </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Фамилия"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              error={!!errors.surname}
              helperText={errors.surname}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Отчество"
              name="patronymic"
              value={formData.patronymic}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Роль"
              >
                <MenuItem value="user">Пользователь</MenuItem>
                <MenuItem value="admin">Администратор</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Кабинеты</InputLabel>
              <Select
                multiple
                name="cabinets"
                value={formData.cabinets}
                onChange={handleCabinetsChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const cabinet = allCabinets.find(c => c._id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={cabinet ? `${cabinet.name} (№${cabinet.cabinet})` : value}
                          onDelete={() => handleCabinetsChange({
                            target: {
                              value: selected.filter(v => v !== value)
                            }
                          })}
                        />
                      );
                    })}
                  </Box>
                )}
                disabled={cabinetsLoading || !!cabinetsError}
              >
                {cabinetsError && (
                  <MenuItem disabled>
                    <Alert severity="error">{cabinetsError}</Alert>
                  </MenuItem>
                )}

                {cabinetsLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : allCabinets.map((cabinet) => (
                  <MenuItem key={cabinet._id} value={cabinet._id}>
                    <Checkbox checked={formData.cabinets.includes(cabinet._id)} />
                    <ListItemText 
                      primary={`${cabinet.name} (№${cabinet.cabinet})`} 
                      secondary={`Площадь: ${cabinet.S} м²`} 
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ minWidth: 300 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Создать'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateUserForm;