import { Dialog, DialogTitle, DialogContent, Box, DialogActions, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const CreateUserModal = ({ 
    open, 
    onClose, 
    onUserCreated,
    loading,
    error,
    formComponent
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
          Создание нового пользователя
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {formComponent}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          p: 3,
          gap: 2
        }}>
          <Button 
            type="submit"
            form="create-user-form"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={<AddIcon/>}
            sx={{
                minWidth: '300px',
              borderRadius: '8px',
              px: 3
            }}
          >
            {loading ? (
              <CircularProgress 
                size={24} 
                sx={{ color: 'white' }} 
              />
            ) : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default CreateUserModal;