import { ServiceResponse } from '../types';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const handleError = (error: any, context: string = ''): ServiceResponse => {
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
    success: false,
    error: errorMessage,
  };
};

export const showErrorAlert = (error: any, title: string = 'Error') => {
  const errorInfo = handleError(error);
  
  if (errorInfo.error) {
    // En web, podríamos usar un toast o modal
    alert(`${title}: ${errorInfo.error}`);
  }
};

export const showSuccessAlert = (message: string, title: string = 'Éxito') => {
  // En web, podríamos usar un toast
  alert(`${title}: ${message}`);
};

export const showConfirmationAlert = (
  message: string,
  onConfirm: () => void,
  title: string = 'Confirmar'
) => {
  if (confirm(`${title}: ${message}`)) {
    onConfirm();
  }
};

// Validaciones comunes
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new AppError('Por favor ingresa un email válido.', ErrorCodes.VALIDATION_ERROR);
  }
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (!password || password.length < 6) {
    throw new AppError('La contraseña debe tener al menos 6 caracteres.', ErrorCodes.VALIDATION_ERROR);
  }
  return true;
};

export const validateRequired = (value: string, fieldName: string): boolean => {
  if (!value || value.trim().length === 0) {
    throw new AppError(`${fieldName} es requerido.`, ErrorCodes.VALIDATION_ERROR);
  }
  return true;
};

export const validatePrice = (price: number): boolean => {
  if (isNaN(price) || price <= 0) {
    throw new AppError('El precio debe ser un número mayor a 0.', ErrorCodes.VALIDATION_ERROR);
  }
  return true;
}; 