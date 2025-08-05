// Estados de envío
export const DELIVERY_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

// Niveles de urgencia
export const URGENCY_LEVELS = {
  URGENT: 'urgent',
  NORMAL: 'normal',
  SCHEDULED: 'scheduled',
};

// Tipos de usuario
export const USER_TYPES = {
  CLIENT: 'client',
  DRIVER: 'driver',
};

// Estados de ganancias
export const EARNINGS_STATUS = {
  PENDING: 'pending',
  AVAILABLE: 'available',
  RELEASED: 'released',
};

// Colores del tema
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  DANGER: '#dc3545',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
  WHITE: '#ffffff',
  GRAY: '#6c757d',
  LIGHT_GRAY: '#e9ecef',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  MAX_DELIVERIES_PER_PAGE: 10,
  REFRESH_INTERVAL: 30000, // 30 segundos
  EARNINGS_RELEASE_HOURS: 24,
  DRIVER_EARNINGS_PERCENTAGE: 0.8, // 80%
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  AUTHENTICATION_ERROR: 'Error de autenticación. Inicia sesión nuevamente.',
  VALIDATION_ERROR: 'Datos inválidos. Revisa la información ingresada.',
  PERMISSION_ERROR: 'No tienes permisos para realizar esta acción.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  DELIVERY_CREATED: 'Envío creado exitosamente.',
  DELIVERY_ACCEPTED: 'Envío aceptado exitosamente.',
  DELIVERY_STARTED: 'Envío marcado en camino.',
  DELIVERY_COMPLETED: 'Envío completado exitosamente.',
  DELIVERY_CONFIRMED: 'Recepción confirmada exitosamente.',
  DELIVERY_CANCELLED: 'Envío cancelado exitosamente.',
  USER_REGISTERED: 'Usuario registrado exitosamente.',
  USER_LOGGED_IN: 'Inicio de sesión exitoso.',
};

// Configuración de navegación
export const NAVIGATION_CONFIG = {
  HEADER_HEIGHT: 50,
  TAB_BAR_HEIGHT: 55,
  SCREEN_PADDING: 20,
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: 300,
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  AUTO_HIDE_DELAY: 3000,
  POSITION: 'top',
};

// Configuración de validación
export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRICE: 1,
  MAX_PRICE: 1000000,
}; 