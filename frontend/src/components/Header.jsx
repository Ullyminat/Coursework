import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import useAuthStore from '../store/authStore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import theme from './theme';

const Header = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <AppBar 
      position="static"
      sx={{
        height: 72,
        backgroundColor: theme.palette.primary.main,
        boxShadow: 'none',
        borderRadius: '16px',
        mx: 'auto',
        width: 852,
        mt: 2
      }}
    >
      <Toolbar 
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3
        }}
      >

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: 16,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }
              }}
            >
              Создание паспорта
            </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/editor"
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: 16,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }
              }}
            >
              Редактор
            </Button>
            
            <Button
              component={Link}
              to="/profile"
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: 16,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }
              }}
            >
              Профиль
            </Button>
          </Box>
        </Box>

        {/* Кнопка выхода */}
        <IconButton
          onClick={logout}
          sx={{
            color: 'white',
            padding: 1.5,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          <ExitToAppIcon fontSize="medium" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;