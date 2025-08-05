import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationContext } from '../context/NavigationContext';
import { deliveryService } from '../services/deliveryService';

const ProfileScreen = () => {
  const { userType, currentUser, onLogout } = useNavigationContext();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserStats = async () => {
    try {
      console.log('📊 Cargando estadísticas del usuario:', currentUser?.id, userType);
      
      const result = await deliveryService.getUserStats(currentUser?.id, userType);
      
      if (result.success) {
        setStats(result.stats);
      } else {
        console.error('❌ Error cargando estadísticas:', result.error);
      }
    } catch (error) {
      console.error('❌ Error en loadUserStats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadUserStats();
    }
  }, [currentUser?.id, userType]);

  const handleLogout = () => {
    console.log('🔄 Cerrando sesión desde ProfileScreen');
    onLogout && onLogout();
  };

  const userName = currentUser?.name || 'Usuario';
  const userEmail = currentUser?.email || 'usuario@email.com';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'confirmed': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptado';
      case 'completed': return 'Completado';
      case 'confirmed': return 'Confirmado';
      default: return 'Desconocido';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <Avatar.Text size={80} label={userInitials} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <Text style={styles.userType}>
              {userType === 'client' ? 'Cliente' : 'Motociclista'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Estadísticas */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Estadísticas</Text>
            {isLoading ? (
              <Text style={styles.loadingText}>Cargando estadísticas...</Text>
            ) : stats ? (
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.total}</Text>
                  <Text style={styles.statLabel}>
                    {userType === 'client' ? 'Total Envíos' : 'Total Entregas'}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.pending}</Text>
                  <Text style={styles.statLabel}>Pendientes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.completed}</Text>
                  <Text style={styles.statLabel}>Completados</Text>
                </View>
                {userType === 'driver' && (
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>${(stats.earnings || 0).toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Ganancias</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.errorText}>Error cargando estadísticas</Text>
            )}
          </Card.Content>
        </Card>

        {/* Información del usuario */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Información Personal</Text>
            <List.Item
              title="Nombre"
              description={userName}
              left={(props) => <List.Icon {...props} icon="account" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Email"
              description={userEmail}
              left={(props) => <List.Icon {...props} icon="email" />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Tipo de Usuario"
              description={userType === 'client' ? 'Cliente' : 'Motociclista'}
              left={(props) => <List.Icon {...props} icon={userType === 'client' ? 'account-box' : 'bicycle'} />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="ID de Usuario"
              description={currentUser?.id || 'N/A'}
              left={(props) => <List.Icon {...props} icon="identifier" />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Configuración */}
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Configuración</Text>
            <List.Item
              title="Notificaciones"
              description="Configurar notificaciones push"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
              onPress={() => alert('Funcionalidad en desarrollo')}
            />
            <Divider />
            <List.Item
              title="Privacidad"
              description="Configurar privacidad y seguridad"
              left={(props) => <List.Icon {...props} icon="shield" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
              onPress={() => alert('Funcionalidad en desarrollo')}
            />
            <Divider />
            <List.Item
              title="Ayuda y Soporte"
              description="Obtener ayuda y contactar soporte"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
              onPress={() => alert('Funcionalidad en desarrollo')}
            />
            <Divider />
            <List.Item
              title="Acerca de"
              description="Información de la aplicación"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              style={styles.listItem}
              onPress={() => alert('SobrApp v1.0.0\nDesarrollado con React Native y Expo')}
            />
          </Card.Content>
        </Card>

        {/* Botón de cerrar sesión */}
        <Card style={styles.logoutCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              icon="logout"
              buttonColor="#dc3545"
            >
              Cerrar Sesión
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  userType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    color: '#dc3545',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  listItem: {
    paddingVertical: 5,
  },
  settingsCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  logoutCard: {
    borderRadius: 15,
    elevation: 4,
  },
  logoutButton: {
    borderRadius: 10,
  },
}); 