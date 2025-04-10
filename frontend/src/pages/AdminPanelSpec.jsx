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
import CreateSpecModal from '../components/CreateSpecModal';
import CreateSpecForm from '../components/CreateSpecForm';
import AdminNavigation from '../components/AdminNavigation';

const AdminPanelSpec = () => {
  const {
    specs = [],
    specsLoading,
    specsError,
    totalPages = 1,
    currentPage = 1,
    fetchSpecsAdmin,
    deleteSpec
  } = useCabinetStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 4;

  useEffect(() => {
    fetchSpecsAdmin(currentPage, limit);
  }, [currentPage, fetchSpecsAdmin, limit]);

  const handlePageChange = (_, value) => {
    fetchSpecsAdmin(value, limit);
  };

  const handleDeleteClick = (spec) => {
    setSelectedSpec(spec);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (selectedSpec) {
        await deleteSpec(selectedSpec._id);
        fetchSpecsAdmin(currentPage, limit);
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedSpec(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      
            <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedSpec?.name}
        type="специальность"
        isLoading={isDeleting}
      />


      <CreateSpecModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSpecCreated={() => {
          setCreateModalOpen(false);
          fetchSpecsAdmin(currentPage, limit);
        }}
        formComponent={<CreateSpecForm onSpecCreated={() => setCreateModalOpen(false)} />}
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
            Новая специальность
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          {specsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {specsError}
            </Alert>
          )}

          {specsLoading ? (
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
                      <TableCell sx={{ fontWeight: 600 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {specs.length > 0 ? (
                      specs.map((spec) => (
                        <TableRow key={spec._id} hover>
                          <TableCell>{spec.name}</TableCell>
                          <TableCell>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteClick(spec)}
                              disabled={isDeleting}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Нет данных о специальностей
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

export default AdminPanelSpec;