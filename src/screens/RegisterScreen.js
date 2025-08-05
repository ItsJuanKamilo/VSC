import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNavigationContext } from '../context/NavigationContext';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onRegister } = useNavigationContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const userType = route?.params?.userType || 'client';

  const handleSubmit = () => {
    if (!name || !email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, ingresa un email válido.');
      return;
    }
    
    // Debug: Verificar datos antes de enviar
    console.log('🔍 Debug RegisterScreen - Datos a enviar:');
    console.log('  - Email:', email);
    console.log('  - Password:', password);
    console.log('  - Password tipo:', typeof password);
    console.log('  - Password longitud:', password.length);
    console.log('  - Name:', name);
    console.log('  - UserType:', userType);
    
    console.log('📝 Enviando datos de registro:', { email, name, userType, passwordLength: password.length });
    onRegister && onRegister({ email, password, name, userType });
  };

  const handleBack = () => {
    navigation.goBack();
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
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleSection}>
            <Text style={styles.logo}>📦</Text>
            <Text style={styles.title}>SobrApp</Text>
            <Text style={styles.subtitle}>Crea tu cuenta</Text>
            <Text style={styles.userTypeText}>
              Registrándote como: {userType === 'client' ? 'Cliente' : 'Motociclista'}
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Nombre completo"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Registrarse
              </Button>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Divider style={styles.divider} />
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.switchButton}
              textColor="white"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    fontSize: 18,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  userTypeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#667eea',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    marginTop: 20,
  },
  divider: {
    marginBottom: 15,
  },
  switchButton: {
    marginTop: 10,
  },
}); 