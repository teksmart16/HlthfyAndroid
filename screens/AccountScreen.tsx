import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { UserProfile } from "../types";

interface AccountScreenProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onManageAddresses: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onLogout, onManageAddresses }) => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: onLogout }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userProfile.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profilePhone}>{userProfile.phone}</Text>
            {userProfile.email && <Text style={styles.profileEmail}>{userProfile.email}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuTitle}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={onManageAddresses}>
          <Text style={styles.menuTitle}>Manage Addresses</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuTitle}>Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuTitle}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}> Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { backgroundColor: "#059669", padding: 20, paddingTop: 50 },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#10B981", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 24, fontWeight: "bold", color: "white" },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 4 },
  profilePhone: { fontSize: 14, color: "#E5F9F0", marginBottom: 2 },
  profileEmail: { fontSize: 14, color: "#E5F9F0" },
  menuContainer: { padding: 16 },
  menuItem: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 8 },
  menuTitle: { fontSize: 16, color: "#111827" },
  logoutButton: { backgroundColor: "#EF4444", borderRadius: 12, padding: 16, margin: 16, alignItems: "center" },
  logoutButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
});

export default AccountScreen;