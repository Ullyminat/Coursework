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
import CreateUMKModal from '../components/CreateUMKModal';
import CreateUMKForm from '../components/CreateUMKForm';
import AdminNavigation from '../components/AdminNavigation';

const AdminPanelUMK = () => {
  const {
    umks = [],
    umksLoading,
    umksError,
    totalPages = 1,
    currentPage = 1,
    fetchUMKs,
    deleteUMK
  } = useCabinetStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUMK, setSelectedUMK] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 4;

  useEffect(() => {
    fetchUMKs(currentPage, limit);
  }, [currentPage, fetchUMKs, limit]);

  const handlePageChange = (_, value) => {
    fetchUMKs(value, limit);
  };

  const handleDeleteClick = (umk) => {
    setSelectedUMK(umk);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (selectedUMK) {
        await deleteUMK(selectedUMK._id);
        fetchUMKs(currentPage, limit);
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedUMK(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      
            <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedUMK?.name}
        type="умк"
        isLoading={isDeleting}
      />

      <CreateUMKModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onUMKCreated={() => {
          setCreateModalOpen(false);
          fetchUMKs(currentPage, limit);
        }}
        formComponent={<CreateUMKForm onUMKCreated={() => setCreateModalOpen(false)} />}
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
            Новый УМК
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          {umksError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {umksError}
            </Alert>
          )}

          {umksLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Год</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {umks.length > 0 ? (
                      umks.map((umk) => (
                        <TableRow key={umk._id} hover>
                          <TableCell>{umk.name}</TableCell>
                          <TableCell>{umk.year}</TableCell>
                          <TableCell>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteClick(umk)}
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
                            Нет данных об УМК
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

export default AdminPanelUMK;