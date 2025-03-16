import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  CssBaseline,
  Paper,
  Divider
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'; // Импортируем ThemeProvider
import { CheckCircle, Edit, Description } from '@mui/icons-material';
import theme from '../components/theme'; // Импортируем тему

const steps = [
  {
    title: 'Создание схемы кабинета',
    description: 'Создайте подробную схему помещения с расстановкой мебели и оборудования',
    icon: <Edit />,
    action: 'Перейти к редактору',
    link: '/editor'
  },
  {
    title: 'Генерация паспорта кабинета',
    description: 'Сформируйте документ',
    icon: <Description />,
    action: 'Сгенерировать документ',
    link: ''
  },
  {
    title: 'Паспорт кабинета готов',
    description: 'Скачайте готовый документ (ОБЯЗАТЕЛЬНО проверьте документ)',
    icon: <CheckCircle />,
    action: 'Скачать',
    link: ''
  }
];

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Paper elevation={3} sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: '16px',
            backgroundColor: 'background.paper'
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Шаги создания паспорта кабинета:
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4,
              position: 'relative'
            }}>
              {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    gap: 3,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Avatar sx={{ 
                      bgcolor: index === 0 ? 'primary.main' : 'action.disabledBackground',
                      color: index === 0 ? 'primary.contrastText' : 'text.secondary',
                      width: 48,
                      height: 48
                    }}>
                      {index === 0 ? 1 : index === 1 ? 2 : 3}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: index === 0 ? 'primary.main' : 'text.primary'
                      }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        mt: 1,
                        color: 'text.secondary'
                      }}>
                        {step.description}
                      </Typography>
                      
                      <Button
                        component={index === 0 ? Link : 'button'}
                        to={step.link}
                        variant={index === 0 ? 'contained' : 'outlined'}
                        color="primary"
                        size="medium"
                        disabled={index !== 0}
                        sx={{ 
                          mt: 2,
                          borderRadius: '8px',
                          '&:disabled': {
                            borderColor: 'action.disabled',
                            color: 'text.disabled'
                          }
                        }}
                        startIcon={step.icon}
                      >
                        {step.action}
                      </Button>
                    </Box>
                  </Box>
                  
                  {index < steps.length - 1 && (
                    <Divider sx={{ 
                      position: 'absolute',
                      left: 24,
                      top: 48,
                      bottom: -32,
                      height: 'calc(100% - 64px)',
                      borderLeft: '2px dashed',
                      borderColor: 'divider',
                      zIndex: 0
                    }} />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;