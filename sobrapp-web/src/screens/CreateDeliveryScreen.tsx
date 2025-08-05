import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Container, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  CircularProgress,
  Grid
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { deliveryService } from '../services/deliveryService';
import { URGENCY_LEVELS } from '../utils/constants';
import { showErrorAlert, showSuccessAlert, validateRequired, validatePrice } from '../utils/errorHandler';

const CreateDeliveryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    urgency: 'normal',
    price: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!validateRequired(formData.origin, 'Origen')) return false;
    if (!validateRequired(formData.destination, 'Destino')) return false;
    if (!validateRequired(formData.price, 'Precio')) return false;
    
    const price = parseFloat(formData.price);
    if (!validatePrice(price)) return false;
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const deliveryData = {
        origin: formData.origin,
        destination: formData.destination,
        urgency: formData.urgency,
        price: parseFloat(formData.price),
        description: formData.description || ''
      };

      const response = await deliveryService.createDelivery(deliveryData);
      
      if (response.success) {
        showSuccessAlert('Entrega creada exitosamente');
        navigate('/deliveries');
      } else {
        setError(response.message || 'Error al crear la entrega');
      }
    } catch (error) {
      console.error('Error creating delivery:', error);
      setError('Error inesperado al crear la entrega');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/deliveries')}
            sx={{ minWidth: 'auto' }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Crear Nueva Entrega
          </Typography>
        </Box>

        {/* Form Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Grid2 container spacing={3}>
              {/* Origin */}
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="Origen"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="Ingresa la dirección de origen"
                  variant="outlined"
                />
              </Grid2>

              {/* Destination */}
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="Destino"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="Ingresa la dirección de destino"
                  variant="outlined"
                />
              </Grid2>

              {/* Urgency */}
              <Grid2 xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgencia</InputLabel>
                  <Select
                    value={formData.urgency}
                    label="Urgencia"
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                  >
                    {Object.entries(URGENCY_LEVELS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>

              {/* Price */}
              <Grid2 xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio (COP)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid2>

              {/* Description */}
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="Descripción (opcional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe el contenido del sobre o detalles adicionales"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Submit Button */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/deliveries')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {loading ? 'Creando...' : 'Crear Entrega'}
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default CreateDeliveryScreen; 