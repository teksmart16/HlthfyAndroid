import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import deliveryService, { DeliveryResponse, TrackingUpdate } from '../services/deliveryService';

interface DeliveryTrackingScreenProps {
  deliveryId: string;
  onGoBack: () => void;
}

const DeliveryTrackingScreen: React.FC<DeliveryTrackingScreenProps> = ({
  deliveryId,
  onGoBack,
}) => {
  const [delivery, setDelivery] = useState<DeliveryResponse | null>(null);
  const [tracking, setTracking] = useState<TrackingUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchDeliveryStatus();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDeliveryStatus, 30000);
    return () => clearInterval(interval);
  }, [deliveryId]);

  const fetchDeliveryStatus = async () => {
    try {
      const deliveryData = await deliveryService.getDeliveryStatus(deliveryId);
      setDelivery(deliveryData);

      const trackingData = await deliveryService.trackDelivery(deliveryId);
      setTracking(trackingData);
    } catch (error) {
      console.error('Error fetching delivery status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveryStatus();
  };

  const handleRateDelivery = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    try {
      await deliveryService.rateDelivery(deliveryId, rating, 'Great delivery!');
      Alert.alert('Success', 'Thank you for rating this delivery!');
      setRating(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating');
    }
  };

  const handleCancelDelivery = () => {
    Alert.alert(
      'Cancel Delivery',
      'Are you sure you want to cancel this delivery?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await deliveryService.cancelDelivery(deliveryId, 'User requested cancellation');
              Alert.alert('Success', 'Delivery cancelled');
              onGoBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel delivery');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
      case 'pending':
        return '#FFA500';
      case 'picked_up':
      case 'in_transit':
        return '#059669';
      case 'delivered':
        return '#10B981';
      case 'failed':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      assigned: 'Partner Assigned',
      pending: 'Pending Pickup',
      picked_up: 'Order Picked Up',
      in_transit: 'On the Way',
      delivered: 'Delivered',
      failed: 'Delivery Failed',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Tracking</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading delivery status...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Tracking</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {delivery && (
          <>
            {/* Status Card */}
            <View style={styles.section}>
              <View
                style={[
                  styles.statusCard,
                  { borderLeftColor: getStatusColor(delivery.status) },
                ]}
              >
                <View style={styles.statusContent}>
                  <Text style={styles.statusLabel}>Current Status</Text>
                  <Text style={[styles.statusValue, { color: getStatusColor(delivery.status) }]}>
                    {getStatusLabel(delivery.status)}
                  </Text>
                </View>
                <View
                  style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}
                >
                  <Text style={styles.statusBadgeText}>
                    {delivery.status === 'in_transit' ? '📍' : '✓'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Delivery Partner Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Partner</Text>
              <View style={styles.partnerCard}>
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName}>{delivery.partnerName}</Text>
                  <Text style={styles.partnerPhone}>📞 {delivery.partnerPhone}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {delivery.partnerRating} rating</Text>
                    <Text style={styles.vehicleText}>🚗 {delivery.vehicleType}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Estimated Times */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estimated Times</Text>
              <View style={styles.timesContainer}>
                <View style={styles.timeCard}>
                  <Text style={styles.timeLabel}>Pickup in</Text>
                  <Text style={styles.timeValue}>{delivery.estimatedPickupTime} mins</Text>
                </View>
                <View style={styles.timeCard}>
                  <Text style={styles.timeLabel}>Delivery in</Text>
                  <Text style={styles.timeValue}>{delivery.estimatedDeliveryTime} mins</Text>
                </View>
              </View>
            </View>

            {/* Real-time Tracking */}
            {tracking && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live Location</Text>
                <View style={styles.trackingCard}>
                  {tracking.location && (
                    <>
                      <Text style={styles.trackingLabel}>Current Location</Text>
                      <Text style={styles.trackingCoords}>
                        Lat: {tracking.location.lat.toFixed(4)}, Lng: {tracking.location.lng.toFixed(4)}
                      </Text>
                    </>
                  )}
                  {tracking.estimatedArrival && (
                    <Text style={styles.arrivalText}>
                      Estimated arrival in {tracking.estimatedArrival} mins
                    </Text>
                  )}
                  {tracking.notes && (
                    <Text style={styles.notesText}>Note: {tracking.notes}</Text>
                  )}
                </View>
              </View>
            )}

            {/* Tracking URL */}
            {delivery.trackingUrl && (
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.trackingLinkButton}
                  onPress={() => {
                    // In a real app, use Linking to open the URL
                    Alert.alert('Tracking URL', delivery.trackingUrl);
                  }}
                >
                  <Text style={styles.trackingLinkText}>📍 View on Map</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Rating Section - Show after delivery */}
            {delivery.status === 'delivered' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rate This Delivery</Text>
                <View style={styles.ratingSection}>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        style={styles.starButton}
                      >
                        <Text style={[styles.star, rating >= star && styles.starFilled]}>
                          ⭐
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.rateButton, rating === 0 && styles.disabledButton]}
                    onPress={handleRateDelivery}
                    disabled={rating === 0}
                  >
                    <Text style={styles.rateButtonText}>Submit Rating</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Cancel Button - Show only if not delivered/failed */}
            {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
              <View style={styles.section}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelDelivery}>
                  <Text style={styles.cancelButtonText}>Cancel Delivery</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 24,
  },
  partnerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  partnerInfo: {
    marginVertical: 8,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  partnerPhone: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  vehicleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  trackingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  trackingCoords: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  arrivalText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
  },
  trackingLinkButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  trackingLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  ratingSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 8,
  },
  star: {
    fontSize: 32,
    opacity: 0.3,
  },
  starFilled: {
    opacity: 1,
  },
  rateButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  cancelButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default DeliveryTrackingScreen;
