import { AppBar, Toolbar, Typography, Button, Box, useTheme, Container } from '@mui/material';
import useAuthStore from '../store/authStore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import theme from './theme';

const Header = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <Container component="main" maxWidth="md">
    <AppBar 
      position="static" 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: '16px',
        mt: '20px'
      }}
    >
      <Toolbar sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 1000,
        margin: '0 auto',
        width: '100%',
        padding: '10px !important',
      }}>
        {/* Левая часть с навигацией */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            href="/" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Создание паспорта
          </Button>
          
          <Button 
            href="#" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Мой профиль
          </Button>
        </Box>

        {/* Правая часть с кнопкой выхода */}
        {isAuthenticated && (
          <Button
            variant="contained"
            // color="secondary"
            startIcon={<ExitToAppIcon />}
            onClick={logout}
            sx={{
              fontWeight: 600,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark
              }
            }}
            
          >
            Выход
          </Button>
        )}
      </Toolbar>
    </AppBar>
    </Container>
  );
};

export default Header;