import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../../services/deliveryService';

const DeliveryCard = ({ 
  delivery, 
  userType, 
  onAccept, 
  onStart, 
  onComplete, 
  onCancel, 
  onConfirm,
  showActions = true 
}) => {
  const renderActionButtons = () => {
    if (!showActions) return null;

    if (userType === 'driver') {
      switch (delivery.status) {
        case 'accepted':
          return (
            <View style={styles.actionButtons}>
              <ActionButton
                mode="contained"
                onPress={() => onStart(delivery.id)}
                style={styles.startButton}
                labelStyle={styles.buttonLabel}
                text="En Camino"
              />
              <ActionButton
                mode="outlined"
                onPress={() => onCancel(delivery.id)}
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
                textColor="#dc3545"
                text="Cancelar"
              />
            </View>
          );
        
        case 'in_transit':
          return (
            <View style={styles.actionButtons}>
              <ActionButton
                mode="contained"
                onPress={() => onComplete(delivery.id)}
                style={styles.completeButton}
                labelStyle={styles.buttonLabel}
                text="Completar"
              />
              <ActionButton
                mode="outlined"
                onPress={() => onCancel(delivery.id)}
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
                textColor="#dc3545"
                text="Cancelar"
              />
            </View>
          );
        
        case 'pending':
          return (
            <ActionButton
              mode="contained"
              onPress={() => onAccept(delivery.id)}
              style={styles.acceptButton}
              labelStyle={styles.buttonLabel}
              text="Aceptar Envío"
            />
          );
        
        default:
          return null;
      }
    } else if (userType === 'client' && delivery.status === 'completed') {
      return (
        <ActionButton
          mode="contained"
          onPress={() => onConfirm(delivery.id)}
          style={styles.confirmButton}
          labelStyle={styles.buttonLabel}
          text="Confirmar Recepción"
        />
      );
    }
    return null;
  };

  return (
    <Card style={styles.deliveryCard}>
      <Card.Content>
        <View style={styles.deliveryHeader}>
          <Text style={styles.deliveryRoute}>
            {delivery.origin} → {delivery.destination}
          </Text>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(delivery.status) }}
            style={[styles.statusChip, { borderColor: getStatusColor(delivery.status) }]}
          >
            {getStatusText(delivery.status)}
          </Chip>
        </View>

        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryDate}>
            Creado: {new Date(delivery.created_at).toLocaleDateString()}
          </Text>
          
          {delivery.description && (
            <Text style={styles.deliveryDescription}>
              {delivery.description}
            </Text>
          )}

          <View style={styles.deliveryDetails}>
            <Chip
              mode="outlined"
              textStyle={{ color: getUrgencyColor(delivery.urgency_level) }}
              style={[styles.urgencyChip, { borderColor: getUrgencyColor(delivery.urgency_level) }]}
            >
              {getUrgencyText(delivery.urgency_level)}
            </Chip>

            {delivery.price > 0 && (
              <Text style={styles.deliveryPrice}>
                ${delivery.price.toLocaleString()}
              </Text>
            )}
          </View>

          {userType === 'driver' && delivery.client && (
            <Text style={styles.clientInfo}>
              Cliente: {delivery.client.name}
            </Text>
          )}

          {userType === 'client' && delivery.driver && (
            <Text style={styles.driverInfo}>
              Motociclista: {delivery.driver.name}
            </Text>
          )}
        </View>

        {renderActionButtons()}
      </Card.Content>
    </Card>
  );
};

const ActionButton = ({ mode, onPress, style, labelStyle, textColor, text }) => {
  const { Button } = require('react-native-paper');
  
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={style}
      labelStyle={labelStyle}
      textColor={textColor}
    >
      {text}
    </Button>
  );
};

const styles = StyleSheet.create({
  deliveryCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  deliveryRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  deliveryInfo: {
    marginBottom: 15,
  },
  deliveryDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  deliveryDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  deliveryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  urgencyChip: {
    alignSelf: 'flex-start',
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  clientInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  driverInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  buttonLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#fd7e14',
    borderRadius: 6,
    marginRight: 4,
    minHeight: 40,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#28a745',
    borderRadius: 6,
    marginRight: 4,
    minHeight: 40,
  },
  acceptButton: {
    backgroundColor: '#17a2b8',
    borderRadius: 6,
    marginTop: 10,
    minHeight: 40,
  },
  confirmButton: {
    backgroundColor: '#6f42c1',
    borderRadius: 6,
    marginTop: 10,
    minHeight: 40,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#dc3545',
    borderWidth: 1,
    borderRadius: 6,
    marginLeft: 4,
    minHeight: 40,
  },
});

export default DeliveryCard; 