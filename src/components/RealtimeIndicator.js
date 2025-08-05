import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { realtimeService } from '../services/realtimeService';

const RealtimeIndicator = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptionCount, setSubscriptionCount] = useState(0);

  useEffect(() => {
    // Verificar suscripciones activas cada 2 segundos
    const interval = setInterval(() => {
      const activeSubscriptions = realtimeService.getActiveSubscriptions();
      setSubscriptionCount(activeSubscriptions.length);
      setIsConnected(activeSubscriptions.length > 0);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return null; // No mostrar nada si no hay conexión
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="wifi"
        size={16}
        iconColor="#28a745"
        style={styles.icon}
      />
      <Text style={styles.text}>Tiempo Real</Text>
      {subscriptionCount > 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{subscriptionCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  icon: {
    margin: 0,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default RealtimeIndicator; 