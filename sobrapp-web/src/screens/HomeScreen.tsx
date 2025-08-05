import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import { deliveryService } from '../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';
import { Delivery, UserStats } from '../types';

// Mock data para desarrollo
const mockUser = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@example.com',
  user_type: 'client' as const,
  created_at: new Date().toISOString()
};

const mockStats: UserStats = {
  totalDeliveries: 12,
  pendingDeliveries: 3,
  completedDeliveries: 9,
  availableEarnings: 45000,
  pendingEarnings: 15000
};

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    client_id: '1',
    driver_id: null,
    origin: 'Centro Comercial Galerías',
    destination: 'Oficinas Torre Empresarial',
    urgency: 'high',
    status: 'pending',
    price: 25000,
    description: 'Documentos importantes para firma',
    created_at: new Date().toISOString(),
    accepted_at: null,
    started_at: null,
    completed_at: null,
    client: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', user_type: 'client', created_at: new Date().toISOString() },
    driver: null
  },
  {
    id: '2',
    client_id: '1',
    driver_id: '2',
    origin: 'Avenida Principal 123',
    destination: 'Calle Comercial 456',
    urgency: 'normal',
    status: 'in_progress',
    price: 18000,
    description: 'Paquete pequeño',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    accepted_at: new Date(Date.now() - 3600000).toISOString(),
    started_at: new Date(Date.now() - 1800000).toISOString(),
    completed_at: null,
    client: { id: '1', name: 'Juan Pérez', email: 'juan@example.com', user_type: 'client', created_at: new Date().toISOString() },
    driver: { id: '2', name: 'Carlos López', email: 'carlos@example.com', user_type: 'driver', created_at: new Date().toISOString() }
  }
];

const HomeScreen: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userType = mockUser.user_type;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats(mockStats);
      setRecentDeliveries(mockDeliveries);
      setAvailableDeliveries(userType === 'driver' ? mockDeliveries.filter(d => d.status === 'pending') : []);
    } catch (error) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      const result = await deliveryService.acceptDelivery(deliveryId, mockUser.id);
      if (result.success) {
        alert('¡Envío aceptado exitosamente!');
        loadData();
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
        loadData();
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
        loadData();
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
        loadData();
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
        loadData();
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

      {/* Header con gradiente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 3,
            borderRadius: 3
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  mr: 3,
                  fontSize: 24
                }}
              >
                {mockUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {new Date().getHours() < 12 ? 'Buenos días' : 
                  new Date().getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'}, {mockUser.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {userType === 'client' ? 'Cliente' : 'Transportista'}
                </Typography>
              </Box>
            </Box>

            {stats && (
              <Grid container spacing={3}>
                {userType === 'client' ? (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.totalDeliveries}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Envíos Totales
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.pendingDeliveries}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Pendientes
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.completedDeliveries}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Completados
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.totalDeliveries}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Entregas Totales
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          ${stats.availableEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Ganancias Disponibles
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          ${stats.pendingEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Ganancias Pendientes
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Envíos disponibles para motociclistas */}
      {userType === 'driver' && availableDeliveries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Envíos Disponibles
              </Typography>
              <Grid container spacing={2}>
                {availableDeliveries.slice(0, 3).map((delivery) => (
                  <Grid item xs={12} md={4} key={delivery.id}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {delivery.origin} → {delivery.destination}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
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
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleAcceptDelivery(delivery.id)}
                        sx={{ backgroundColor: '#17a2b8' }}
                      >
                        Aceptar Envío
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mis envíos/entregas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {userType === 'client' ? 'Mis Envíos' : 'Mis Entregas'}
            </Typography>
            
            {recentDeliveries.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {userType === 'client' 
                    ? 'No tienes envíos aún. ¡Crea tu primer envío!'
                    : 'No tienes entregas asignadas aún.'
                  }
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {recentDeliveries.slice(0, 3).map((delivery) => (
                  <Grid item xs={12} md={4} key={delivery.id}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {delivery.origin} → {delivery.destination}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={getStatusText(delivery.status)}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(delivery.status),
                            color: 'white'
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#28a745' }}>
                          ${delivery.price.toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {delivery.description}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Creado: {new Date(delivery.created_at).toLocaleDateString()}
                      </Typography>

                      {userType === 'driver' && delivery.client && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
                          Cliente: {delivery.client.name}
                        </Typography>
                      )}

                      {userType === 'client' && delivery.driver && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
                          Motociclista: {delivery.driver.name}
                        </Typography>
                      )}

                      {renderActionButtons(delivery)}
                    </Card>
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

export default HomeScreen; 