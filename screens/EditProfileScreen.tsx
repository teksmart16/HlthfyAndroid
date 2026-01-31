import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, UserProfile } from '../types';

interface EditProfileScreenProps {
  userProfile: UserProfile | null;
  onGoBack: () => void;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ 
  userProfile, 
  onGoBack,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const storedAddresses = await AsyncStorage.getItem('userAddresses');
      if (storedAddresses) {
        const parsedAddresses = JSON.parse(storedAddresses);
        setAddresses(parsedAddresses);
        
        // Set default selected address
        const defaultAddress = parsedAddresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        } else if (parsedAddresses.length > 0) {
          setSelectedAddress(parsedAddresses[0].id);
        }
      }
    } catch (error) {
      console.log('Error loading addresses:', error);
    }
  };

  const saveProfile = async () => {
    if (!profileData.name.trim() || !profileData.phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedProfile: UserProfile = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const saveAddress = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || 
        !formData.addressLine1.trim() || !formData.city.trim() || 
        !formData.state.trim() || !formData.pincode.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      isDefault: formData.isDefault,
    };

    let updatedAddresses = [...addresses, newAddress];

    // If this is set as default, remove default from other addresses
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id,
      }));
    }

    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
      setShowForm(false);
      setSelectedAddress(newAddress.id);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
      });
      Alert.alert('Success', 'Address added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add address');
    }
  };

  const deleteAddress = async (addressId: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
          try {
            await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
            setAddresses(updatedAddresses);
            Alert.alert('Success', 'Address deleted successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
          }
        }
      }
    ]);
  };

  const setDefaultAddress = async (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
      setSelectedAddress(addressId);
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default address');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            👤 Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'addresses' && styles.activeTab]}
          onPress={() => setActiveTab('addresses')}
        >
          <Text style={[styles.tabText, activeTab === 'addresses' && styles.activeTabText]}>
            📍 Addresses
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={profileData.name}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profileData.email}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              value={profileData.phone}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>💾 Save Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'addresses' && (
          <View style={styles.form}>
            <View style={styles.addressHeader}>
              <Text style={styles.sectionTitle}>Delivery Addresses</Text>
              {!showForm && (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowForm(true)}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              )}
            </View>

            {showForm && (
              <View style={styles.formSection}>
                <Text style={styles.formTitle}>Add New Address</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Name *"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Phone *"
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  keyboardType="phone-pad"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Address Line 1 *"
                  value={formData.addressLine1}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, addressLine1: text }))}
                  multiline
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Address Line 2 (Optional)"
                  value={formData.addressLine2}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, addressLine2: text }))}
                  multiline
                />
                
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="City *"
                    value={formData.city}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="State *"
                    value={formData.state}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                  />
                </View>
                
                <TextInput
                  style={styles.input}
                  placeholder="Pincode *"
                  value={formData.pincode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
                  keyboardType="numeric"
                />

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Set as Default</Text>
                  <Switch
                    value={formData.isDefault}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isDefault: value }))}
                    trackColor={{ false: '#D1D5DB', true: '#059669' }}
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.saveButton, { flex: 1 }]}
                    onPress={saveAddress}
                  >
                    <Text style={styles.saveButtonText}>✓ Save Address</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.cancelButton, { flex: 1, marginLeft: 8 }]}
                    onPress={() => setShowForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[styles.addressCard, selectedAddress === address.id && styles.selectedAddress]}
                onPress={() => setSelectedAddress(address.id)}
              >
                <View style={styles.addressContent}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressText}>{address.phone}</Text>
                  <Text style={styles.addressText}>{address.addressLine1}</Text>
                  {address.addressLine2 && <Text style={styles.addressText}>{address.addressLine2}</Text>}
                  <Text style={styles.addressText}>{address.city}, {address.state} - {address.pincode}</Text>
                  
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>

                <View style={styles.addressActions}>
                  {!address.isDefault && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => setDefaultAddress(address.id)}
                    >
                      <Text style={styles.actionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteAddress(address.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {addresses.length === 0 && !showForm && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No addresses yet</Text>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => setShowForm(true)}
                >
                  <Text style={styles.saveButtonText}>+ Add Your First Address</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#059669', padding: 16, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { fontSize: 16, fontWeight: '600', color: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 4, margin: 16, borderRadius: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#059669' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: 'white' },
  content: { flex: 1, padding: 16 },
  form: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#059669', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white' },
  row: { flexDirection: 'row', gap: 10 },
  halfInput: { flex: 1 },
  saveButton: { backgroundColor: '#059669', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
  cancelButton: { backgroundColor: '#E5E7EB', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addButton: { backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  addButtonText: { color: 'white', fontWeight: '600' },
  formSection: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 2, borderColor: '#059669' },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#059669', marginBottom: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  switchLabel: { fontSize: 16, color: '#111827', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', marginTop: 16 },
  addressCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  selectedAddress: { borderColor: '#059669', backgroundColor: '#F0FDF4' },
  addressContent: { marginBottom: 12 },
  addressName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  addressText: { fontSize: 14, color: '#6B7280', marginBottom: 2 },
  defaultBadge: { backgroundColor: '#059669', marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  defaultBadgeText: { color: 'white', fontSize: 12, fontWeight: '600' },
  addressActions: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 6, paddingVertical: 8, alignItems: 'center' },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#059669' },
  deleteButton: { backgroundColor: '#FEE2E2' },
  deleteButtonText: { color: '#DC2626', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyStateText: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
});

export default EditProfileScreen;
