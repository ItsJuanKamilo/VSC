import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainNavigator from './MainNavigator';
import { NavigationProvider } from '../context/NavigationContext';
import { authService } from '../services/authService';
import { setupService } from '../services/setupService';
import { testConnection } from '../config/supabase';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('client');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await testConnection();
        
        // Configurar base de datos
        console.log('🔧 Inicializando configuración de base de datos...');
        await setupService.setupDatabase();
        
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleLogin = async (credentials) => {
    console.log('🔄 Intentando login:', credentials.email);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        console.log('✅ Login exitoso');
        setCurrentUser(result.user);
        setUserType(result.user.user_type);
        setIsAuthenticated(true);
      } else {
        console.log('❌ Login fallido:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleRegister = async (userData) => {
    console.log('🔄 Intentando registro:', userData.email);
    
    // Debug: Verificar datos recibidos en AppNavigator
    console.log('🔍 Debug AppNavigator - Datos recibidos:');
    console.log('  - Email:', userData.email);
    console.log('  - Password:', userData.password);
    console.log('  - Password tipo:', typeof userData.password);
    console.log('  - Password longitud:', userData.password ? userData.password.length : 'undefined');
    console.log('  - Name:', userData.name);
    console.log('  - UserType:', userData.userType);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        console.log('✅ Registro exitoso');
        setCurrentUser(result.user);
        setUserType(result.user.user_type);
        setIsAuthenticated(true);
      } else {
        console.log('❌ Registro fallido:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    console.log('🔄 Cerrando sesión');
    setIsAuthenticated(false);
    setUserType('client');
    setCurrentUser(null);
  };

  const navigationContextValue = {
    userType,
    currentUser,
    onLogout: handleLogout,
    onLogin: handleLogin,
    onRegister: handleRegister,
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationProvider value={navigationContextValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen 
                name="UserType" 
                component={UserTypeScreen}
              />
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
              />
            </>
          ) : (
            <Stack.Screen 
              name="Main" 
              component={MainNavigator}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationProvider>
  );
};

export default AppNavigator; 