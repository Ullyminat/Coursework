import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminNavigation = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      alignItems: 'center',
      mb: 0,
      width: '100%'
    }}>
    <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/admin/users')}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          flex: 1,
          minWidth: '100%',
          px: 3,
          py: 1
        }}
      >
        Пользователи
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/admin/cabinets')}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          flex: 1,
          minWidth: '200px',
          px: 3,
          py: 1
        }}
      >
        Кабинеты
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/admin/specs')}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          flex: 1,
          minWidth: '200px',
          px: 3,
          py: 1
        }}
      >
        Специальности
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/admin/umks')}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          flex: 1,
          minWidth: '200px',
          px: 3,
          py: 1
        }}
      >
        УМК
      </Button>
    </Box>
  );
};

export default AdminNavigation;