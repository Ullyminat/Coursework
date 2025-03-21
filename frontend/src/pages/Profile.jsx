import { useEffect } from 'react';
import { 
  ThemeProvider, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress,
  Box,
  Alert,
  Avatar,
  Stack,
  Divider,
  Card,
  CardContent,
  CardActions,
  Skeleton
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import useCabinetStore from '../store/store';
import Header from '../components/Header';
import theme from '../components/theme';

const Profile = () => {
  const { 
    pasports, 
    isLoading, 
    error, 
    fetchPasports, 
    downloadPasport,
    currentUser,
    fetchCurrentUser,
    userLoading 
  } = useCabinetStore();

  useEffect(() => {
    fetchCurrentUser();
    fetchPasports();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', y: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ py: 4} }>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', backgroundColor: 'background.paper'}}>
          {/* Секция профиля */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80,
              bgcolor: 'primary.main',
              '& .MuiSvgIcon-root': { fontSize: 40 }
            }}>
            </Avatar>

            {userLoading ? (
              <Box sx={{ width: '100%' }}>
                <Skeleton width="60%" height={40} />
                <Skeleton width="40%" height={30} />
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ mb: 1 , fontWeight: 600 }}>
                  Добро пожаловать, {currentUser?.name || 'Пользователь'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Email: {currentUser?.email}
                </Typography>
              </Box>
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Секция документов */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Мои документы
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i} 
                  variant="rectangular" 
                  height={80} 
                  sx={{ borderRadius: 2 }} 
                />
              ))}
            </Stack>
          ) : (
            <Stack spacing={2}>
              {pasports.map((pasport) => (
                <Card 
                  key={pasport._id}
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <DocumentIcon 
                      sx={{ 
                        fontSize: 40, 
                        color: 'text.secondary', 
                        mr: 3 
                      }} 
                    />
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {pasport.file.replace('.docx', '')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Создан: {formatDate(pasport.created_at)}
                      </Typography>
                    </Box>

                    <CardActions>
                      <Button
                        startIcon={<DownloadIcon />}
                        variant="contained"
                        onClick={() => downloadPasport(pasport._id)}
                        size="small"
                        sx={{ 
                          px: 3,
                          textTransform: 'none'
                        }}
                      >
                        Скачать
                      </Button>
                    </CardActions>
                  </CardContent>
                </Card>
              ))}

              {pasports.length === 0 && !isLoading && (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Пока нет ни одного документа
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default Profile;