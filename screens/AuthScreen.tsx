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
    email: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!formData.password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    if (activeTab === "register" && !formData.name.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    setLoading(true);
    try {
      // Simple mock authentication for demo purposes
      // In a real app, this would make API calls to your backend
      const mockResponse = {
        user: {
          id: "1",
          name: activeTab === "register" ? formData.name : "Demo User",
          phone: formData.phone,
          email: formData.email || ""
        },
        token: "demo-token-123"
      };
      
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
            <Text style={styles.headerText}> Hlthfy Groceries</Text>
            <Text style={styles.subHeaderText}>Welcome to fresh groceries</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
            >
              <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
            >
              <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>
                Register
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
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              placeholder="Password"
              secureTextEntry={true}
            />
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {activeTab === "login" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>
            
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
  headerText: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  subHeaderText: { fontSize: 14, color: "#6B7280" },
  tabContainer: { flexDirection: "row", backgroundColor: "#F3F4F6", borderRadius: 8, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: "#059669" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  activeTabText: { color: "white" },
  form: { gap: 16 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 14, fontSize: 16, backgroundColor: "#FFFFFF" },
  submitButton: { backgroundColor: "#059669", borderRadius: 8, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  switchText: { fontSize: 14, color: "#6B7280" },
  switchLink: { fontSize: 14, fontWeight: "600", color: "#059669" },
});

export default AuthScreen;