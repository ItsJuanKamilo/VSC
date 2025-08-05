import { supabase } from '../config/supabase';
import { Delivery, DeliveryData, UserStats, ServiceResponse } from '../types';
import { handleError, validateRequired, validatePrice } from '../utils/errorHandler';
import { APP_CONFIG } from '../utils/constants';

export const deliveryService = {
  // Crear nuevo envío
  async createDelivery(deliveryData: DeliveryData): Promise<ServiceResponse<{ delivery: Delivery }>> {
    try {
      console.log('📦 Creando nuevo envío:', deliveryData);
      
      // Validaciones
      validateRequired(deliveryData.origin, 'Origen');
      validateRequired(deliveryData.destination, 'Destino');
      validatePrice(deliveryData.price);
      
      const { data, error } = await supabase
        .from('deliveries')
        .insert([
          {
            client_id: deliveryData.clientId,
            origin: deliveryData.origin,
            destination: deliveryData.destination,
            urgency_level: deliveryData.urgencyLevel,
            status: 'pending',
            price: deliveryData.price,
            description: deliveryData.description || '',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando envío:', error);
        return {
          success: false,
          error: error.message || 'Error al crear envío'
        };
      }

      console.log('✅ Envío creado exitosamente');
      return {
        success: true,
        data: { delivery: data as Delivery }
      };
    } catch (error) {
      return handleError(error, 'createDelivery');
    }
  },

  // Obtener envíos del cliente
  async getClientDeliveries(clientId: string): Promise<ServiceResponse<{ deliveries: Delivery[] }>> {
    try {
      console.log('📦 Obteniendo envíos del cliente:', clientId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          driver:users!deliveries_driver_id_fkey(name, email)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo envíos:', error);
        return {
          success: false,
          error: error.message || 'Error al obtener envíos'
        };
      }

      console.log('✅ Envíos obtenidos:', data.length);
      return {
        success: true,
        data: { deliveries: data as Delivery[] }
      };
    } catch (error) {
      return handleError(error, 'getClientDeliveries');
    }
  },

  // Obtener envíos disponibles para motociclistas
  async getAvailableDeliveries(): Promise<ServiceResponse<{ deliveries: Delivery[] }>> {
    try {
      console.log('🚚 Obteniendo envíos disponibles...');
      
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          client:users!deliveries_client_id_fkey(name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo envíos disponibles:', error);
        return {
          success: false,
          error: error.message || 'Error al obtener envíos disponibles'
        };
      }

      console.log('✅ Envíos disponibles obtenidos:', data.length);
      return {
        success: true,
        data: { deliveries: data as Delivery[] }
      };
    } catch (error) {
      return handleError(error, 'getAvailableDeliveries');
    }
  },

  // Obtener envíos del motociclista
  async getDriverDeliveries(driverId: string): Promise<ServiceResponse<{ deliveries: Delivery[] }>> {
    try {
      console.log('🚚 Obteniendo envíos del motociclista:', driverId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          client:users!deliveries_client_id_fkey(name, email)
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo envíos del motociclista:', error);
        return {
          success: false,
          error: error.message || 'Error al obtener envíos del motociclista'
        };
      }

      console.log('✅ Envíos del motociclista obtenidos:', data.length);
      return {
        success: true,
        data: { deliveries: data as Delivery[] }
      };
    } catch (error) {
      return handleError(error, 'getDriverDeliveries');
    }
  },

  // Aceptar envío
  async acceptDelivery(deliveryId: string, driverId: string): Promise<ServiceResponse> {
    try {
      console.log('🚚 Aceptando envío:', deliveryId, 'por driver:', driverId);
      
      const { error } = await supabase
        .from('deliveries')
        .update({
          driver_id: driverId,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', deliveryId)
        .eq('status', 'pending');

      if (error) {
        console.error('❌ Error aceptando envío:', error);
        return {
          success: false,
          error: error.message || 'Error al aceptar envío'
        };
      }

      console.log('✅ Envío aceptado exitosamente');
      return { success: true };
    } catch (error) {
      return handleError(error, 'acceptDelivery');
    }
  },

  // Completar envío
  async completeDelivery(deliveryId: string): Promise<ServiceResponse> {
    try {
      console.log('✅ Completando envío:', deliveryId);
      
      const { data: delivery, error: fetchError } = await supabase
        .from('deliveries')
        .select('price')
        .eq('id', deliveryId)
        .single();

      if (fetchError) {
        return {
          success: false,
          error: 'Error al obtener información del envío'
        };
      }

      const driverEarnings = delivery.price * APP_CONFIG.DRIVER_EARNINGS_PERCENTAGE;
      const releaseDate = new Date();
      releaseDate.setHours(releaseDate.getHours() + APP_CONFIG.EARNINGS_RELEASE_HOURS);

      const { error } = await supabase
        .from('deliveries')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          driver_earnings: driverEarnings,
          earnings_status: 'pending',
          earnings_release_at: releaseDate.toISOString()
        })
        .eq('id', deliveryId)
        .in('status', ['accepted', 'in_transit']);

      if (error) {
        console.error('❌ Error completando envío:', error);
        return {
          success: false,
          error: error.message || 'Error al completar envío'
        };
      }

      console.log('✅ Envío completado exitosamente');
      return { success: true };
    } catch (error) {
      return handleError(error, 'completeDelivery');
    }
  },

  // Marcar envío en camino
  async startDelivery(deliveryId: string): Promise<ServiceResponse> {
    try {
      console.log('🚚 Marcando envío en camino:', deliveryId);
      
      const { error } = await supabase
        .from('deliveries')
        .update({
          status: 'in_transit',
          started_at: new Date().toISOString()
        })
        .eq('id', deliveryId)
        .eq('status', 'accepted');

      if (error) {
        console.error('❌ Error marcando envío en camino:', error);
        return {
          success: false,
          error: error.message || 'Error al marcar envío en camino'
        };
      }

      console.log('✅ Envío marcado en camino exitosamente');
      return { success: true };
    } catch (error) {
      return handleError(error, 'startDelivery');
    }
  },

  // Cancelar envío
  async cancelDelivery(deliveryId: string): Promise<ServiceResponse> {
    try {
      console.log('❌ Cancelando envío:', deliveryId);
      
      const { error } = await supabase
        .from('deliveries')
        .update({
          status: 'pending',
          driver_id: null,
          accepted_at: null,
          started_at: null,
          driver_earnings: null,
          earnings_status: null,
          earnings_release_at: null
        })
        .eq('id', deliveryId)
        .in('status', ['accepted', 'in_transit']);

      if (error) {
        console.error('❌ Error cancelando envío:', error);
        return {
          success: false,
          error: error.message || 'Error al cancelar envío'
        };
      }

      console.log('✅ Envío cancelado exitosamente');
      return { success: true };
    } catch (error) {
      return handleError(error, 'cancelDelivery');
    }
  },

  // Confirmar recepción
  async confirmDelivery(deliveryId: string): Promise<ServiceResponse> {
    try {
      console.log('📦 Confirmando recepción:', deliveryId);
      
      const { error } = await supabase
        .from('deliveries')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          earnings_status: 'available'
        })
        .eq('id', deliveryId)
        .eq('status', 'completed');

      if (error) {
        console.error('❌ Error confirmando envío:', error);
        return {
          success: false,
          error: error.message || 'Error al confirmar envío'
        };
      }

      console.log('✅ Recepción confirmada exitosamente');
      return { success: true };
    } catch (error) {
      return handleError(error, 'confirmDelivery');
    }
  },

  // Obtener estadísticas del usuario
  async getUserStats(userId: string, userType: 'client' | 'driver'): Promise<ServiceResponse<{ stats: UserStats }>> {
    try {
      console.log('📊 Obteniendo estadísticas para:', userId, userType);
      
      let query = supabase.from('deliveries');
      
      if (userType === 'client') {
        query = query.eq('client_id', userId);
      } else {
        query = query.eq('driver_id', userId);
      }

      const { data, error } = await query.select('status, price, driver_earnings, earnings_status');

      if (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return {
          success: false,
          error: error.message || 'Error al obtener estadísticas'
        };
      }

      const stats: UserStats = {
        totalDeliveries: data.length,
        pendingDeliveries: data.filter(d => d.status === 'pending').length,
        completedDeliveries: data.filter(d => d.status === 'completed').length,
        availableEarnings: data
          .filter(d => d.earnings_status === 'available')
          .reduce((sum, d) => sum + (d.driver_earnings || 0), 0),
        pendingEarnings: data
          .filter(d => d.earnings_status === 'pending')
          .reduce((sum, d) => sum + (d.driver_earnings || 0), 0)
      };

      console.log('✅ Estadísticas obtenidas:', stats);
      return {
        success: true,
        data: { stats }
      };
    } catch (error) {
      return handleError(error, 'getUserStats');
    }
  }
};

// Funciones helper para UI
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return '#ffc107';
    case 'accepted': return '#17a2b8';
    case 'in_transit': return '#fd7e14';
    case 'completed': return '#28a745';
    case 'confirmed': return '#6f42c1';
    case 'cancelled': return '#dc3545';
    default: return '#6c757d';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'accepted': return 'Aceptado';
    case 'in_transit': return 'En Camino';
    case 'completed': return 'Completado';
    case 'confirmed': return 'Confirmado';
    case 'cancelled': return 'Cancelado';
    default: return 'Desconocido';
  }
};

export const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'urgent': return '#dc3545';
    case 'normal': return '#28a745';
    case 'scheduled': return '#17a2b8';
    default: return '#6c757d';
  }
};

export const getUrgencyText = (urgency: string): string => {
  switch (urgency) {
    case 'urgent': return 'Urgente';
    case 'normal': return 'Normal';
    case 'scheduled': return 'Programado';
    default: return 'Desconocido';
  }
}; 