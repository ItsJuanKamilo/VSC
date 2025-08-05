import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { deliveryService } from '../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';
import { Delivery } from '../types';

// Mock data para desarrollo
const mockDeliveries: Delivery[] = [
  {
    id: '1',
    client_id: '1',
    origin: 'Centro Comercial Galerías',
    destination: 'Oficinas Torre Empresarial',
    urgency_level: 'urgent',
    status: 'pending',
    price: 25000,
    description: 'Documentos importantes para firma',
    created_at: new Date().toISOString(),
    client: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', user_type: 'client', created_at: new Date().toISOString() }
  },
  {
    id: '2',
    client_id: '1',
    driver_id: '2',
    origin: 'Avenida Principal 123',
    destination: 'Calle Comercial 456',
    urgency_level: 'normal',
    status: 'in_transit',
    price: 18000,
    description: 'Paquete pequeño',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    client: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', user_type: 'client', created_at: new Date().toISOString() },
    driver: { id: '2', name: 'Carlos López', email: 'carlos@example.com', user_type: 'driver', created_at: new Date().toISOString() }
  },
  {
    id: '3',
    client_id: '1',
    driver_id: '2',
    origin: 'Plaza Mayor',
    destination: 'Residencial Los Pinos',
    urgency_level: 'scheduled',
    status: 'completed',
    price: 22000,
    description: 'Envío programado',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    client: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', user_type: 'client', created_at: new Date().toISOString() },
    driver: { id: '2', name: 'Carlos López', email: 'carlos@example.com', user_type: 'driver', created_at: new Date().toISOString() }
  }
];

const DeliveriesScreen: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userType = 'client'; // Mock user type

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDeliveries(mockDeliveries);
    } catch (error) {
      setError('Error al cargar los envíos');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      const result = await deliveryService.acceptDelivery(deliveryId, '1');
      if (result.success) {
        alert('¡Envío aceptado exitosamente!');
        loadDeliveries();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleStartDelivery = async (deliveryId: string) => {
    try {
      const result = await deliveryService.startDelivery(deliveryId);
      if (result.success) {
        alert('¡Envío marcado en camino!');
        loadDeliveries();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleCompleteDelivery = async (deliveryId: string) => {
    try {
      const result = await deliveryService.completeDelivery(deliveryId);
      if (result.success) {
        alert('¡Envío completado exitosamente!');
        loadDeliveries();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleCancelDelivery = async (deliveryId: string) => {
    try {
      const result = await deliveryService.cancelDelivery(deliveryId);
      if (result.success) {
        alert('¡Envío cancelado! Vuelve a estar disponible para otros transportistas.');
        loadDeliveries();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleConfirmDelivery = async (deliveryId: string) => {
    try {
      const result = await deliveryService.confirmDelivery(deliveryId);
      if (result.success) {
        alert('¡Recepción confirmada exitosamente!');
        loadDeliveries();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const renderActionButtons = (delivery: Delivery) => {
    if (userType === 'driver') {
      switch (delivery.status) {
        case 'accepted':
          return (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleStartDelivery(delivery.id)}
                sx={{ backgroundColor: '#fd7e14' }}
              >
                En Camino
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleCancelDelivery(delivery.id)}
                sx={{ borderColor: '#dc3545', color: '#dc3545' }}
              >
                Cancelar
              </Button>
            </Box>
          );
        
        case 'in_transit':
          return (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleCompleteDelivery(delivery.id)}
                sx={{ backgroundColor: '#28a745' }}
              >
                Completar
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleCancelDelivery(delivery.id)}
                sx={{ borderColor: '#dc3545', color: '#dc3545' }}
              >
                Cancelar
              </Button>
            </Box>
          );
        
        default:
          return null;
      }
    } else if (userType === 'client' && delivery.status === 'completed') {
      return (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleConfirmDelivery(delivery.id)}
          sx={{ backgroundColor: '#6f42c1', mt: 2 }}
        >
          Confirmar Recepción
        </Button>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              {userType === 'client' ? 'Mis Envíos' : 'Mis Entregas'}
            </Typography>
            
            {deliveries.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                  No hay envíos para mostrar
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {userType === 'client' 
                    ? 'Crea tu primer envío para comenzar'
                    : 'Acepta envíos disponibles para comenzar a trabajar'
                  }
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {deliveries.map((delivery) => (
                  <Grid item xs={12} md={6} lg={4} key={delivery.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
                              {delivery.origin} → {delivery.destination}
                            </Typography>
                            <Chip
                              label={getStatusText(delivery.status)}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(delivery.status),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>

                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {delivery.description}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Chip
                              label={getUrgencyText(delivery.urgency_level)}
                              size="small"
                              sx={{
                                backgroundColor: getUrgencyColor(delivery.urgency_level),
                                color: 'white'
                              }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#28a745' }}>
                              ${delivery.price.toLocaleString()}
                            </Typography>
                          </Box>

                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                            Creado: {new Date(delivery.created_at).toLocaleDateString()}
                          </Typography>

                          {userType === 'driver' && delivery.client && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                              Cliente: {delivery.client.name}
                            </Typography>
                          )}

                          {userType === 'client' && delivery.driver && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                              Motociclista: {delivery.driver.name}
                            </Typography>
                          )}

                          {renderActionButtons(delivery)}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default DeliveriesScreen; 