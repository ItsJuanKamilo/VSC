export interface User {
  id: string;
  name: string;
  email: string;
  user_type: 'client' | 'driver' | string;
  created_at: string;
}

export interface Delivery {
  id: string;
  client_id: string;
  driver_id: string | null;
  origin: string;
  destination: string;
  urgency: 'low' | 'normal' | 'high';
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  created_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  client: User;
  driver: User | null;
}

export interface UserStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  totalEarnings: number;
  availableEarnings: number;
  pendingEarnings: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: 'client' | 'driver';
}

export interface DeliveryData {
  origin: string;
  destination: string;
  urgency: 'low' | 'normal' | 'high';
  price: number;
  description?: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 