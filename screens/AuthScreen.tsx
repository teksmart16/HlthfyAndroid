import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormData } from "../types";
import { validatePhone, validatePassword, validateName, validateEmail } from "../utils/validation";
import authService from "../services/authService";

interface AuthScreenProps {
  onAuthSuccess: (userData: any, token: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    password: "",
    name: "",
    email: "",
    pin: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validation based on tab
    if (activeTab === "login") {
      // Login: PIN-only authentication
      if (!formData.pin?.trim()) {
        Alert.alert("Error", "Please enter your 4-digit PIN");
        return;
      }
      if (!/^\d{4}$/.test(formData.pin)) {
        Alert.alert("Error", "PIN must be exactly 4 digits");
        return;
      }
    } else {
      // Register: Full validation
      if (!formData.name.trim()) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }
      if (!formData.phone.trim()) {
        Alert.alert("Error", "Please enter your phone number");
        return;
      }
      if (!formData.pin?.trim()) {
        Alert.alert("Error", "Please enter a 4-digit PIN");
        return;
      }
      if (!/^\d{4}$/.test(formData.pin)) {
        Alert.alert("Error", "PIN must be exactly 4 digits");
        return;
      }
      if (!formData.addressLine1?.trim()) {
        Alert.alert("Error", "Please enter your delivery address");
        return;
      }
      if (!formData.city?.trim()) {
        Alert.alert("Error", "Please enter your city");
        return;
      }
      if (!formData.state?.trim()) {
        Alert.alert("Error", "Please enter your state");
        return;
      }
      if (!formData.pincode?.trim()) {
        Alert.alert("Error", "Please enter your pincode");
        return;
      }
    }

    setLoading(true);
    try {
      // Simple mock authentication for demo purposes
      // In a real app, this would make API calls to your backend
      const mockResponse = {
        user: {
          id: "1",
          name: activeTab === "register" ? formData.name : "Registered User",
          phone: activeTab === "register" ? formData.phone : "9876543210",
          email: activeTab === "register" ? formData.email || "" : "",
          pin: formData.pin
        },
        token: `demo-token-${formData.pin}`,
        address: activeTab === "register" ? {
          id: "1",
          name: formData.name,
          phone: formData.phone,
          addressLine1: formData.addressLine1 || "",
          addressLine2: formData.addressLine2 || "",
          city: formData.city || "",
          state: formData.state || "",
          pincode: formData.pincode || "",
          isDefault: true
        } : undefined
      };
      
      // If registering, save address to AsyncStorage
      if (activeTab === "register" && mockResponse.address) {
        const existingAddresses = await AsyncStorage.getItem("userAddresses");
        const addresses = existingAddresses ? JSON.parse(existingAddresses) : [];
        
        // Mark all existing addresses as non-default
        const updatedAddresses = addresses.map((addr: any) => ({ ...addr, isDefault: false }));
        
        // Add the new registered address as default
        updatedAddresses.push(mockResponse.address);
        
        await AsyncStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
      }
      
      onAuthSuccess(mockResponse.user, mockResponse.token);
    } catch (error: any) {
      Alert.alert("Error", "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>🛒 Hlthfy Groceries</Text>
            <Text style={styles.subHeaderText}>Fresh groceries, fast delivery</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
            >
              <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>
                🔐 Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
            >
              <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>
                ✏️ Register
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Full Name"
              />
            )}
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Email (Optional)"
                keyboardType="email-address"
              />
            )}
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.pin}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pin: text.slice(0, 4) }))}
                placeholder="4-Digit PIN *"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />
            )}
            {activeTab === "register" && (
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            )}
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.addressLine1}
                onChangeText={(text) => setFormData(prev => ({ ...prev, addressLine1: text }))}
                placeholder="Address Line 1 *"
                multiline
              />
            )}
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.addressLine2}
                onChangeText={(text) => setFormData(prev => ({ ...prev, addressLine2: text }))}
                placeholder="Address Line 2 (Optional)"
              />
            )}
            {activeTab === "register" && (
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formData.city}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                  placeholder="City *"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formData.state}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                  placeholder="State *"
                />
              </View>
            )}
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.pincode}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
                placeholder="Pincode *"
                keyboardType="numeric"
              />
            )}
            {activeTab === "login" && (
              <TextInput
                style={styles.input}
                value={formData.pin}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pin: text.slice(0, 4) }))}
                placeholder="Enter 4-Digit PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />
            )}
            {activeTab === "register" && (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Mobile Number *"
                keyboardType="phone-pad"
              />
            )}
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {activeTab === "login" ? "🔐 Sign In with PIN" : "✏️ Create Account"}
                </Text>
              )}
            </TouchableOpacity>
            
            {activeTab === "login" && (
              <View style={styles.registerPrompt}>
                <Text style={styles.registerText}>New to Hlthfy?</Text>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => setActiveTab("register")}
                >
                  <Text style={styles.registerButtonText}>👤 Register Now</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {activeTab === "login" 
                  ? "Don't have an account? " 
                  : "Already have an account? "
                }
              </Text>
              <TouchableOpacity
                onPress={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              >
                <Text style={styles.switchLink}>
                  {activeTab === "login" ? "Register" : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "white", borderRadius: 12, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  header: { alignItems: "center", marginBottom: 24 },
  headerText: { fontSize: 28, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  subHeaderText: { fontSize: 14, color: "#6B7280" },
  tabContainer: { flexDirection: "row", backgroundColor: "#F3F4F6", borderRadius: 8, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: "#059669" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  activeTabText: { color: "white" },
  form: { gap: 16 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, backgroundColor: "#FFFFFF" },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#059669", marginTop: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  halfInput: { flex: 1 },
  submitButton: { backgroundColor: "#059669", borderRadius: 8, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
  registerPrompt: { backgroundColor: "#F0FDF4", borderWidth: 2, borderColor: "#059669", borderRadius: 8, padding: 16, marginTop: 16, alignItems: "center" },
  registerText: { fontSize: 16, fontWeight: "600", color: "#059669", marginBottom: 12 },
  registerButton: { backgroundColor: "#059669", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, width: "100%" },
  registerButtonText: { fontSize: 16, fontWeight: "600", color: "white", textAlign: "center" },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  switchText: { fontSize: 14, color: "#6B7280" },
  switchLink: { fontSize: 14, fontWeight: "600", color: "#059669" },
});

export default AuthScreen;