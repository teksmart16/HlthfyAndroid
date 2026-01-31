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
import { Address } from '../types';

interface AddressScreenProps {
  onAddressSelected?: (address: Address) => void;
  onGoBack: () => void;
  isCheckout?: boolean;
}

const AddressScreen: React.FC<AddressScreenProps> = ({ 
  onAddressSelected, 
  onGoBack, 
  isCheckout = false 
}) => {
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
      
      Alert.alert('Success', 'Address saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const handleProceed = () => {
    const address = addresses.find(addr => addr.id === selectedAddress);
    if (!address) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    if (onAddressSelected) {
      onAddressSelected(address);
    }
  };

  const renderAddressCard = (address: Address) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.addressCard,
        selectedAddress === address.id && styles.selectedAddress
      ]}
      onPress={() => setSelectedAddress(address.id)}
    >
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{address.name}</Text>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      <Text style={styles.addressPhone}>{address.phone}</Text>
      <Text style={styles.addressText}>
        {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}
      </Text>
      <Text style={styles.addressText}>
        {address.city}, {address.state} - {address.pincode}
      </Text>
      <View style={styles.radioContainer}>
        <View style={[
          styles.radio,
          selectedAddress === address.id && styles.radioSelected
        ]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCheckout ? 'Select Delivery Address' : 'Manage Addresses'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {!showForm && (
          <>
            {addresses.map(renderAddressCard)}
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.addButtonText}>+ Add New Address</Text>
            </TouchableOpacity>
          </>
        )}

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Add New Address</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
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
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set as default address</Text>
              <Switch
                value={formData.isDefault}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isDefault: value }))}
                trackColor={{ false: '#E5E7EB', true: '#059669' }}
                thumbColor={formData.isDefault ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveAddress}
              >
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {!showForm && isCheckout && addresses.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.proceedButton, !selectedAddress && styles.disabledButton]}
            onPress={handleProceed}
            disabled={!selectedAddress}
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#059669',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  selectedAddress: {
    borderColor: '#059669',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  defaultBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  addressPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  radioContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  radioSelected: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#059669',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  proceedButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});

export default AddressScreen;