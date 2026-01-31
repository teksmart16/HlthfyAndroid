import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Chot App Delivery Service Integration
 * Manages delivery requests, tracking, and partner coordination
 */

// Chot API Configuration
const CHOT_API_BASE = process.env.CHOT_API_BASE || 'https://api.chot.app/v1';
const CHOT_API_KEY = process.env.CHOT_API_KEY || '';
const MERCHANT_ID = process.env.CHOT_MERCHANT_ID || '';

export interface DeliveryRequest {
  orderId: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
    name: string;
    phone: string;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
    address: string;
    name: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    weight?: number;
  }[];
  estimatedValue: number;
  paymentMethod: 'cod' | 'prepaid';
  specialInstructions?: string;
}

export interface DeliveryResponse {
  deliveryId: string;
  orderId: string;
  partnerName: string;
  partnerPhone: string;
  partnerRating: number;
  vehicleType: string;
  estimatedPickupTime: number; // in minutes
  estimatedDeliveryTime: number; // in minutes
  trackingUrl: string;
  status: 'assigned' | 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
}

export interface TrackingUpdate {
  deliveryId: string;
  status: string;
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  partnerName?: string;
  estimatedArrival?: number;
  notes?: string;
}

export interface PricingQuote {
  basePrice: number;
  distancePrice: number;
  weightPrice: number;
  totalPrice: number;
  estimatedTime: number;
  currency: string;
}

class DeliveryService {
  private api = axios.create({
    baseURL: CHOT_API_BASE,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CHOT_API_KEY}`,
      'X-Merchant-ID': MERCHANT_ID,
    },
  });

  /**
   * Get delivery pricing quote before confirming order
   */
  async getPricingQuote(
    pickupLocation: { lat: number; lng: number },
    dropoffLocation: { lat: number; lng: number },
    weight: number = 1 // default 1kg
  ): Promise<PricingQuote> {
    try {
      const response = await this.api.post<PricingQuote>('/pricing/quote', {
        pickup: pickupLocation,
        dropoff: dropoffLocation,
        weight,
        items: 1,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting pricing quote:', error);
      throw new Error('Failed to get delivery pricing');
    }
  }

  /**
   * Create a new delivery request
   */
  async createDelivery(deliveryRequest: DeliveryRequest): Promise<DeliveryResponse> {
    try {
      const payload = {
        merchant_id: MERCHANT_ID,
        order_id: deliveryRequest.orderId,
        pickup: deliveryRequest.pickupLocation,
        dropoff: deliveryRequest.dropoffLocation,
        items: deliveryRequest.items,
        value: deliveryRequest.estimatedValue,
        payment_type: deliveryRequest.paymentMethod === 'cod' ? 'cash' : 'prepaid',
        special_instructions: deliveryRequest.specialInstructions,
      };

      const response = await this.api.post<DeliveryResponse>('/delivery/create', payload);
      
      // Save delivery info locally
      await this.saveDeliveryInfo(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw new Error('Failed to create delivery request');
    }
  }

  /**
   * Get current delivery status
   */
  async getDeliveryStatus(deliveryId: string): Promise<DeliveryResponse> {
    try {
      const response = await this.api.get<DeliveryResponse>(`/delivery/${deliveryId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery status:', error);
      throw new Error('Failed to fetch delivery status');
    }
  }

  /**
   * Cancel a delivery request
   */
  async cancelDelivery(deliveryId: string, reason?: string): Promise<{ success: boolean }> {
    try {
      const response = await this.api.post(`/delivery/${deliveryId}/cancel`, {
        reason: reason || 'User requested cancellation',
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling delivery:', error);
      throw new Error('Failed to cancel delivery');
    }
  }

  /**
   * Track delivery in real-time with polling
   */
  async trackDelivery(deliveryId: string): Promise<TrackingUpdate> {
    try {
      const response = await this.api.get<TrackingUpdate>(`/delivery/${deliveryId}/track`);
      return response.data;
    } catch (error) {
      console.error('Error tracking delivery:', error);
      throw new Error('Failed to track delivery');
    }
  }

  /**
   * Subscribe to delivery updates (webhook setup)
   */
  async subscribeToUpdates(deliveryId: string, webhookUrl: string): Promise<{ subscriptionId: string }> {
    try {
      const response = await this.api.post('/delivery/subscribe', {
        delivery_id: deliveryId,
        webhook_url: webhookUrl,
        events: ['pickup', 'in_transit', 'delivered', 'failed'],
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to updates:', error);
      throw new Error('Failed to subscribe to delivery updates');
    }
  }

  /**
   * Rate delivery partner
   */
  async rateDelivery(
    deliveryId: string,
    rating: number,
    comment?: string
  ): Promise<{ success: boolean }> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await this.api.post(`/delivery/${deliveryId}/rate`, {
        rating,
        comment: comment || '',
      });
      return response.data;
    } catch (error) {
      console.error('Error rating delivery:', error);
      throw new Error('Failed to rate delivery');
    }
  }

  /**
   * Get estimated delivery time based on locations
   */
  async getEstimatedTime(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number
  ): Promise<{ estimatedMinutes: number; distance: number }> {
    try {
      const response = await this.api.get('/routing/estimate', {
        params: {
          pickup_lat: pickupLat,
          pickup_lng: pickupLng,
          dropoff_lat: dropoffLat,
          dropoff_lng: dropoffLng,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting estimated time:', error);
      throw new Error('Failed to get estimated delivery time');
    }
  }

  /**
   * Validate delivery address
   */
  async validateAddress(
    lat: number,
    lng: number,
    address: string
  ): Promise<{ isValid: boolean; serviceable: boolean; message?: string }> {
    try {
      const response = await this.api.post('/address/validate', {
        latitude: lat,
        longitude: lng,
        address,
      });
      return response.data;
    } catch (error) {
      console.error('Error validating address:', error);
      throw new Error('Failed to validate address');
    }
  }

  /**
   * Save delivery info to local storage
   */
  private async saveDeliveryInfo(delivery: DeliveryResponse): Promise<void> {
    try {
      const existingDeliveries = await AsyncStorage.getItem('deliveries');
      const deliveries = existingDeliveries ? JSON.parse(existingDeliveries) : [];
      deliveries.push({
        ...delivery,
        createdAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('deliveries', JSON.stringify(deliveries));
    } catch (error) {
      console.error('Error saving delivery info:', error);
    }
  }

  /**
   * Get all deliveries for current user
   */
  async getMyDeliveries(): Promise<DeliveryResponse[]> {
    try {
      const deliveries = await AsyncStorage.getItem('deliveries');
      return deliveries ? JSON.parse(deliveries) : [];
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      return [];
    }
  }

  /**
   * Clear delivery data
   */
  async clearDeliveries(): Promise<void> {
    try {
      await AsyncStorage.removeItem('deliveries');
    } catch (error) {
      console.error('Error clearing deliveries:', error);
    }
  }
}

export default new DeliveryService();
