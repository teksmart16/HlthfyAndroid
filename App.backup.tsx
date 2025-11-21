import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Alert } from 'react-native';

// Screens
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import AccountScreen from './screens/AccountScreen';

// Types
import { Product, CartItem, UserProfile } from './types';

// Services
import authService from './services/authService';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: '',
    phone: ''
  });
  const [cart, setCart] = useState<CartItem[]>([]);

  // Check for existing authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedAuth = await authService.getStoredAuth();
      if (storedAuth) {
        setUserProfile({
          name: storedAuth.userData.name || 'User',
          email: storedAuth.userData.email || '',
          phone: storedAuth.userData.phone || ''
        });
        authService.setAuthToken(storedAuth.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (userData: any, token: string) => {
    setUserProfile({
      name: userData.name || 'User',
      email: userData.email || '',
      phone: userData.phone || ''
    });
    authService.setAuthToken(token);
    setIsAuthenticated(true);
    Alert.alert('Welcome!', `Hello, ${userData.name}!`);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearAuthToken();
      setIsAuthenticated(false);
      setUserProfile({ name: 'Guest User', email: '', phone: '' });
      setCart([]);
      Alert.alert('Logged out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty!');
      return;
    }
    
    Alert.alert(
      'Checkout',
      `Order Total: ?${getTotalPrice()}\nThis is a demo app. Checkout functionality will be available soon!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCart([]); // Clear cart for demo
            Alert.alert('Order Placed!', 'Your order has been placed successfully!');
          }
        }
      ]
    );
  };

  // Tab bar icon component
  const TabIcon = ({ focused, name }: { focused: boolean; name: string }) => {
    const getIcon = () => {
      switch (name) {
        case 'Home': return '';
        case 'Cart': return '';
        case 'Account': return '';
        default: return '';
      }
    };

    return (
      <View style={styles.tabIcon}>
        <Text style={[styles.tabIconText, { opacity: focused ? 1 : 0.6 }]}>
          {getIcon()}
        </Text>
        {name === 'Cart' && getTotalItems() > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getTotalItems()}</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}> Hlthfy Groceries</Text>
        <Text style={styles.loadingSubtext}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} name={route.name} />,
          tabBarActiveTintColor: '#059669',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home">
          {() => <HomeScreen onAddToCart={addToCart} />}
        </Tab.Screen>
        <Tab.Screen name="Cart">
          {() => (
            <CartScreen
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onCheckout={handleCheckout}
              totalPrice={getTotalPrice()}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Account">
          {() => <AccountScreen userProfile={userProfile} onLogout={handleLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  authContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIconText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
