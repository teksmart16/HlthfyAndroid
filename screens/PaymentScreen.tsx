import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { CartItem, Address } from '../types';
import deliveryService, { DeliveryRequest } from '../services/deliveryService';

interface PaymentScreenProps {
  cart: CartItem[];
  address: Address;
  totalPrice: number;
  onPaymentSuccess: () => void;
  onGoBack: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  cart,
  address,
  totalPrice,
  onPaymentSuccess,
  onGoBack,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<{ estimatedTime?: number; deliveryFee?: number } | null>(null);

  const calculatePriceDetails = () => {
    const subtotal = totalPrice;
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const finalTotal = subtotal + deliveryFee + tax;

    return {
      subtotal,
      deliveryFee,
      tax,
      finalTotal,
    };
  };

  const priceDetails = calculatePriceDetails();

  const handleCODPayment = async () => {
    setIsProcessing(true);
    
    // Create delivery request with Chot API for COD
    const createDeliveryAndProcess = async () => {
      try {
        // Prepare delivery request
        const deliveryRequest: DeliveryRequest = {
          orderId: `ORDER-${Date.now()}`,
          pickupLocation: {
            lat: 28.6139, // Your store location - replace with actual
            lng: 77.2090,
            address: 'Your Store Address',
            name: 'Hlthfy Store',
            phone: 'YOUR_STORE_PHONE',
          },
          dropoffLocation: {
            lat: 28.6139, // Customer location - update if you have GPS
            lng: 77.2090,
            address: `${address.addressLine1}, ${address.city}`,
            name: address.name,
            phone: address.phone,
          },
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            weight: 0.5,
          })),
          estimatedValue: priceDetails.finalTotal,
          paymentMethod: 'cod', // Cash on Delivery
          specialInstructions: 'Fresh organic products - handle with care. Payment to be collected on delivery.',
        };

        // Create delivery with Chot
        const delivery = await deliveryService.createDelivery(deliveryRequest);
        setDeliveryInfo({
          estimatedTime: delivery.estimatedDeliveryTime,
          deliveryFee: priceDetails.deliveryFee,
        });

        setIsProcessing(false);
        
        Alert.alert(
          'Order Placed',
          `Order confirmed with Cash on Delivery!\nAmount: ₹${priceDetails.finalTotal}\n\nDelivery Partner: ${delivery.partnerName}\nEstimated Delivery: ${delivery.estimatedDeliveryTime} mins\n\nTracking URL: ${delivery.trackingUrl}`,
          [
            {
              text: 'OK',
              onPress: onPaymentSuccess,
            },
          ]
        );
      } catch (error) {
        setIsProcessing(false);
        console.error('Delivery creation error:', error);
        
        // Fallback: Allow order to proceed even if delivery service fails
        Alert.alert(
          'Order Confirmed',
          `Order placed successfully!\nAmount: ₹${priceDetails.finalTotal}\n\nNote: Delivery assignment will be completed shortly.\nYou will receive tracking information via SMS.`,
          [
            {
              text: 'OK',
              onPress: onPaymentSuccess,
            },
          ]
        );
      }
    };

    createDeliveryAndProcess();
  };

  const handleConfirmOrder = () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (paymentMethod === 'cod') {
      handleCODPayment();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Status Indicator */}
        {paymentStatus && (
          <View style={[
            styles.statusBanner,
            paymentStatus === 'pending' && styles.statusPending,
            paymentStatus === 'success' && styles.statusSuccess,
            paymentStatus === 'failed' && styles.statusFailed,
          ]}>
            <Text style={styles.statusIcon}>
              {paymentStatus === 'pending' && '⏳'}
              {paymentStatus === 'success' && '✅'}
              {paymentStatus === 'failed' && '❌'}
            </Text>
            <Text style={styles.statusText}>
              {paymentStatus === 'pending' && 'Processing Payment...'}
              {paymentStatus === 'success' && 'Payment Successful!'}
              {paymentStatus === 'failed' && 'Payment Failed'}
            </Text>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Items ({cart.length})</Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.itemText}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{priceDetails.subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Delivery Fee {priceDetails.deliveryFee === 0 ? '(Free)' : ''}
              </Text>
              <Text style={styles.summaryValue}>₹{priceDetails.deliveryFee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>₹{priceDetails.tax}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{priceDetails.finalTotal}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{address.name}</Text>
            <Text style={styles.addressDetail}>{address.addressLine1}</Text>
            {address.addressLine2 && (
              <Text style={styles.addressDetail}>{address.addressLine2}</Text>
            )}
            <Text style={styles.addressDetail}>
              {address.city}, {address.state} - {address.pincode}
            </Text>
            <Text style={styles.addressPhone}>📞 {address.phone}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === 'cod' && styles.selectedPaymentCard,
            ]}
            onPress={() => !isProcessing && setPaymentMethod('cod')}
          >
            <View style={styles.paymentHeader}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentDesc}>Pay when you receive your order</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  paymentMethod === 'cod' && styles.radioSelected,
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Razorpay Payment */}
          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === 'razorpay' && styles.selectedPaymentCard,
            ]}
            onPress={() => {
              !isProcessing && setPaymentMethod('razorpay');
              Alert.alert('Coming Soon', 'Razorpay payment option is not yet available. Please use Cash on Delivery.');
            }}
          >
            <View style={styles.paymentHeader}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Razorpay</Text>
                <Text style={styles.paymentDesc}>Pay securely online</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  paymentMethod === 'razorpay' && styles.radioSelected,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.section}>
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By proceeding, you agree to our Terms & Conditions and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, isProcessing && styles.disabledButton]}
          onPress={handleConfirmOrder}
          disabled={isProcessing || !paymentMethod}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>
              Confirm & Pay ₹{priceDetails.finalTotal}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statusSuccess: {
    backgroundColor: '#D1FAE5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  statusFailed: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  addressDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedPaymentCard: {
    borderColor: '#059669',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  radioSelected: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  qrCodeContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  qrCodeBorder: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  qrAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 12,
  },
  termsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default PaymentScreen;
