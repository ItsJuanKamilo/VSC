import { supabase } from '../config/supabase';

class RealtimeService {
  constructor() {
    this.subscriptions = new Map();
    this.listeners = new Map();
  }

  // Suscribirse a cambios en envíos
  subscribeToDeliveries(userId, userType, onUpdate) {
    const subscriptionKey = `deliveries_${userId}_${userType}`;
    
    // Cancelar suscripción existente si existe
    this.unsubscribeFromDeliveries(userId, userType);

    let query;
    
    if (userType === 'client') {
      // Clientes escuchan sus propios envíos
      query = supabase
        .channel(`deliveries_client_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deliveries',
            filter: `client_id=eq.${userId}`
          },
          (payload) => {
            console.log('🔄 Actualización en tiempo real (cliente):', payload);
            onUpdate(payload);
          }
        );
    } else {
      // Transportistas escuchan envíos disponibles y sus envíos aceptados
      query = supabase
        .channel(`deliveries_driver_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deliveries',
            filter: `status=eq.pending`
          },
          (payload) => {
            console.log('🔄 Actualización en tiempo real (disponibles):', payload);
            onUpdate(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deliveries',
            filter: `driver_id=eq.${userId}`
          },
          (payload) => {
            console.log('🔄 Actualización en tiempo real (mis envíos):', payload);
            onUpdate(payload);
          }
        );
    }

    // Suscribirse
    query.subscribe((status) => {
      console.log('📡 Estado de suscripción:', status);
      if (status === 'SUBSCRIBED') {
        this.subscriptions.set(subscriptionKey, query);
        this.listeners.set(subscriptionKey, onUpdate);
        console.log('✅ Suscripción activa para:', subscriptionKey);
      }
    });

    return subscriptionKey;
  }

  // Cancelar suscripción específica
  unsubscribeFromDeliveries(userId, userType) {
    const subscriptionKey = `deliveries_${userId}_${userType}`;
    const subscription = this.subscriptions.get(subscriptionKey);
    
    if (subscription) {
      console.log('🔌 Cancelando suscripción:', subscriptionKey);
      supabase.removeChannel(subscription);
      this.subscriptions.delete(subscriptionKey);
      this.listeners.delete(subscriptionKey);
    }
  }

  // Cancelar todas las suscripciones
  unsubscribeAll() {
    console.log('🔌 Cancelando todas las suscripciones...');
    
    this.subscriptions.forEach((subscription, key) => {
      console.log('🔌 Cancelando:', key);
      supabase.removeChannel(subscription);
    });
    
    this.subscriptions.clear();
    this.listeners.clear();
  }

  // Obtener suscripciones activas
  getActiveSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }
}

// Instancia singleton
export const realtimeService = new RealtimeService(); 