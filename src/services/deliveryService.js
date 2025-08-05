import { supabase } from '../config/supabase';

export const deliveryService = {
  // Crear nuevo envío
  async createDelivery(deliveryData) {
    try {
      console.log('📦 Creando nuevo envío:', deliveryData);
      
      const { data, error } = await supabase
        .from('deliveries')
        .insert([
          {
            client_id: deliveryData.clientId,
            origin: deliveryData.origin,
            destination: deliveryData.destination,
            urgency_level: deliveryData.urgencyLevel,
            status: 'pending',
            price: deliveryData.price || 0,
            description: deliveryData.description || '',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('❌ Error creando envío:', error);
        throw error;
      }

      console.log('✅ Envío creado exitosamente');
      return { success: true, delivery: data[0] };
    } catch (error) {
      console.error('❌ Error en createDelivery:', error);
      return { 
        success: false, 
        error: error.message || 'Error al crear envío' 
      };
    }
  },

  // Obtener envíos del cliente
  async getClientDeliveries(clientId) {
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
        throw error;
      }

      console.log('✅ Envíos obtenidos:', data.length);
      return { success: true, deliveries: data };
    } catch (error) {
      console.error('❌ Error en getClientDeliveries:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener envíos' 
      };
    }
  },

  // Obtener envíos disponibles para motociclistas
  async getAvailableDeliveries() {
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

      console.log('🔍 Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('❌ Error obteniendo envíos disponibles:', error);
        throw error;
      }

      console.log('✅ Envíos disponibles obtenidos:', data.length);
      console.log('📋 Datos de envíos:', data);
      return { success: true, deliveries: data };
    } catch (error) {
      console.error('❌ Error en getAvailableDeliveries:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener envíos disponibles' 
      };
    }
  },

  // Obtener envíos del motociclista
  async getDriverDeliveries(driverId) {
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
        throw error;
      }

      console.log('✅ Envíos del motociclista obtenidos:', data.length);
      return { success: true, deliveries: data };
    } catch (error) {
      console.error('❌ Error en getDriverDeliveries:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener envíos del motociclista' 
      };
    }
  },

  // Aceptar envío (motociclista)
  async acceptDelivery(deliveryId, driverId) {
    try {
      console.log('🚚 Aceptando envío:', deliveryId, 'por motociclista:', driverId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .update({
          driver_id: driverId,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', deliveryId)
        .eq('status', 'pending')
        .select();

      if (error) {
        console.error('❌ Error aceptando envío:', error);
        throw error;
      }

      if (data.length === 0) {
        throw new Error('El envío no está disponible o ya fue aceptado');
      }

      console.log('✅ Envío aceptado exitosamente');
      return { success: true, delivery: data[0] };
    } catch (error) {
      console.error('❌ Error en acceptDelivery:', error);
      return { 
        success: false, 
        error: error.message || 'Error al aceptar envío' 
      };
    }
  },

  // Completar envío (motociclista)
  async completeDelivery(deliveryId) {
    try {
      console.log('✅ Completando envío:', deliveryId);
      
      // Primero obtener el envío para calcular ganancias
      const { data: delivery, error: fetchError } = await supabase
        .from('deliveries')
        .select('price')
        .eq('id', deliveryId)
        .single();

      if (fetchError) {
        console.error('❌ Error obteniendo envío:', fetchError);
        throw fetchError;
      }

      // Calcular ganancias (80% para el transportista)
      const driverEarnings = Math.round((delivery.price * 0.8) * 100) / 100;
      const releaseDate = new Date();
      releaseDate.setHours(releaseDate.getHours() + 24); // 24 horas después

      const { data, error } = await supabase
        .from('deliveries')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          driver_earnings: driverEarnings,
          earnings_status: 'pending',
          earnings_release_at: releaseDate.toISOString()
        })
        .eq('id', deliveryId)
        .in('status', ['accepted', 'in_transit'])
        .select();

      if (error) {
        console.error('❌ Error completando envío:', error);
        throw error;
      }

      if (data.length === 0) {
        throw new Error('El envío no puede ser completado');
      }

      console.log('✅ Envío completado exitosamente');
      console.log('💰 Ganancias asignadas:', driverEarnings);
      console.log('⏰ Liberación de ganancias:', releaseDate.toLocaleString());
      return { success: true, delivery: data[0] };
    } catch (error) {
      console.error('❌ Error en completeDelivery:', error);
      return { 
        success: false, 
        error: error.message || 'Error al completar envío' 
      };
    }
  },

  // Marcar envío en camino (motociclista)
  async startDelivery(deliveryId) {
    try {
      console.log('🚚 Marcando envío en camino:', deliveryId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .update({
          status: 'in_transit',
          started_at: new Date().toISOString()
        })
        .eq('id', deliveryId)
        .eq('status', 'accepted')
        .select();

      if (error) {
        console.error('❌ Error marcando envío en camino:', error);
        throw error;
      }

      if (data.length === 0) {
        throw new Error('El envío no puede ser marcado en camino');
      }

      console.log('✅ Envío marcado en camino exitosamente');
      return { success: true, delivery: data[0] };
    } catch (error) {
      console.error('❌ Error en startDelivery:', error);
      return { 
        success: false, 
        error: error.message || 'Error al marcar envío en camino' 
      };
    }
  },

  // Cancelar envío (motociclista) - vuelve a estar disponible
  async cancelDelivery(deliveryId) {
    try {
      console.log('❌ Cancelando envío:', deliveryId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .update({
          status: 'pending',
          driver_id: null,
          accepted_at: null,
          started_at: null,
          completed_at: null
        })
        .eq('id', deliveryId)
        .in('status', ['accepted', 'in_transit'])
        .select();

      if (error) {
        console.error('❌ Error cancelando envío:', error);
        throw error;
      }

      if (data.length === 0) {
        throw new Error('El envío no puede ser cancelado');
      }

      console.log('✅ Envío cancelado exitosamente, vuelve a estar disponible');
      return { success: true, delivery: data[0] };
    } catch (error) {
      console.error('❌ Error en cancelDelivery:', error);
      return { 
        success: false, 
        error: error.message || 'Error al cancelar envío' 
      };
    }
  },

  // Confirmar recepción (cliente)
  async confirmDelivery(deliveryId) {
    try {
      console.log('📦 Confirmando recepción del envío:', deliveryId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          earnings_status: 'available', // Liberar ganancias inmediatamente
          earnings_release_at: new Date().toISOString()
        })
        .eq('id', deliveryId)
        .eq('status', 'completed')
        .select();

      if (error) {
        console.error('❌ Error confirmando envío:', error);
        throw error;
      }

      if (data.length === 0) {
        throw new Error('El envío no puede ser confirmado');
      }

      console.log('✅ Recepción confirmada exitosamente');
      console.log('💰 Ganancias liberadas inmediatamente');
      return { success: true, delivery: data[0] };
    } catch (error) {
      console.error('❌ Error en confirmDelivery:', error);
      return { 
        success: false, 
        error: error.message || 'Error al confirmar envío' 
      };
    }
  },

  // Liberar ganancias pendientes automáticamente (ejecutar periódicamente)
  async releasePendingEarnings() {
    try {
      console.log('💰 Liberando ganancias pendientes...');
      
      const { data, error } = await supabase
        .from('deliveries')
        .update({
          earnings_status: 'available',
          earnings_release_at: new Date().toISOString()
        })
        .eq('earnings_status', 'pending')
        .lt('earnings_release_at', new Date().toISOString())
        .select();

      if (error) {
        console.error('❌ Error liberando ganancias:', error);
        throw error;
      }

      if (data.length > 0) {
        console.log(`✅ ${data.length} ganancias liberadas automáticamente`);
      } else {
        console.log('ℹ️ No hay ganancias pendientes para liberar');
      }

      return { success: true, released: data.length };
    } catch (error) {
      console.error('❌ Error en releasePendingEarnings:', error);
      return { 
        success: false, 
        error: error.message || 'Error al liberar ganancias' 
      };
    }
  },

  // Obtener estadísticas del usuario
  async getUserStats(userId, userType) {
    try {
      console.log('📊 Obteniendo estadísticas del usuario:', userId, userType);
      
      let query;
      if (userType === 'client') {
        query = supabase
          .from('deliveries')
          .select('status')
          .eq('client_id', userId);
      } else {
        query = supabase
          .from('deliveries')
          .select('status, price, driver_earnings, earnings_status')
          .eq('driver_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        throw error;
      }

      const stats = {
        total: data.length,
        pending: data.filter(d => d.status === 'pending').length,
        accepted: data.filter(d => d.status === 'accepted').length,
        completed: data.filter(d => d.status === 'completed').length,
        confirmed: data.filter(d => d.status === 'confirmed').length
      };

      if (userType === 'driver') {
        // Calcular ganancias usando las nuevas columnas
        const earningsStats = await this.getDriverEarningsStats(userId);
        if (earningsStats.success) {
          stats.earnings = earningsStats.stats.availableEarnings;
          stats.pendingEarnings = earningsStats.stats.pendingEarnings;
          stats.totalEarnings = earningsStats.stats.totalEarnings;
        } else {
          // Fallback al método anterior
          stats.earnings = data
            .filter(d => d.status === 'confirmed')
            .reduce((sum, d) => sum + (d.price || 0), 0);
        }
      }

      console.log('✅ Estadísticas obtenidas:', stats);
      return { success: true, stats };
    } catch (error) {
      console.error('❌ Error en getUserStats:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener estadísticas' 
      };
    }
  },

  // Obtener estadísticas detalladas de ganancias
  async getDriverEarningsStats(driverId) {
    try {
      console.log('💰 Obteniendo estadísticas de ganancias:', driverId);
      
      const { data, error } = await supabase
        .from('deliveries')
        .select('driver_earnings, earnings_status, earnings_release_at, status')
        .eq('driver_id', driverId)
        .not('driver_earnings', 'is', null);

      if (error) {
        console.error('❌ Error obteniendo estadísticas de ganancias:', error);
        throw error;
      }

      const stats = {
        totalEarnings: 0,
        availableEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        pendingDeliveries: []
      };

      data.forEach(delivery => {
        const earnings = delivery.driver_earnings || 0;
        stats.totalEarnings += earnings;

        switch (delivery.earnings_status) {
          case 'available':
            stats.availableEarnings += earnings;
            break;
          case 'pending':
            stats.pendingEarnings += earnings;
            if (delivery.status === 'completed') {
              stats.pendingDeliveries.push({
                earnings,
                releaseAt: delivery.earnings_release_at
              });
            }
            break;
          case 'paid':
            stats.paidEarnings += earnings;
            break;
        }
      });

      console.log('✅ Estadísticas de ganancias obtenidas:', stats);
      return { success: true, stats };
    } catch (error) {
      console.error('❌ Error en getDriverEarningsStats:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener estadísticas de ganancias' 
      };
    }
  },
};

// Funciones auxiliares para colores y textos de estado
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#ffc107';
    case 'accepted': return '#17a2b8';
    case 'in_transit': return '#fd7e14';
    case 'completed': return '#28a745';
    case 'confirmed': return '#6f42c1';
    default: return '#6c757d';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'accepted': return 'Aceptado';
    case 'in_transit': return 'En Camino';
    case 'completed': return 'Completado';
    case 'confirmed': return 'Confirmado';
    default: return 'Desconocido';
  }
};

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'urgent': return '#dc3545';
    case 'normal': return '#28a745';
    case 'scheduled': return '#ffc107';
    default: return '#28a745';
  }
};

const getUrgencyText = (urgency) => {
  switch (urgency) {
    case 'urgent': return 'Urgente';
    case 'normal': return 'Normal';
    case 'scheduled': return 'Programado';
    default: return 'Normal';
  }
};

// Exportar las funciones auxiliares
export { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText }; 