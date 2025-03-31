import React, { useEffect, useState } from 'react';
import {ThemeProvider,Container,Paper,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,CircularProgress,Button,MenuItem,Select,Box,Pagination,Alert,IconButton} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import useCabinetStore from '../store/store';
import Header from '../components/Header';
import theme from '../components/theme';
import DeleteModal from '../components/DeleteModal';
import CreateUserModal from '../components/CreateUserModal';
import CreateUserForm from '../components/CreateUserForm';
import CreateCabinetModal from '../components/CreateCabinetModal';
import CreateCabinetForm from '../components/CreateCabinetForm';
import CreateSpecModal from '../components/CreateSpecModal';
import CreateSpecForm from '../components/CreateSpecForm';
import CreateUMKModal from '../components/CreateUMKModal';
import CreateUMKForm from '../components/CreateUMKForm';
import EditUserCabinetsModal from '../components/EditUserCabinetsModal';


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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createCabinetModalOpen, setCreateCabinetModalOpen] = useState(false);
  const [createSpecModalOpen, setCreateSpecModalOpen] = useState(false);
  const [createUMKModalOpen, setCreateUMKModalOpen] = useState(false);
  const [editCabinetsModalOpen, setEditCabinetsModalOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [selectedUserCabinets, setSelectedUserCabinets] = useState([]);
  const limit = 4;

  useEffect(() => {
    fetchUsers(currentPage, limit);
  }, [currentPage, fetchUsers]);

  const handleUserCreated = () => {
    setCreateModalOpen(false);
    fetchUsers(currentPage, limit);
  };

  const handleEditCabinetsClick = (user) => {
    setSelectedUserId(user._id);
    setSelectedUserCabinets(user.cabinets || []);
    setEditCabinetsModalOpen(true);
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
        const success = await deleteUser(selectedUser._id);
        if (success) {
          const updatedTotal = totalUsers - 1;
          const newTotalPages = Math.ceil(updatedTotal / limit);
          
          if (currentPage > newTotalPages) {
            await fetchUsers(newTotalPages, limit);
          } else {
            await fetchUsers(currentPage, limit);
          }
        }
      }
    } catch (error) {
      alert(`Ошибка при удалении: ${error}`);
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

      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
        formComponent={<CreateUserForm onUserCreated={handleUserCreated} />}
      />

      <CreateUMKModal
        open={createUMKModalOpen}
        onClose={() => setCreateUMKModalOpen(false)}
        onUMKCreated={() => {
          setCreateUMKModalOpen(false);
        }}
        formComponent={<CreateUMKForm onUMKCreated={() => setCreateUMKModalOpen(false)} />}
      />

      <EditUserCabinetsModal
        open={editCabinetsModalOpen}
        onClose={() => setEditCabinetsModalOpen(false)}
        userId={selectedUserId}
        currentCabinets={selectedUserCabinets}
      />

      <CreateSpecModal
        open={createSpecModalOpen}
        onClose={() => setCreateSpecModalOpen(false)}
        onSpecCreated={() => {
          setCreateSpecModalOpen(false);
        }}
        formComponent={<CreateSpecForm onSpecCreated={() => setCreateSpecModalOpen(false)} />}
      />

      <CreateCabinetModal
      open={createCabinetModalOpen}
      onClose={() => setCreateCabinetModalOpen(false)}
      onCabinetCreated={() => {
        setCreateCabinetModalOpen(false);
      }}
      formComponent={<CreateCabinetForm onCabinetCreated={() => setCreateCabinetModalOpen(false)} />}
    />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          mb: 3
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '100%',
              px: 3,
              py: 1
            }}
          >
            Новый пользователь
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateCabinetModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '32%',
              px: 3,
              py: 1
            }}
          >
            Новый кабинет
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateUMKModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '32%',
              px: 3,
              py: 1
            }}
          >
            Новый УМК
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateSpecModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              minWidth: '32%',
              px: 3,
              py: 1
            }}
          >
            Новая специализация
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Список пользователей
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
                      <TableCell sx={{ fontWeight: 600 }}>ФИО</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Роль</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>{`${user.surname} ${user.name} ${user.patronymic || ''}`}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              size="small"
                              sx={{ minWidth: 120 }}
                            >
                              <MenuItem value="user">Пользователь</MenuItem>
                              <MenuItem value="admin">Администратор</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                          <IconButton 
                            onClick={() => handleEditCabinetsClick(user)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
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
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Нет данных о пользователях
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalUsers > limit && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '8px'
                      }
                    }}
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