import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Container, 
  CircularProgress, 
  Alert,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigationIcon from '@mui/icons-material/Navigation';
import { deliveryService } from '../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';
import { Delivery } from '../types';
import { showErrorAlert, showSuccessAlert } from '../utils/errorHandler';

const mockActiveDeliveries: Delivery[] = [
  {
    id: '1',
    client_id: 'client1',
    driver_id: 'driver1',
    origin: 'Centro Comercial Santafé',
    destination: 'Calle 85 #15-45',
    urgency: 'high',
    price: 25000,
    status: 'accepted',
    description: 'Documentos importantes para firma',
    created_at: '2024-01-15T10:30:00Z',
    accepted_at: '2024-01-15T10:35:00Z',
    started_at: null,
    completed_at: null,
    client: {
      id: 'client1',
      name: 'María González',
      email: 'maria@example.com',
      user_type: 'client',
      created_at: '2024-01-01T00:00:00Z'
    },
    driver: {
      id: 'driver1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      user_type: 'driver',
      created_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '2',
    client_id: 'client2',
    driver_id: 'driver1',
    origin: 'Avenida 68 #24-10',
    destination: 'Carrera 7 #26-20',
    urgency: 'normal',
    price: 18000,
    status: 'in_progress',
    description: 'Sobre con documentos legales',
    created_at: '2024-01-15T09:15:00Z',
    accepted_at: '2024-01-15T09:20:00Z',
    started_at: '2024-01-15T09:25:00Z',
    completed_at: null,
    client: {
      id: 'client2',
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      user_type: 'client',
      created_at: '2024-01-01T00:00:00Z'
    },
    driver: {
      id: 'driver1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      user_type: 'driver',
      created_at: '2024-01-01T00:00:00Z'
    }
  }
];

const NavigationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingDelivery, setProcessingDelivery] = useState<string | null>(null);

  useEffect(() => {
    loadActiveDeliveries();
  }, []);

  const loadActiveDeliveries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await deliveryService.getDriverDeliveries();
      
      if (response.success) {
        setDeliveries(response.data || []);
      } else {
        // For now, use mock data
        setDeliveries(mockActiveDeliveries);
        console.log('Using mock data for active deliveries');
      }
    } catch (error) {
      console.error('Error loading active deliveries:', error);
      // Fallback to mock data
      setDeliveries(mockActiveDeliveries);
      console.log('Using mock data due to error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDelivery = async (deliveryId: string) => {
    setProcessingDelivery(deliveryId);
    
    try {
      const response = await deliveryService.startDelivery(deliveryId);
      
      if (response.success) {
        showSuccessAlert('Entrega iniciada exitosamente');
        // Update the delivery status in the list
        setDeliveries(prev => prev.map(d => 
          d.id === deliveryId 
            ? { ...d, status: 'in_progress', started_at: new Date().toISOString() }
            : d
        ));
      } else {
        showErrorAlert(response.message || 'Error al iniciar la entrega');
      }
    } catch (error) {
      console.error('Error starting delivery:', error);
      showErrorAlert('Error inesperado al iniciar la entrega');
    } finally {
      setProcessingDelivery(null);
    }
  };

  const handleCompleteDelivery = async (deliveryId: string) => {
    setProcessingDelivery(deliveryId);
    
    try {
      const response = await deliveryService.completeDelivery(deliveryId);
      
      if (response.success) {
        showSuccessAlert('Entrega completada exitosamente');
        // Remove the completed delivery from the list
        setDeliveries(prev => prev.filter(d => d.id !== deliveryId));
      } else {
        showErrorAlert(response.message || 'Error al completar la entrega');
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
      showErrorAlert('Error inesperado al completar la entrega');
    } finally {
      setProcessingDelivery(null);
    }
  };

  const handleNavigateToDelivery = (delivery: Delivery) => {
    // In a real app, this would open Google Maps or another navigation app
    const destination = encodeURIComponent(delivery.destination);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <LocalShippingIcon />;
      case 'in_progress':
        return <PlayArrowIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      default:
        return <LocalShippingIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            onClick={() => navigate('/')}
            sx={{ minWidth: 'auto' }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Mis Entregas Activas
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Deliveries Grid */}
        {deliveries.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <LocalShippingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No tienes entregas activas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ve a "Entregas Disponibles" para aceptar nuevas entregas.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/available-deliveries')}
                startIcon={<LocalShippingIcon />}
              >
                Ver Entregas Disponibles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {deliveries.map((delivery, index) => (
              <Grid xs={12} md={6} key={delivery.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {delivery.client.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {delivery.client.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(delivery.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          <Chip
                            label={getUrgencyText(delivery.urgency)}
                            size="small"
                            sx={{
                              backgroundColor: getUrgencyColor(delivery.urgency),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Chip
                            label={getStatusText(delivery.status)}
                            size="small"
                            icon={getStatusIcon(delivery.status)}
                            sx={{
                              backgroundColor: getStatusColor(delivery.status),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Route */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Origen:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {delivery.origin}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Destino:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {delivery.destination}
                        </Typography>
                      </Box>

                      {/* Description */}
                      {delivery.description && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Descripción:
                          </Typography>
                          <Typography variant="body2">
                            {delivery.description}
                          </Typography>
                        </Box>
                      )}

                      {/* Price */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {formatPrice(delivery.price)}
                        </Typography>
                      </Box>

                      {/* Progress Bar for in_progress deliveries */}
                      {delivery.status === 'in_progress' && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Progreso de la entrega:
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={70} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            70% completado
                          </Typography>
                        </Box>
                      )}

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {delivery.status === 'accepted' && (
                          <Button
                            variant="contained"
                            onClick={() => handleStartDelivery(delivery.id)}
                            disabled={processingDelivery === delivery.id}
                            startIcon={
                              processingDelivery === delivery.id ? 
                              <CircularProgress size={20} /> : 
                              <PlayArrowIcon />
                            }
                            sx={{
                              backgroundColor: '#ff9800',
                              '&:hover': {
                                backgroundColor: '#f57c00'
                              }
                            }}
                          >
                            {processingDelivery === delivery.id ? 'Iniciando...' : 'Iniciar Entrega'}
                          </Button>
                        )}

                        {delivery.status === 'in_progress' && (
                          <>
                            <Button
                              variant="outlined"
                              onClick={() => handleNavigateToDelivery(delivery)}
                              startIcon={<NavigationIcon />}
                            >
                              Navegar
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => handleCompleteDelivery(delivery.id)}
                              disabled={processingDelivery === delivery.id}
                              startIcon={
                                processingDelivery === delivery.id ? 
                                <CircularProgress size={20} /> : 
                                <CheckCircleIcon />
                              }
                              sx={{
                                backgroundColor: '#4caf50',
                                '&:hover': {
                                  backgroundColor: '#45a049'
                                }
                              }}
                            >
                              {processingDelivery === delivery.id ? 'Completando...' : 'Completar Entrega'}
                            </Button>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default NavigationScreen; 