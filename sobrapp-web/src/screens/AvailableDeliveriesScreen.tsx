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
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { deliveryService } from '../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';
import { Delivery } from '../types';
import { showErrorAlert, showSuccessAlert } from '../utils/errorHandler';

const mockAvailableDeliveries: Delivery[] = [
  {
    id: '1',
    client_id: 'client1',
    driver_id: null,
    origin: 'Centro Comercial Santafé',
    destination: 'Calle 85 #15-45',
    urgency: 'high',
    price: 25000,
    status: 'pending',
    description: 'Documentos importantes para firma',
    created_at: '2024-01-15T10:30:00Z',
    accepted_at: null,
    started_at: null,
    completed_at: null,
    client: {
      id: 'client1',
      name: 'María González',
      email: 'maria@example.com',
      user_type: 'client',
      created_at: '2024-01-01T00:00:00Z'
    },
    driver: null
  },
  {
    id: '2',
    client_id: 'client2',
    driver_id: null,
    origin: 'Avenida 68 #24-10',
    destination: 'Carrera 7 #26-20',
    urgency: 'normal',
    price: 18000,
    status: 'pending',
    description: 'Sobre con documentos legales',
    created_at: '2024-01-15T09:15:00Z',
    accepted_at: null,
    started_at: null,
    completed_at: null,
    client: {
      id: 'client2',
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      user_type: 'client',
      created_at: '2024-01-01T00:00:00Z'
    },
    driver: null
  }
];

const AvailableDeliveriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingDelivery, setAcceptingDelivery] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableDeliveries();
  }, []);

  const loadAvailableDeliveries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await deliveryService.getAvailableDeliveries();
      
      if (response.success) {
        setDeliveries(response.data || []);
      } else {
        // For now, use mock data
        setDeliveries(mockAvailableDeliveries);
        console.log('Using mock data for available deliveries');
      }
    } catch (error) {
      console.error('Error loading available deliveries:', error);
      // Fallback to mock data
      setDeliveries(mockAvailableDeliveries);
      console.log('Using mock data due to error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    setAcceptingDelivery(deliveryId);
    
    try {
      const response = await deliveryService.acceptDelivery(deliveryId);
      
      if (response.success) {
        showSuccessAlert('Entrega aceptada exitosamente');
        // Remove the accepted delivery from the list
        setDeliveries(prev => prev.filter(d => d.id !== deliveryId));
      } else {
        showErrorAlert(response.message || 'Error al aceptar la entrega');
      }
    } catch (error) {
      console.error('Error accepting delivery:', error);
      showErrorAlert('Error inesperado al aceptar la entrega');
    } finally {
      setAcceptingDelivery(null);
    }
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
            Entregas Disponibles
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
                No hay entregas disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No hay entregas pendientes en este momento. Intenta más tarde.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {deliveries.map((delivery, index) => (
              <Grid xs={12} md={6} lg={4} key={delivery.id}>
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
                        <Chip
                          label={getUrgencyText(delivery.urgency)}
                          size="small"
                          sx={{
                            backgroundColor: getUrgencyColor(delivery.urgency),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
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

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleAcceptDelivery(delivery.id)}
                        disabled={acceptingDelivery === delivery.id}
                        startIcon={
                          acceptingDelivery === delivery.id ? 
                          <CircularProgress size={20} /> : 
                          <LocalShippingIcon />
                        }
                        sx={{
                          backgroundColor: '#4caf50',
                          '&:hover': {
                            backgroundColor: '#45a049'
                          }
                        }}
                      >
                        {acceptingDelivery === delivery.id ? 'Aceptando...' : 'Aceptar Entrega'}
                      </Button>
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

export default AvailableDeliveriesScreen; 