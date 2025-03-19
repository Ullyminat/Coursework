import theme from '../components/theme';
import Header from '../components/Header';
import { ThemeProvider, Container, Paper } from '@mui/material';

const Profile = () => {
    return(
        <ThemeProvider theme={theme}>
        <Header />
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mt: 5 }}>
                
            </Paper>
        </Container>
        </ThemeProvider>
    );
}
export default Profile;