import { useEffect, useState } from 'react';
import {
  ThemeProvider,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  MenuItem,
  Select,
  Box,
  Pagination,
  Alert,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import useCabinetStore from '../store/store';
import Header from '../components/Header';
import theme from '../components/theme';

const AdminPanel = () => {
  const {
    users = [], // Добавляем значение по умолчанию
    totalUsers = 0,
    usersLoading,
    usersError,
    fetchUsers,
    changeUserRole,
    deleteUser
  } = useCabinetStore();

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
    } catch (error) {
      console.error('Ошибка при изменении роли:', error);
      alert('Не удалось изменить роль пользователя');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Не удалось удалить пользователя');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Управление пользователями
          </Typography>

          {usersError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {usersError}
            </Alert>
          )}

          {usersLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ФИО</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Роль</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.length > 0 ? ( // Добавляем проверку на наличие данных
                      users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{`${user.surname} ${user.name} ${user.patronymic}`}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              size="small"
                            >
                              <MenuItem value="user">Пользователь</MenuItem>
                              <MenuItem value="admin">Администратор</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              onClick={() => handleDelete(user._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Нет данных о пользователях
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalUsers > limit && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={Math.ceil(totalUsers / limit)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AdminPanel;