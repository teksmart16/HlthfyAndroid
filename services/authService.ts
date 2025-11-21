import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://192.168.1.9:4000'; // Use the same IP as Expo server
// For iOS simulator use: 'http://localhost:4000'
// For Android emulator use: 'http://10.0.2.2:4000'

export interface LoginData {
  phone: string;
  password: string;
}

export interface RegisterData {
  phone: string;
  password: string;
  name: string;
  email?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  token: string;
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
  }

  async getStoredAuth(): Promise<{ token: string; userData: any } | null> {
    try {
      const [token, userData] = await AsyncStorage.multiGet(['authToken', 'userData']);
      if (token[1] && userData[1]) {
        return {
          token: token[1],
          userData: JSON.parse(userData[1])
        };
      }
    } catch (error) {
      console.error('Error retrieving stored auth:', error);
    }
    return null;
  }

  setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }
}

export default new AuthService();
