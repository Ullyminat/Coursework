import React, { useEffect, useState } from 'react';
import { 
  Container,
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  ListItemText,
  Checkbox,
  ThemeProvider
} from '@mui/material';
import useCabinetStore from '../store/store';
import theme from '../components/theme';
import Header from '../components/Header';

const Gendocx = () => {
  const {
    cabinets,
    umk,
    specs,
    schemas,
    fetchCabinets,
    fetchUMK,
    fetchSpecs,
    fetchUserSchemas,
    generateDocument,
    isLoading,
    error
  } = useCabinetStore();

  const [selectedCabinet, setSelectedCabinet] = useState('');
  const [selectedUmk, setSelectedUmk] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');

  useEffect(() => {
    fetchCabinets();
    fetchUMK();
    fetchSpecs();
    fetchUserSchemas();
  }, []);

  const handleGenerate = async () => {
    try {
      if (!selectedCabinet || selectedUmk.length === 0 || 
          selectedSpecs.length === 0 || !selectedSchema) {
        throw new Error('Заполните все обязательные поля');
      }

      const blob = await generateDocument({
        cabinetId: selectedCabinet,
        umkIds: selectedUmk,
        specIds: selectedSpecs,
        schemaId: selectedSchema
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cabinet-passport.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Generation error:', err);
    }
  };

  const isFormValid = () => {
    return selectedCabinet && selectedUmk.length > 0 && 
           selectedSpecs.length > 0 && selectedSchema;
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mt: 5 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Генератор паспорта кабинета
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Кабинет</InputLabel>
            <Select
              value={selectedCabinet}
              onChange={(e) => setSelectedCabinet(e.target.value)}
              label="Кабинет"
            >
              {cabinets.map((cabinet) => (
                <MenuItem key={cabinet._id} value={cabinet._id}>
                  {cabinet.name} (№{cabinet.cabinet})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>УМК</InputLabel>
            <Select
              multiple
              value={selectedUmk}
              onChange={(e) => setSelectedUmk(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={umk.find(u => u._id === value)?.name}
                      onDelete={() => setSelectedUmk(selected.filter(v => v !== value))}
                    />
                  ))}
                </Box>
              )}
            >
              {umk.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={selectedUmk.includes(item._id)} />
                  <ListItemText 
                    primary={item.name} 
                    secondary={`Год: ${item.year}`} 
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Спецификации</InputLabel>
            <Select
              multiple
              value={selectedSpecs}
              onChange={(e) => setSelectedSpecs(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={specs.find(s => s._id === value)?.name}
                      onDelete={() => setSelectedSpecs(selected.filter(v => v !== value))}
                    />
                  ))}
                </Box>
              )}
            >
              {specs.map((spec) => (
                <MenuItem key={spec._id} value={spec._id}>
                  <Checkbox checked={selectedSpecs.includes(spec._id)} />
                  <ListItemText primary={spec.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Схема помещения</InputLabel>
            <Select
              value={selectedSchema}
              onChange={(e) => setSelectedSchema(e.target.value)}
              label="Схема помещения"
            >
              {schemas.map((schema) => (
                <MenuItem key={schema._id} value={schema._id}>
                  {schema.image.split('/').pop()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleGenerate}
          disabled={!isFormValid() || isLoading}
          startIcon={isLoading ? <CircularProgress size={24} /> : null}
        >
          Сгенерировать документ
        </Button>
      </Paper>
    </Container>
    </ThemeProvider>
  );
};

export default Gendocx;