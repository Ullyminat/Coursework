import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
  Avatar,
  CssBaseline,
  createTheme,
  ThemeProvider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import theme from './theme';
import gif from '../assets/t1.gif'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate(); // Добавить в импорты

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/home'); // Перенаправление на Home после успешного входа
      setError('');
    } catch (error) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img 
            src={gif}
            style={{ 
              width: '150px', 
              height: '150px', 
              objectFit: 'contain', 
              borderRadius: '50%'
            }} 
          />
          <Typography component="h1" variant="h5">
            Вход в систему
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;