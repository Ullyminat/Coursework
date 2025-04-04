import React, { useEffect, useState } from 'react';
import {
  ThemeProvider, Container, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Button, Box,
  Pagination, Alert, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import useCabinetStore from '../store/store';
import Header from '../components/Header';
import theme from '../components/theme';
import DeleteModal from '../components/DeleteModal';
import CreateCabinetModal from '../components/CreateCabinetModal';
import CreateCabinetForm from '../components/CreateCabinetForm';
import AdminNavigation from '../components/AdminNavigation';

const AdminPanelCabinet = () => {
  const {
    allCabinets = [],
    cabinetsLoading,
    cabinetsError,
    totalPages = 1,
    currentPage = 1,
    fetchAllCabinets,
    deleteCabinet
  } = useCabinetStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchAllCabinets(currentPage, limit);
  }, [currentPage, fetchAllCabinets]);

  const handlePageChange = (_, value) => {
    fetchAllCabinets(value, limit);
  };

  const handleDeleteClick = (cabinet) => {
    setSelectedCabinet(cabinet);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (selectedCabinet) {
        await deleteCabinet(selectedCabinet._id);
        fetchAllCabinets(currentPage, limit);
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedCabinet(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCabinet?.name || 'кабинет'}
        isLoading={isDeleting}
      />

      <CreateCabinetModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCabinetCreated={() => {
          setCreateModalOpen(false);
          fetchAllCabinets(currentPage, limit);
        }}
        formComponent={<CreateCabinetForm onCabinetCreated={() => setCreateModalOpen(false)} />}
      />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3}}>
            <AdminNavigation/>
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
            Новый кабинет
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          {cabinetsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {cabinetsError}
            </Alert>
          )}

          {cabinetsLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Кабинет</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCabinets.length > 0 ? (
                      allCabinets.map((cabinet) => (
                        <TableRow key={cabinet._id} hover>
                          <TableCell>{cabinet.cabinet}</TableCell>
                          <TableCell>{cabinet.name}</TableCell>
                          <TableCell>
                            <IconButton color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteClick(cabinet)}
                              disabled={isDeleting}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Нет данных о кабинетах
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
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

export default AdminPanelCabinet;