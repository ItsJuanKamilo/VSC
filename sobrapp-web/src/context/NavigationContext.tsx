import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface NavigationContextType {
  isAuthenticated: boolean;
  userType: 'client' | 'driver';
  currentUser: User | null;
  handleLogin: (credentials: { email: string; password: string }) => Promise<void>;
  handleRegister: (userData: { name: string; email: string; password: string; userType: 'client' | 'driver' }) => Promise<void>;
  handleLogout: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  value: NavigationContextType;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children, value }) => {
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}; 