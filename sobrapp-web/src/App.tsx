import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import AppNavigator from './components/AppNavigator';
import { authService } from './services/authService';
import { testConnection } from './config/supabase';
import { User } from './types';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
    info: {
      main: '#17a2b8',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'client' | 'driver'>('client');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test connection (optional for development)
        try {
          await testConnection();
        } catch (error) {
          console.log('Supabase connection test failed, continuing with mock data');
        }
        
        // Verificar si hay una sesión activa
        const userResult = await authService.getCurrentUser();
        if (userResult.success && userResult.data?.user) {
          setCurrentUser(userResult.data.user);
          setUserType(userResult.data.user.user_type);
          setIsAuthenticated(true);
        }
        
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    console.log('🔄 Intentando login:', credentials.email);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data?.user) {
        console.log('✅ Login exitoso');
        setCurrentUser(result.data.user);
        setUserType(result.data.user.user_type);
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

  const handleRegister = async (userData: { name: string; email: string; password: string; userType: 'client' | 'driver' }) => {
    console.log('🔄 Intentando registro:', userData.email);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success && result.data?.user) {
        console.log('✅ Registro exitoso');
        setCurrentUser(result.data.user);
        setUserType(result.data.user.user_type);
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

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <Router>
            <AppNavigator
              isLoading={isLoading}
              isAuthenticated={isAuthenticated}
              userType={userType}
              currentUser={currentUser}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
            />
          </Router>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
