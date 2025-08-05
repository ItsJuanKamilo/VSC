import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Pantallas principales
import HomeScreen from '../screens/Home/HomeScreen';
import DeliveriesScreen from '../screens/DeliveriesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Pantallas adicionales
import CreateDeliveryScreen from '../screens/CreateDeliveryScreen';
import AvailableDeliveriesScreen from '../screens/AvailableDeliveriesScreen';
import NavigationScreen from '../screens/NavigationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Home
const HomeStack = createStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="CreateDelivery" component={CreateDeliveryScreen} />
    <HomeStack.Screen name="AvailableDeliveries" component={AvailableDeliveriesScreen} />
    <HomeStack.Screen name="Navigation" component={NavigationScreen} />
  </HomeStack.Navigator>
);

// Stack para Deliveries
const DeliveriesStack = createStackNavigator();
const DeliveriesStackNavigator = () => (
  <DeliveriesStack.Navigator screenOptions={{ headerShown: false }}>
    <DeliveriesStack.Screen name="DeliveriesMain" component={DeliveriesScreen} />
    <DeliveriesStack.Screen name="Navigation" component={NavigationScreen} />
  </DeliveriesStack.Navigator>
);

// Stack para Profile
const ProfileStack = createStackNavigator();
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Deliveries') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{
          title: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Deliveries" 
        component={DeliveriesStackNavigator}
        options={{
          title: 'Envíos',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator}
        options={{
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 