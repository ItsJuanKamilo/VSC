import { useState, useEffect } from 'react';

export const useRealtimeNotifications = (userType) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (title, message, type = 'info') => {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Mantener solo las últimas 5
    
    // No mostrar alertas automáticas
    console.log('📱 Notificación:', title, message);
  };

  const getNotificationMessage = (payload, userType) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        if (userType === 'driver') {
          return {
            title: '🎉 Nuevo Envío Disponible',
            message: `Hay un nuevo envío de ${newRecord.origin} a ${newRecord.destination}`,
            type: 'success'
          };
        } else {
          return {
            title: '📦 Envío Creado',
            message: 'Tu envío ha sido creado exitosamente',
            type: 'success'
          };
        }

      case 'UPDATE':
        if (newRecord.status === 'accepted') {
          return {
            title: '✅ Envío Aceptado',
            message: 'Un transportista ha aceptado tu envío',
            type: 'success'
          };
        } else if (newRecord.status === 'in_transit') {
          return {
            title: '🚚 En Camino',
            message: 'Tu envío está en ruta',
            type: 'info'
          };
        } else if (newRecord.status === 'completed') {
          return {
            title: '📦 Entregado',
            message: 'Tu envío ha sido entregado',
            type: 'success'
          };
        } else if (newRecord.status === 'confirmed') {
          return {
            title: '✅ Recepción Confirmada',
            message: 'El cliente ha confirmado la recepción',
            type: 'success'
          };
        }
        break;

      case 'DELETE':
        return {
          title: '🗑️ Envío Eliminado',
          message: 'Un envío ha sido eliminado',
          type: 'info'
        };

      default:
        return null;
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    showNotification,
    getNotificationMessage,
    clearNotifications
  };
}; 