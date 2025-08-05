import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, SegmentedButtons } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useNavigationContext } from '../context/NavigationContext';
import { deliveryService } from '../services/deliveryService';

const CreateDeliveryScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useNavigationContext();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!origin || !destination) {
      alert('Por favor, completa el origen y destino.');
      return;
    }

    setIsLoading(true);

    try {
      const deliveryData = {
        clientId: currentUser.id,
        origin: origin.trim(),
        destination: destination.trim(),
        urgencyLevel: urgencyLevel,
        description: description.trim(),
        price: parseFloat(price) || 0
      };

      console.log('📦 Creando envío:', deliveryData);

      const result = await deliveryService.createDelivery(deliveryData);

      if (result.success) {
        console.log('✅ Envío creado exitosamente');
        alert('¡Envío creado exitosamente!');
        navigation.goBack();
      } else {
        console.log('❌ Error creando envío:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      alert('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'urgent': return '#dc3545';
      case 'normal': return '#28a745';
      case 'scheduled': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getUrgencyText = (level) => {
    switch (level) {
      case 'urgent': return 'Urgente';
      case 'normal': return 'Normal';
      case 'scheduled': return 'Programado';
      default: return 'Normal';
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={handleBack}
          style={styles.backButton}
          textColor="white"
        >
          Volver
        </Button>
        <Text style={styles.headerTitle}>Nuevo Envío</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Información del Envío</Text>

              <TextInput
                label="Origen"
                value={origin}
                onChangeText={setOrigin}
                mode="outlined"
                style={styles.input}
                placeholder="Ej: Calle 123, Bogotá"
                left={<TextInput.Icon icon="map-marker" />}
              />

              <TextInput
                label="Destino"
                value={destination}
                onChangeText={setDestination}
                mode="outlined"
                style={styles.input}
                placeholder="Ej: Carrera 456, Medellín"
                left={<TextInput.Icon icon="map-marker-check" />}
              />

              <Text style={styles.sectionTitle}>Nivel de Urgencia</Text>
              <SegmentedButtons
                value={urgencyLevel}
                onValueChange={setUrgencyLevel}
                buttons={[
                  {
                    value: 'scheduled',
                    label: 'Programado',
                    icon: 'clock',
                    style: { backgroundColor: urgencyLevel === 'scheduled' ? '#ffc107' : 'transparent' }
                  },
                  {
                    value: 'normal',
                    label: 'Normal',
                    icon: 'check-circle',
                    style: { backgroundColor: urgencyLevel === 'normal' ? '#28a745' : 'transparent' }
                  },
                  {
                    value: 'urgent',
                    label: 'Urgente',
                    icon: 'alert',
                    style: { backgroundColor: urgencyLevel === 'urgent' ? '#dc3545' : 'transparent' }
                  }
                ]}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Descripción (opcional)"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={styles.input}
                placeholder="Describe el contenido del envío"
                multiline
                numberOfLines={3}
                left={<TextInput.Icon icon="text" />}
              />

              <TextInput
                label="Precio sugerido (opcional)"
                value={price}
                onChangeText={setPrice}
                mode="outlined"
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                left={<TextInput.Icon icon="currency-usd" />}
              />

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumen del Envío</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Origen:</Text>
                  <Text style={styles.summaryValue}>{origin || 'No especificado'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Destino:</Text>
                  <Text style={styles.summaryValue}>{destination || 'No especificado'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Urgencia:</Text>
                  <Text style={[styles.summaryValue, { color: getUrgencyColor(urgencyLevel) }]}>
                    {getUrgencyText(urgencyLevel)}
                  </Text>
                </View>
                {price && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Precio:</Text>
                    <Text style={styles.summaryValue}>${parseFloat(price).toLocaleString()}</Text>
                  </View>
                )}
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                contentStyle={styles.buttonContent}
                loading={isLoading}
                disabled={isLoading || !origin || !destination}
              >
                Crear Envío
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default CreateDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#667eea',
  },
  buttonContent: {
    paddingVertical: 8,
  },
}); 