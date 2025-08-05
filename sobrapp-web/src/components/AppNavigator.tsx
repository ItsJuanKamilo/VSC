import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import SplashScreen from './SplashScreen';
import UserTypeScreen from './UserTypeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import MainLayout from './MainLayout';
import { User } from '../types';

interface AppNavigatorProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'client' | 'driver';
  currentUser: User | null;
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onRegister: (userData: { name: string; email: string; password: string; userType: 'client' | 'driver' }) => Promise<void>;
  onLogout: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  isLoading,
  isAuthenticated,
  userType,
  currentUser,
  onLogin,
  onRegister,
  onLogout
}) => {
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<UserTypeScreen />} />
            <Route path="/login" element={<LoginScreen onLogin={onLogin} />} />
            <Route path="/register" element={<RegisterScreen onRegister={onRegister} />} />
          </>
        ) : (
          <Route path="/*" element={
            <MainLayout
              userType={userType}
              currentUser={currentUser}
              onLogout={onLogout}
            />
          } />
        )}
      </Routes>
    </Box>
  );
};

export default AppNavigator; 