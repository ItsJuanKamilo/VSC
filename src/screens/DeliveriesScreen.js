import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useNavigationContext } from '../context/NavigationContext';
import { deliveryService } from '../services/deliveryService';
import { realtimeService } from '../services/realtimeService';
import DeliveryCard from '../components/common/DeliveryCard';

const DeliveriesScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userType } = useNavigationContext();
  const [refreshing, setRefreshing] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeliveries = async () => {
    try {
      console.log('🔄 Cargando envíos para:', userType, currentUser?.id);
      
      let result;
      if (userType === 'client') {
        // Clientes ven solo sus propios envíos
        result = await deliveryService.getClientDeliveries(currentUser?.id);
      } else {
        // Motociclistas ven solo sus propios envíos (no los disponibles)
        result = await deliveryService.getDriverDeliveries(currentUser?.id);
      }

      if (result.success) {
        setDeliveries(result.deliveries);
      } else {
        console.error('❌ Error cargando envíos:', result.error);
      }
    } catch (error) {
      console.error('❌ Error en loadDeliveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadDeliveries();
    }
  }, [currentUser?.id, userType]);

  // Recargar datos cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser?.id) {
        console.log('🎯 Pantalla Deliveries enfocada, recargando datos...');
        loadDeliveries();
      }
    }, [currentUser?.id, userType])
  );

  // Suscripción a actualizaciones en tiempo real
  useEffect(() => {
    if (!currentUser?.id || !userType) return;

    console.log('📡 Configurando suscripción en tiempo real (Deliveries):', currentUser.id, userType);

    const subscriptionKey = realtimeService.subscribeToDeliveries(
      currentUser.id,
      userType,
      (payload) => {
        console.log('🔄 Actualización recibida (Deliveries):', payload);
        
        // Recargar datos automáticamente cuando hay cambios
        loadDeliveries();
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      console.log('🔌 Limpiando suscripción (Deliveries):', subscriptionKey);
      realtimeService.unsubscribeFromDeliveries(currentUser.id, userType);
    };
  }, [currentUser?.id, userType]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  };

  // Handlers de acciones
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      console.log('🚚 Aceptando envío:', deliveryId);
      
      const result = await deliveryService.acceptDelivery(deliveryId, currentUser.id);
      
      if (result.success) {
        console.log('✅ Envío aceptado exitosamente');
        alert('¡Envío aceptado exitosamente!');
        loadDeliveries(); // Recargar lista
      } else {
        console.log('❌ Error aceptando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleAcceptDelivery:', error);
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
        loadDeliveries(); // Recargar lista
      } else {
        console.log('❌ Error confirmando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleConfirmDelivery:', error);
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
        loadDeliveries(); // Recargar lista
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
        loadDeliveries(); // Recargar lista
      } else {
        console.log('❌ Error cancelando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleCancelDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          {userType === 'client' ? 'Mis Envíos' : 'Mis Entregas'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {deliveries.length} envíos encontrados
        </Text>
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
        {isLoading ? (
          <Card style={styles.loadingCard}>
            <Card.Content>
              <Text style={styles.loadingText}>Cargando envíos...</Text>
            </Card.Content>
          </Card>
        ) : deliveries.length > 0 ? (
          deliveries.map((delivery, index) => (
            <View key={delivery.id}>
              <DeliveryCard
                delivery={delivery}
                userType={userType}
                onAccept={handleAcceptDelivery}
                onStart={handleStartDelivery}
                onComplete={handleCompleteDelivery}
                onCancel={handleCancelDelivery}
                onConfirm={handleConfirmDelivery}
                showActions={true}
              />
              {index < deliveries.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                {userType === 'client' 
                  ? 'No tienes envíos aún. ¡Crea tu primer envío desde el Home!'
                  : 'No tienes entregas asignadas aún.'
                }
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default DeliveriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  emptyCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 10,
  },
}); 