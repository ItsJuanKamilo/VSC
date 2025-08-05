// import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { AuthCredentials, RegisterData, User, ServiceResponse } from '../types';
import { validateEmail, validatePassword, validateRequired, handleError } from '../utils/errorHandler';

export const authService = {
  // Registrar nuevo usuario
  async register(userData: RegisterData): Promise<ServiceResponse<{ user: User }>> {
    try {
      console.log('🔄 Registrando usuario:', userData.email);
      
      // Validaciones
      validateRequired(userData.name, 'Nombre');
      validateEmail(userData.email);
      validatePassword(userData.password);
      validateRequired(userData.userType, 'Tipo de usuario');

      // Verificar si el email ya existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'El email ya está registrado'
        };
      }

      // Encriptar contraseña (simplificado para desarrollo)
      const hashedPassword = btoa(userData.password); // Base64 encoding for development

      // Crear usuario
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            user_type: userData.userType,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error registrando usuario:', error);
        return {
          success: false,
          error: error.message || 'Error al registrar usuario'
        };
      }

      console.log('✅ Usuario registrado exitosamente');
      return {
        success: true,
        data: { user: data as User }
      };
    } catch (error) {
      return handleError(error, 'register');
    }
  },

  // Iniciar sesión
  async login(credentials: AuthCredentials): Promise<ServiceResponse<{ user: User }>> {
    try {
      console.log('🔄 Intentando login:', credentials.email);
      
      // Validaciones
      validateEmail(credentials.email);
      validatePassword(credentials.password);

      // Buscar usuario por email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (error || !user) {
        return {
          success: false,
          error: 'Email o contraseña incorrectos'
        };
      }

      // Verificar contraseña (simplificado para desarrollo)
      const isPasswordValid = btoa(credentials.password) === user.password;
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Email o contraseña incorrectos'
        };
      }

      console.log('✅ Login exitoso');
      return {
        success: true,
        data: { user: user as User }
      };
    } catch (error) {
      return handleError(error, 'login');
    }
  },

  // Obtener usuario actual (mock para desarrollo)
  async getCurrentUser(): Promise<ServiceResponse<{ user: User }>> {
    try {
      // Mock user for development
      const mockUser: User = {
        id: '1',
        name: 'Usuario Demo',
        email: 'demo@example.com',
        user_type: 'client',
        created_at: new Date().toISOString()
      };

      return {
        success: true,
        data: { user: mockUser }
      };
    } catch (error) {
      return handleError(error, 'getCurrentUser');
    }
  },

  // Cerrar sesión (mock para desarrollo)
  async logout(): Promise<ServiceResponse> {
    try {
      console.log('🔄 Cerrando sesión');
      return {
        success: true
      };
    } catch (error) {
      return handleError(error, 'logout');
    }
  }
}; 