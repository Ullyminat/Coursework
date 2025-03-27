import React, { useEffect, useState } from 'react';
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
import DeleteModal from '../components/DeleteModal';
import CreateUserForm from '../components/CreateUserForm';

const AdminPanel = () => {
  const {
    users = [],
    totalUsers = 0,
    usersLoading,
    usersError,
    totalPages = 1,
    currentPage = 1,
    fetchUsers,
    changeUserRole,
    deleteUser
  } = useCabinetStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 2;

  useEffect(() => {
    fetchUsers(currentPage, limit);
  }, [currentPage, fetchUsers]);

  const handleUserCreated = () => {
    fetchUsers(currentPage, limit);
  };

  const handlePageChange = (_, value) => {
    fetchUsers(value, limit);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
    } catch (error) {
      console.error('Ошибка при изменении роли:', error);
      alert('Не удалось изменить роль пользователя');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (selectedUser) {
        await deleteUser(selectedUser._id);
        fetchUsers(currentPage, limit);
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Не удалось удалить пользователя');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={selectedUser ? `${selectedUser.surname} ${selectedUser.name}` : ''}
        isLoading={isDeleting}
      />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <CreateUserForm onUserCreated={handleUserCreated} />
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', backgroundColor: 'background.paper'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Управление пользователями
            </Typography>
          </Box>

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
                    {users?.length > 0 ? (
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
                              onClick={() => handleDeleteClick(user)}
                              color="error"
                              disabled={isDeleting}
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
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
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