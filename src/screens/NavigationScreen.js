import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNavigationContext } from '../context/NavigationContext';
import { deliveryService } from '../services/deliveryService';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';
import { supabase } from '../config/supabase';

const { width, height } = Dimensions.get('window');

const NavigationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useNavigationContext();
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const deliveryId = route.params?.deliveryId;

  useEffect(() => {
    if (deliveryId) {
      loadDeliveryDetails();
    }
  }, [deliveryId]);

  const loadDeliveryDetails = async () => {
    try {
      console.log('🗺️ Cargando detalles del envío para navegación:', deliveryId);
      
      // Obtener detalles del envío
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          client:users!deliveries_client_id_fkey(name, email, phone)
        `)
        .eq('id', deliveryId)
        .single();

      if (error) {
        console.error('❌ Error cargando envío:', error);
        alert('Error cargando detalles del envío');
        return;
      }

      setDelivery(data);
    } catch (error) {
      console.error('❌ Error en loadDeliveryDetails:', error);
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      console.log('✅ Completando envío desde navegación:', deliveryId);
      
      const result = await deliveryService.completeDelivery(deliveryId);
      
      if (result.success) {
        console.log('✅ Envío completado exitosamente');
        alert('¡Envío completado exitosamente!');
        navigation.goBack();
      } else {
        console.log('❌ Error completando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleCompleteDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleCancelDelivery = async () => {
    try {
      console.log('❌ Cancelando envío desde navegación:', deliveryId);
      
      const result = await deliveryService.cancelDelivery(deliveryId);
      
      if (result.success) {
        console.log('✅ Envío cancelado exitosamente');
        alert('¡Envío cancelado! Vuelve a estar disponible para otros transportistas.');
        navigation.goBack();
      } else {
        console.log('❌ Error cancelando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleCancelDelivery:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const renderMapPlaceholder = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <IconButton
          icon="map"
          size={80}
          iconColor="#667eea"
          style={styles.mapIcon}
        />
        <Text style={styles.mapTitle}>Navegación Activa</Text>
        <Text style={styles.mapSubtitle}>
          {delivery?.origin} → {delivery?.destination}
        </Text>
        
        {/* Tiempo estimado */}
        <View style={styles.estimatedTimeContainer}>
          <IconButton icon="clock" size={24} iconColor="#667eea" />
          <Text style={styles.estimatedTimeText}>
            Tiempo estimado: 15-25 min
          </Text>
        </View>
        
        {/* Indicadores de ruta */}
        <View style={styles.routeIndicators}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#28a745' }]} />
            <Text style={styles.routeText}>Origen</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#dc3545' }]} />
            <Text style={styles.routeText}>Destino</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDeliveryInfo = () => (
    <Card style={styles.infoCard}>
      <Card.Content>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>Detalles del Envío</Text>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(delivery?.status), fontSize: 12 }}
            style={[styles.statusChip, { borderColor: getStatusColor(delivery?.status) }]}
          >
            {getStatusText(delivery?.status)}
          </Chip>
        </View>

        {/* Ruta principal */}
        <View style={styles.mainRouteContainer}>
          <View style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <IconButton icon="map-marker" size={24} iconColor="#28a745" />
              <Text style={styles.routeTitle}>Origen</Text>
            </View>
            <Text style={styles.routeAddress}>{delivery?.origin}</Text>
          </View>
          
          <View style={styles.routeArrow}>
            <IconButton icon="arrow-down" size={24} iconColor="#667eea" />
          </View>
          
          <View style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <IconButton icon="map-marker-check" size={24} iconColor="#dc3545" />
              <Text style={styles.routeTitle}>Destino</Text>
            </View>
            <Text style={styles.routeAddress}>{delivery?.destination}</Text>
          </View>
        </View>

        {delivery?.client && (
          <View style={styles.clientInfo}>
            <Text style={styles.clientLabel}>Cliente</Text>
            <Text style={styles.clientName}>{delivery.client.name}</Text>
            {delivery.client.phone && (
              <Text style={styles.clientPhone}>{delivery.client.phone}</Text>
            )}
          </View>
        )}

        {delivery?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Descripción</Text>
            <Text style={styles.descriptionText}>{delivery.description}</Text>
          </View>
        )}

        <View style={styles.deliveryDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Precio</Text>
            <Text style={styles.detailValue}>${delivery?.price?.toLocaleString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Urgencia</Text>
            <Chip
              mode="outlined"
              textStyle={{ color: getUrgencyColor(delivery?.urgency_level), fontSize: 10 }}
              style={[styles.urgencyChip, { borderColor: getUrgencyColor(delivery?.urgency_level) }]}
            >
              {getUrgencyText(delivery?.urgency_level)}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <Button
        mode="contained"
        onPress={handleCompleteDelivery}
        style={styles.completeButton}
        contentStyle={styles.buttonContent}
        icon="check-circle"
      >
        Completar Entrega
      </Button>
      <Button
        mode="outlined"
        onPress={handleCancelDelivery}
        style={styles.cancelButton}
        contentStyle={styles.buttonContent}
        textColor="#dc3545"
        icon="close-circle"
      >
        Cancelar Envío
      </Button>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="white"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerTitle}>Navegación</Text>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando navegación...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="white"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Navegación</Text>
          <IconButton
            icon="navigation"
            size={24}
            iconColor="white"
          />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderMapPlaceholder()}
        {renderDeliveryInfo()}
        {renderActionButtons()}
      </ScrollView>
    </View>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  mapContainer: {
    height: height * 0.35,
    backgroundColor: '#e8f4fd',
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapIcon: {
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mapSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  estimatedTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  routeIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routePoint: {
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  routeLine: {
    width: 60,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
  },
  routeText: {
    fontSize: 12,
    color: '#666',
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  mainRouteContainer: {
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  routeAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 34,
  },
  routeArrow: {
    alignItems: 'center',
    marginVertical: 5,
  },
  clientInfo: {
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clientLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clientPhone: {
    fontSize: 14,
    color: '#667eea',
    marginTop: 2,
  },
  descriptionContainer: {
    marginBottom: 15,
  },
  descriptionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  deliveryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  urgencyChip: {
    alignSelf: 'flex-start',
  },
  actionContainer: {
    padding: 20,
    paddingTop: 0,
  },
  completeButton: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
  },
  cancelButton: {
    borderColor: '#dc3545',
    borderWidth: 2,
    borderRadius: 10,
  },
  buttonContent: {
    height: 50,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
}); 