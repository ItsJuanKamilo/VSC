import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingOverlay = ({ visible, message = 'Procesando...' }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.9)', 'rgba(118, 75, 162, 0.9)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.message}>{message}</Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  message: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default LoadingOverlay; 