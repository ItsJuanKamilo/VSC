import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, Avatar, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useNavigationContext } from '../../context/NavigationContext';
import { deliveryService } from '../../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../../services/deliveryService';
import { realtimeService } from '../../services/realtimeService';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userType, currentUser } = useNavigationContext();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook para notificaciones en tiempo real
  const { showNotification, getNotificationMessage } = useRealtimeNotifications(userType);

  const loadData = async () => {
    try {
      console.log('🔄 Cargando datos del usuario:', currentUser?.id);
      
      // Cargar estadísticas
      const statsResult = await deliveryService.getUserStats(currentUser?.id, userType);
      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      // Cargar envíos recientes
      let deliveriesResult;
      if (userType === 'client') {
        deliveriesResult = await deliveryService.getClientDeliveries(currentUser?.id);
      } else {
        deliveriesResult = await deliveryService.getDriverDeliveries(currentUser?.id);
      }

      if (deliveriesResult.success) {
        setRecentDeliveries(deliveriesResult.deliveries.slice(0, 3)); // Solo los 3 más recientes
      }

      // Cargar envíos disponibles para transportistas
      if (userType === 'driver') {
        const availableResult = await deliveryService.getAvailableDeliveries();
        if (availableResult.success) {
          setAvailableDeliveries(availableResult.deliveries.slice(0, 3)); // Solo los 3 más recientes
        }
      }

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadData();
    }
  }, [currentUser?.id, userType]);

  // Recargar datos cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser?.id) {
        console.log('🎯 Pantalla Home enfocada, recargando datos...');
        loadData();
      }
    }, [currentUser?.id, userType])
  );

  // Suscripción a actualizaciones en tiempo real
  useEffect(() => {
    if (!currentUser?.id || !userType) return;

    console.log('📡 Configurando suscripción en tiempo real para:', currentUser.id, userType);

    const subscriptionKey = realtimeService.subscribeToDeliveries(
      currentUser.id,
      userType,
      (payload) => {
        console.log('🔄 Actualización recibida:', payload);
        
        // Recargar datos automáticamente cuando hay cambios
        loadData();
        
        // Mostrar notificación inteligente
        const notification = getNotificationMessage(payload, userType);
        if (notification) {
          showNotification(notification.title, notification.message, notification.type);
        }
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      console.log('🔌 Limpiando suscripción:', subscriptionKey);
      realtimeService.unsubscribeFromDeliveries(currentUser.id, userType);
    };
  }, [currentUser?.id, userType]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Handlers de navegación
  const handleCreateDelivery = () => {
    navigation.navigate('CreateDelivery');
  };

  const handleViewAllDeliveries = () => {
    navigation.navigate('Deliveries');
  };

  const handleViewAvailableDeliveries = () => {
    navigation.navigate('AvailableDeliveries');
  };

  // Handlers de acciones
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      console.log('🚚 Aceptando envío:', deliveryId);
      
      const result = await deliveryService.acceptDelivery(deliveryId, currentUser.id);
      
      if (result.success) {
        console.log('✅ Envío aceptado exitosamente');
        alert('¡Envío aceptado exitosamente!');
        loadData(); // Recargar lista
      } else {
        console.log('❌ Error aceptando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleAcceptDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleStartDelivery = async (deliveryId) => {
    try {
      console.log('🚚 Marcando envío en camino:', deliveryId);
      
      const result = await deliveryService.startDelivery(deliveryId);
      
      if (result.success) {
        console.log('✅ Envío marcado en camino exitosamente');
        alert('¡Envío marcado en camino!');
        
        // Navegar a la pantalla de navegación
        navigation.navigate('Navigation', { deliveryId });
      } else {
        console.log('❌ Error marcando envío en camino:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleStartDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      console.log('✅ Completando envío:', deliveryId);
      
      const result = await deliveryService.completeDelivery(deliveryId);
      
      if (result.success) {
        console.log('✅ Envío completado exitosamente');
        alert('¡Envío completado exitosamente!');
        loadData(); // Recargar lista
      } else {
        console.log('❌ Error completando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleCompleteDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleCancelDelivery = async (deliveryId) => {
    try {
      console.log('❌ Cancelando envío:', deliveryId);
      
      const result = await deliveryService.cancelDelivery(deliveryId);
      
      if (result.success) {
        console.log('✅ Envío cancelado exitosamente');
        alert('¡Envío cancelado! Vuelve a estar disponible para otros transportistas.');
        loadData(); // Recargar lista
      } else {
        console.log('❌ Error cancelando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleCancelDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleConfirmDelivery = async (deliveryId) => {
    try {
      console.log('📦 Confirmando recepción:', deliveryId);
      
      const result = await deliveryService.confirmDelivery(deliveryId);
      
      if (result.success) {
        console.log('✅ Recepción confirmada exitosamente');
        alert('¡Recepción confirmada exitosamente!');
        loadData(); // Recargar lista
      } else {
        console.log('❌ Error confirmando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleConfirmDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const renderActionButtons = (delivery) => {
    if (userType === 'driver') {
      // Motociclistas pueden cambiar el estado de sus envíos
      switch (delivery.status) {
        case 'accepted':
          return (
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => handleStartDelivery(delivery.id)}
                style={styles.startButton}
                labelStyle={styles.buttonLabel}
              >
                En Camino
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleCancelDelivery(delivery.id)}
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
                textColor="#dc3545"
              >
                Cancelar
              </Button>
            </View>
          );
        
        case 'in_transit':
          return (
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => handleCompleteDelivery(delivery.id)}
                style={styles.completeButton}
                labelStyle={styles.buttonLabel}
              >
                Completar
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleCancelDelivery(delivery.id)}
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
                textColor="#dc3545"
              >
                Cancelar
              </Button>
            </View>
          );
        
        default:
          return null;
      }
    } else if (userType === 'client' && delivery.status === 'completed') {
      // Clientes solo pueden confirmar envíos completados
      return (
        <Button
          mode="contained"
          onPress={() => handleConfirmDelivery(delivery.id)}
          style={styles.confirmButton}
          labelStyle={styles.buttonLabel}
        >
          Confirmar Recepción
        </Button>
      );
    }
    return null;
  };

  const renderAvailableDeliveries = () => {
    if (userType !== 'driver' || !availableDeliveries.length) return null;

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Envíos Disponibles</Text>
            <Button
              mode="text"
              onPress={handleViewAvailableDeliveries}
              textColor="#667eea"
              compact
            >
              Ver Todos
            </Button>
          </View>

          {availableDeliveries.map((delivery, index) => (
            <View key={delivery.id}>
              <Card style={styles.deliveryCard}>
                <Card.Content>
                  <View style={styles.deliveryHeader}>
                    <Text style={styles.deliveryRoute}>
                      {delivery.origin} → {delivery.destination}
                    </Text>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(delivery.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(delivery.status) }]}
                    >
                      {getStatusText(delivery.status)}
                    </Chip>
                  </View>

                  <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryDate}>
                      Creado: {new Date(delivery.created_at).toLocaleDateString()}
                    </Text>
                    
                    {delivery.description && (
                      <Text style={styles.deliveryDescription}>
                        {delivery.description}
                      </Text>
                    )}

                    <View style={styles.deliveryDetails}>
                      <Chip
                        mode="outlined"
                        textStyle={{ color: getUrgencyColor(delivery.urgency_level) }}
                        style={[styles.urgencyChip, { borderColor: getUrgencyColor(delivery.urgency_level) }]}
                      >
                        {getUrgencyText(delivery.urgency_level)}
                      </Chip>

                      {delivery.price > 0 && (
                        <Text style={styles.deliveryPrice}>
                          ${delivery.price.toLocaleString()}
                        </Text>
                      )}
                    </View>

                    {delivery.client && (
                      <Text style={styles.clientInfo}>
                        Cliente: {delivery.client.name}
                      </Text>
                    )}
                  </View>

                  <Button
                    mode="contained"
                    onPress={() => handleAcceptDelivery(delivery.id)}
                    style={styles.acceptButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Aceptar Envío
                  </Button>
                </Card.Content>
              </Card>
              {index < availableDeliveries.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderMyDeliveries = () => {
    if (!recentDeliveries.length) {
      return (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {userType === 'client' ? 'Mis Envíos' : 'Mis Entregas'}
              </Text>
              <Button
                mode="text"
                onPress={handleViewAllDeliveries}
                textColor="#667eea"
                compact
              >
                Ver Todos
              </Button>
            </View>
            <Text style={styles.emptyText}>
              {userType === 'client' 
                ? 'No tienes envíos aún. ¡Crea tu primer envío!'
                : 'No tienes entregas asignadas aún.'
              }
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {userType === 'client' ? 'Mis Envíos' : 'Mis Entregas'}
            </Text>
            <Button
              mode="text"
              onPress={handleViewAllDeliveries}
              textColor="#667eea"
              compact
            >
              Ver Todos
            </Button>
          </View>

          {recentDeliveries.map((delivery, index) => (
            <View key={delivery.id}>
              <Card style={styles.deliveryCard}>
                <Card.Content>
                  <View style={styles.deliveryHeader}>
                    <Text style={styles.deliveryRoute}>
                      {delivery.origin} → {delivery.destination}
                    </Text>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(delivery.status) }}
                      style={[styles.statusChip, { borderColor: getStatusColor(delivery.status) }]}
                    >
                      {getStatusText(delivery.status)}
                    </Chip>
                  </View>

                  <View style={styles.deliveryInfo}>
                    <Text style={styles.deliveryDate}>
                      Creado: {new Date(delivery.created_at).toLocaleDateString()}
                    </Text>
                    
                    {delivery.description && (
                      <Text style={styles.deliveryDescription}>
                        {delivery.description}
                      </Text>
                    )}

                    <View style={styles.deliveryDetails}>
                      <Chip
                        mode="outlined"
                        textStyle={{ color: getUrgencyColor(delivery.urgency_level) }}
                        style={[styles.urgencyChip, { borderColor: getUrgencyColor(delivery.urgency_level) }]}
                      >
                        {getUrgencyText(delivery.urgency_level)}
                      </Chip>

                      {delivery.price > 0 && (
                        <Text style={styles.deliveryPrice}>
                          ${delivery.price.toLocaleString()}
                        </Text>
                      )}
                    </View>

                    {userType === 'driver' && delivery.client && (
                      <Text style={styles.clientInfo}>
                        Cliente: {delivery.client.name}
                      </Text>
                    )}

                    {userType === 'client' && delivery.driver && (
                      <Text style={styles.driverInfo}>
                        Motociclista: {delivery.driver.name}
                      </Text>
                    )}
                  </View>

                  {renderActionButtons(delivery)}
                </Card.Content>
              </Card>
              {index < recentDeliveries.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerSection}>
            <Avatar.Text 
              size={50} 
              label={currentUser?.name?.charAt(0)?.toUpperCase() || 'U'} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>
                {new Date().getHours() < 12 ? 'Buenos días' : 
                 new Date().getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'}
              </Text>
              <Text style={styles.userName}>{currentUser?.name || 'Usuario'}</Text>
              <Text style={styles.userType}>
                {userType === 'client' ? 'Cliente' : 'Transportista'}
              </Text>
            </View>
          </View>
          
          {stats && (
            <View style={styles.statsContainer}>
              {userType === 'client' ? (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.totalDeliveries || 0}</Text>
                    <Text style={styles.statLabel}>Envíos Totales</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.pendingDeliveries || 0}</Text>
                    <Text style={styles.statLabel}>Pendientes</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.completedDeliveries || 0}</Text>
                    <Text style={styles.statLabel}>Completados</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.totalDeliveries || 0}</Text>
                    <Text style={styles.statLabel}>Entregas Totales</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>${(stats.availableEarnings || 0).toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Ganancias Disponibles</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>${(stats.pendingEarnings || 0).toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Ganancias Pendientes</Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {userType === 'client' && (
          <View style={styles.createButtonContainer}>
            <Button
              mode="contained"
              onPress={handleCreateDelivery}
              style={styles.createButton}
              icon="plus"
            >
              Crear Nuevo Envío
            </Button>
          </View>
        )}

        {renderAvailableDeliveries()}
        {renderMyDeliveries()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  userType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  createButtonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    elevation: 4,
  },
  sectionCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  deliveryRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  deliveryInfo: {
    marginBottom: 15,
  },
  deliveryDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  deliveryDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  deliveryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  urgencyChip: {
    alignSelf: 'flex-start',
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  clientInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  driverInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  buttonLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#fd7e14',
    borderRadius: 6,
    marginRight: 4,
    minHeight: 40,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#28a745',
    borderRadius: 6,
    marginRight: 4,
    minHeight: 40,
  },
  acceptButton: {
    backgroundColor: '#17a2b8',
    borderRadius: 6,
    marginTop: 10,
    minHeight: 40,
  },
  confirmButton: {
    backgroundColor: '#6f42c1',
    borderRadius: 6,
    marginTop: 10,
    minHeight: 40,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#dc3545',
    borderWidth: 1,
    borderRadius: 6,
    marginLeft: 4,
    minHeight: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  divider: {
    marginVertical: 10,
  },
});

export default HomeScreen; 