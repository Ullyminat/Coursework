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
    cabinets = [],
    cabinetsLoading,
    cabinetsError,
    totalCabinets = 0,
    currentPage = 1,
    totalPages = 1,
    fetchCabinetsAdmin,
    deleteCabinet
  } = useCabinetStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 4;

  // Отладочные логи
  useEffect(() => {
    console.log('Состояние кабинетов:', {
      cabinets,
      currentPage,
      totalPages,
      totalCabinets,
      loading: cabinetsLoading,
      error: cabinetsError
    });
  }, [cabinets, currentPage, totalPages, cabinetsLoading, cabinetsError]);

  // Загрузка данных при монтировании и изменении страницы
  useEffect(() => {
    fetchCabinetsAdmin(currentPage, limit);
  }, [currentPage, fetchCabinetsAdmin, limit]);

  const handlePageChange = (_, value) => {
    fetchCabinetsAdmin(value, limit);
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
        
        // Пересчет общего количества страниц после удаления
        const newTotal = totalCabinets - 1;
        const newTotalPages = Math.ceil(newTotal / limit);
        
        if (cabinets.length === 1) {
          // Если удалили последний элемент на странице
          if (currentPage > 1) {
            fetchCabinetsAdmin(currentPage - 1, limit);
          } else {
            fetchCabinetsAdmin(1, limit);
          }
        } else if (currentPage > newTotalPages) {
          // Если текущая страница стала больше общего количества страниц
          fetchCabinetsAdmin(newTotalPages, limit);
        } else {
          // Просто обновляем текущую страницу
          fetchCabinetsAdmin(currentPage, limit);
        }
      }
    } catch (error) {
      console.error('Ошибка при удалении кабинета:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      
            <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCabinet?.cabinet}
        type="кабинет"
        isLoading={isDeleting}
      />

      <CreateCabinetModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCabinetCreated={() => {
          setCreateModalOpen(false);
          fetchCabinetsAdmin(currentPage, limit);
        }}
        formComponent={<CreateCabinetForm onCabinetCreated={() => setCreateModalOpen(false)} />}
      />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
          <AdminNavigation />
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
                      <TableCell sx={{ fontWeight: 600 }}>№ Кабинета</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Год</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Площадь (м²)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cabinets.length > 0 ? (
                      cabinets.map((cabinet) => (
                        <TableRow key={cabinet._id} hover>
                          <TableCell>{cabinet.cabinet}</TableCell>
                          <TableCell>{cabinet.name}</TableCell>
                          <TableCell>{cabinet.year}</TableCell>
                          <TableCell>{cabinet.S}</TableCell>
                          <TableCell>
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
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
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
                    siblingCount={1}
                    boundaryCount={1}
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