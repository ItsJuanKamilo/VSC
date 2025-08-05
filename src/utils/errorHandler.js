import { Alert } from 'react-native';

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export const handleError = (error, context = '') => {
  console.error(`❌ Error en ${context}:`, error);

  let errorMessage = 'Ha ocurrido un error inesperado.';
  let errorCode = ErrorCodes.UNKNOWN_ERROR;

  if (error instanceof AppError) {
    errorMessage = error.message;
    errorCode = error.code;
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Log detallado para debugging
  console.error('Error Details:', {
    code: errorCode,
    message: errorMessage,
    context,
    originalError: error,
  });

  return {
    code: errorCode,
    message: errorMessage,
    showAlert: true,
  };
};

export const showErrorAlert = (error, title = 'Error') => {
  const errorInfo = handleError(error);
  
  if (errorInfo.showAlert) {
    Alert.alert(title, errorInfo.message, [
      { text: 'OK', style: 'default' }
    ]);
  }
};

export const showSuccessAlert = (message, title = 'Éxito') => {
  Alert.alert(title, message, [
    { text: 'OK', style: 'default' }
  ]);
};

export const showConfirmationAlert = (message, onConfirm, title = 'Confirmar') => {
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', onPress: onConfirm, style: 'destructive' }
  ]);
};

// Validaciones comunes
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new AppError('Por favor ingresa un email válido.', ErrorCodes.VALIDATION_ERROR);
  }
  return true;
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new AppError('La contraseña debe tener al menos 6 caracteres.', ErrorCodes.VALIDATION_ERROR);
  }
  return true;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim().length === 0) {
    throw new AppError(`${fieldName} es requerido.`, ErrorCodes.VALIDATION_ERROR);
  }
  return true;
};

export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    throw new AppError('El precio debe ser un número mayor a 0.', ErrorCodes.VALIDATION_ERROR);
  }
  return true;
}; 