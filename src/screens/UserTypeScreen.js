import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserTypeScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);

  const handleContinue = () => {
    if (selectedType) {
      navigation.navigate('Register', { userType: selectedType });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.logo}>📦</Text>
          <Text style={styles.title}>SobrApp</Text>
          <Text style={styles.subtitle}>¿Cuál es tu destino?</Text>
          <Text style={styles.description}>
            Conectamos personas que necesitan enviar sobres con motociclistas disponibles para realizar entregas rápidas y seguras.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <Card 
            style={[
              styles.optionCard,
              selectedType === 'client' && styles.selectedCard
            ]}
            onPress={() => setSelectedType('client')}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name="person" 
                  size={32} 
                  color={selectedType === 'client' ? '#667eea' : '#666'} 
                />
              </View>
              <Text style={styles.optionTitle}>Cliente</Text>
              <Text style={styles.optionDescription}>
                Necesitas enviar sobres y documentos de forma rápida y segura
              </Text>
              <View style={styles.featuresList}>
                <Text style={styles.feature}>• Publicar solicitudes de envío</Text>
                <Text style={styles.feature}>• Seguimiento en tiempo real</Text>
                <Text style={styles.feature}>• Confirmación de entrega</Text>
              </View>
            </Card.Content>
          </Card>

          <Card 
            style={[
              styles.optionCard,
              selectedType === 'driver' && styles.selectedCard
            ]}
            onPress={() => setSelectedType('driver')}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name="bicycle" 
                  size={32} 
                  color={selectedType === 'driver' ? '#667eea' : '#666'} 
                />
              </View>
              <Text style={styles.optionTitle}>Transportador</Text>
              <Text style={styles.optionDescription}>
                Tienes una motocicleta y quieres ganar dinero realizando entregas
              </Text>
              <View style={styles.featuresList}>
                <Text style={styles.feature}>• Ver envíos disponibles</Text>
                <Text style={styles.feature}>• Aceptar entregas</Text>
                <Text style={styles.feature}>• Ganancias flexibles</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={[
              styles.continueButton,
              !selectedType && styles.disabledButton
            ]}
            disabled={!selectedType}
            contentStyle={styles.buttonContent}
          >
            Continuar
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya estás registrado?</Text>
            <Button
              mode="text"
              onPress={handleLogin}
              style={styles.loginButton}
              textColor="white"
            >
              Pincha aquí para iniciar sesión
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    fontSize: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  optionCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#667eea',
    backgroundColor: '#f8f9ff',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  feature: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  actionContainer: {
    marginBottom: 30,
  },
  continueButton: {
    borderRadius: 10,
    backgroundColor: '#667eea',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonContent: {
    paddingVertical: 6,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 3,
  },
  loginButton: {
    marginTop: 2,
  },
});

export default UserTypeScreen; 