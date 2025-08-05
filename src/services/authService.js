import { supabase } from '../config/supabase';

// Función simple de hash para desarrollo (en producción usar bcrypt)
function simpleHash(password) {
  let hash = 0;
  if (password.length === 0) return hash.toString();
  
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Agregar salt y convertir a string hexadecimal
  const salt = 'sobrapp_salt_2024';
  const saltedHash = hash.toString(16) + salt;
  
  // Doble hash para mayor seguridad
  let finalHash = 0;
  for (let i = 0; i < saltedHash.length; i++) {
    const char = saltedHash.charCodeAt(i);
    finalHash = ((finalHash << 5) - finalHash) + char;
    finalHash = finalHash & finalHash;
  }
  
  return 'hash_' + finalHash.toString(16) + '_' + salt;
}

// Función para verificar hash
function verifyHash(password, hashedPassword) {
  const computedHash = simpleHash(password);
  return computedHash === hashedPassword;
}

export const authService = {
  // Registro de usuario con encriptación alternativa
  async register(userData) {
    try {
      console.log('🔄 Registrando usuario:', userData.email);
      console.log('📝 Datos recibidos:', { 
        email: userData.email, 
        name: userData.name, 
        userType: userData.userType,
        passwordLength: userData.password ? userData.password.length : 'undefined'
      });
      
      // Validar datos requeridos
      if (!userData.email || !userData.password || !userData.name || !userData.userType) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar que la contraseña sea string
      if (typeof userData.password !== 'string') {
        throw new Error('La contraseña debe ser un texto válido');
      }

      // Validar longitud mínima de contraseña
      if (userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Verificar si el email ya existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
      
      // Debug: Verificar el tipo y valor de la contraseña
      console.log('🔍 Debug contraseña:');
      console.log('  - Tipo:', typeof userData.password);
      console.log('  - Valor:', userData.password);
      console.log('  - Longitud:', userData.password.length);
      console.log('  - Es string?', typeof userData.password === 'string');
      
      // Encriptar la contraseña con hash alternativo
      console.log('🔐 Intentando encriptar con hash alternativo...');
      const hashedPassword = simpleHash(userData.password);
      
      console.log('🔐 Contraseña encriptada generada');
      console.log('  - Hash generado:', hashedPassword.substring(0, 20) + '...');
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            password_hash: hashedPassword, // Contraseña encriptada
            name: userData.name,
            user_type: userData.userType
          }
        ])
        .select();

      if (error) {
        console.error('❌ Error en registro:', error);
        throw error;
      }
      
      console.log('✅ Usuario registrado exitosamente');
      return { success: true, user: data[0] };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error al registrar usuario' 
      };
    }
  },

  // Login de usuario con verificación de contraseña encriptada
  async login(credentials) {
    try {
      console.log('🔄 Iniciando sesión:', credentials.email);
      console.log('📝 Credenciales recibidas:', { 
        email: credentials.email, 
        passwordLength: credentials.password ? credentials.password.length : 'undefined'
      });
      
      // Validar datos requeridos
      if (!credentials.email || !credentials.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // Validar que la contraseña sea string
      if (typeof credentials.password !== 'string') {
        throw new Error('La contraseña debe ser un texto válido');
      }
      
      // Buscar usuario por email
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (fetchError) {
        console.error('❌ Usuario no encontrado:', fetchError);
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña encriptada
      const isPasswordValid = verifyHash(credentials.password, user.password_hash);
      
      if (!isPasswordValid) {
        console.error('❌ Contraseña incorrecta');
        throw new Error('Credenciales inválidas');
      }
      
      console.log('✅ Login exitoso');
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        error: 'Credenciales inválidas' 
      };
    }
  },

  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar si el email ya existe
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (error && error.code === 'PGRST116') {
        // No se encontró el email
        return { exists: false };
      }
      
      if (error) throw error;
      
      return { exists: true };
    } catch (error) {
      console.error('❌ Error verificando email:', error);
      return { exists: false, error: error.message };
    }
  },

  // Función para encriptar contraseña (útil para migraciones)
  async hashPassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Contraseña inválida');
    }
    return simpleHash(password);
  },

  // Función para verificar contraseña
  async verifyPassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
      return false;
    }
    return verifyHash(password, hashedPassword);
  }
}; 