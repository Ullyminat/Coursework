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
import { ThemeProvider } from '@mui/material/styles';
import { CheckCircle, Edit, Description } from '@mui/icons-material';
import theme from '../components/theme';
import Header from '../components/Header';

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
    link: '/gendocx'
  },
  {
    title: 'Паспорт кабинета готов',
    description: 'Скачайте готовый документ (ОБЯЗАТЕЛЬНО проверьте документ)',
    icon: <CheckCircle />,
    action: 'Скачать WORD',
    link: '/profile'
  }
];

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header/>
      <Container component="main" maxWidth="md" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
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
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      width: 48,
                      height: 48
                    }}>
                      {index + 1}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: 'primary.main'
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
                        component={step.link ? Link : 'button'}
                        to={step.link}
                        variant="contained"
                        color="primary"
                        size="medium"
                        sx={{ 
                          mt: 2,
                          borderRadius: '8px',
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
                      top: '60px',
                      bottom: '20px',
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