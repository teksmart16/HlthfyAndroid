import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import AccountScreen from "./screens/AccountScreen";
import AuthScreen from "./screens/AuthScreen";
import AddressScreen from "./screens/AddressScreen";

// Import types
import { CartItem, Product, UserProfile, Address } from "./types";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'address' | 'manageAddresses'>('main');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Load stored data on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedAuth, storedUser, storedCart] = await Promise.all([
        AsyncStorage.getItem('isAuthenticated'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('cart'),
      ]);

      if (storedAuth === 'true' && storedUser) {
        setIsAuthenticated(true);
        setUserProfile(JSON.parse(storedUser));
      }

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.log('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (userData: any, token: string) => {
    const profile: UserProfile = {
      name: userData.name || 'User',
      email: userData.email || '',
      phone: userData.phone || '',
    };

    setIsAuthenticated(true);
    setUserProfile(profile);

    // Store authentication state
    await AsyncStorage.multiSet([
      ['isAuthenticated', 'true'],
      ['userProfile', JSON.stringify(profile)],
      ['authToken', token],
    ]);
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setCart([]);

    // Clear stored data
    await AsyncStorage.multiRemove([
      'isAuthenticated',
      'userProfile',
      'authToken',
      'cart',
    ]);
  };

  const handleAddToCart = async (product: Product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    let updatedCart: CartItem[];
    if (existingItemIndex >= 0) {
      updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    let updatedCart: CartItem[];
    if (quantity <= 0) {
      updatedCart = cart.filter(item => item.id !== productId);
    } else {
      updatedCart = cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    }

    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty! Please add some items first.');
      return;
    }
    // Navigate to address selection
    setCurrentScreen('address');
  };

  const handleAddressSelected = (address: Address) => {
    setSelectedAddress(address);
    // Show checkout confirmation with address
    Alert.alert(
      "Confirm Order",
      `Deliver to: ${address.name}\n${address.addressLine1}, ${address.city}\nPhone: ${address.phone}\n\nTotal: ₹${calculateTotalPrice()}\n\nProceed with order?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setCurrentScreen('main')
        },
        {
          text: "Place Order",
          onPress: () => {
            Alert.alert(
              "Order Placed!",
              `Your order has been placed successfully!\n\nDelivery Address:\n${address.name}\n${address.addressLine1}, ${address.city}\n\nThank you for shopping with Hlthfy!`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    setCart([]);
                    setCurrentScreen('main');
                    AsyncStorage.removeItem('cart');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const calculateTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
        <StatusBar style="auto" />
      </>
    );
  }

  if (currentScreen === 'address') {
    return (
      <>
        <AddressScreen
          onAddressSelected={handleAddressSelected}
          onGoBack={() => setCurrentScreen('main')}
          isCheckout={true}
        />
        <StatusBar style="auto" />
      </>
    );
  }

  if (currentScreen === 'manageAddresses') {
    return (
      <>
        <AddressScreen
          onGoBack={() => setCurrentScreen('main')}
          isCheckout={false}
        />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#059669",
          tabBarInactiveTintColor: "#6B7280",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E7EB",
            borderTopWidth: 1,
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={() => <HomeScreen onAddToCart={handleAddToCart} />}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
        
        <Tab.Screen
          name="Cart"
          component={() => (
            <CartScreen
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onCheckout={handleCheckout}
              totalPrice={calculateTotalPrice()}
            />
          )}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <View style={styles.cartIconContainer}>
                <Text style={{ color, fontSize: 20 }}>🛒</Text>
                {cart.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cart.length}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        
        <Tab.Screen
          name="Account"
          component={() => (
            userProfile && (
              <AccountScreen
                userProfile={userProfile}
                onLogout={handleLogout}
                onManageAddresses={() => setCurrentScreen('manageAddresses')}
              />
            )
          )}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Text style={{ color, fontSize: 20 }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#6B7280",
  },
  cartIconContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
