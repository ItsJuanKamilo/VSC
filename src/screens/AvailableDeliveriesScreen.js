import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, List, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useNavigationContext } from '../context/NavigationContext';
import { deliveryService } from '../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';
import { realtimeService } from '../services/realtimeService';

const AvailableDeliveriesScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useNavigationContext();
  const [refreshing, setRefreshing] = useState(false);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAvailableDeliveries = async () => {
    try {
      console.log('🚚 Cargando envíos disponibles...');
      
      const result = await deliveryService.getAvailableDeliveries();
      
      console.log('🔍 Resultado de getAvailableDeliveries:', result);
      
      if (result.success) {
        console.log('✅ Envíos cargados exitosamente:', result.deliveries.length);
        setAvailableDeliveries(result.deliveries);
      } else {
        console.error('❌ Error cargando envíos disponibles:', result.error);
        alert('Error cargando envíos: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en loadAvailableDeliveries:', error);
      alert('Error de conexión: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadAvailableDeliveries();
    }
  }, [currentUser?.id]);

  // Suscripción a actualizaciones en tiempo real para envíos disponibles
  useEffect(() => {
    if (!currentUser?.id) return;

    console.log('📡 Configurando suscripción en tiempo real (Available):', currentUser.id);

    const subscriptionKey = realtimeService.subscribeToDeliveries(
      currentUser.id,
      'driver',
      (payload) => {
        console.log('🔄 Actualización recibida (Available):', payload);
        
        // Solo recargar si es un cambio en envíos disponibles
        if (payload.new?.status === 'pending' || payload.old?.status === 'pending') {
          loadAvailableDeliveries();
        }
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      console.log('🔌 Limpiando suscripción (Available):', subscriptionKey);
      realtimeService.unsubscribeFromDeliveries(currentUser.id, 'driver');
    };
  }, [currentUser?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAvailableDeliveries();
    setRefreshing(false);
  };

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      console.log('🚚 Aceptando envío:', deliveryId);
      
      const result = await deliveryService.acceptDelivery(deliveryId, currentUser.id);
      
      if (result.success) {
        console.log('✅ Envío aceptado exitosamente');
        alert('¡Envío aceptado exitosamente!');
        loadAvailableDeliveries(); // Recargar lista
      } else {
        console.log('❌ Error aceptando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleAcceptDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return '#dc3545';
      case 'normal': return '#28a745';
      case 'scheduled': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'Urgente';
      case 'normal': return 'Normal';
      case 'scheduled': return 'Programado';
      default: return 'Normal';
    }
  };

  const renderDeliveryItem = (delivery, index) => (
    <Card key={delivery.id} style={styles.deliveryCard}>
      <Card.Content>
        <View style={styles.deliveryHeader}>
          <Text style={styles.deliveryRoute}>
            {delivery.origin} → {delivery.destination}
          </Text>
          <Chip
            mode="outlined"
            textStyle={{ color: '#17a2b8' }}
            style={[styles.statusChip, { borderColor: '#17a2b8' }]}
          >
            Disponible
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
          icon="check"
        >
          Aceptar Envío
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            textColor="white"
          >
            Volver
          </Button>
          <Text style={styles.headerTitle}>Envíos Disponibles</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {availableDeliveries.length} envíos disponibles
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
              <Text style={styles.loadingText}>Cargando envíos disponibles...</Text>
            </Card.Content>
          </Card>
        ) : availableDeliveries.length > 0 ? (
          availableDeliveries.map((delivery, index) => (
            <View key={delivery.id}>
              {renderDeliveryItem(delivery, index)}
              {index < availableDeliveries.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No hay envíos disponibles en este momento.
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default AvailableDeliveriesScreen;

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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  acceptButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#28a745',
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