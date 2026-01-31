/**
 * Chot Delivery Integration - Example Implementation
 * This file demonstrates how to use the Chot delivery service in your app
 */

import deliveryService, { DeliveryRequest } from '../services/deliveryService';
import chotConfig, { 
  logger, 
  calculateDeliveryCost, 
  calculateDistance, 
  formatDeliveryTime 
} from '../services/chotConfig';
import { CartItem, Address } from '../types';

/**
 * Example 1: Get Delivery Pricing Quote
 * Call this when user selects delivery address to show estimated cost
 */
export const getDeliveryQuote = async (
  customerLat: number,
  customerLng: number,
  cartItems: CartItem[]
) => {
  try {
    logger.log('Fetching delivery quote...', {
      pickup: `${chotConfig.store.lat}, ${chotConfig.store.lng}`,
      dropoff: `${customerLat}, ${customerLng}`,
    });

    // Calculate total weight from cart
    const totalWeight = cartItems.length * 0.5; // Approximate weight

    // Get quote from Chot API
    const quote = await deliveryService.getPricingQuote(
      {
        lat: chotConfig.store.lat,
        lng: chotConfig.store.lng,
      },
      {
        lat: customerLat,
        lng: customerLng,
      },
      totalWeight
    );

    logger.log('Delivery quote received', quote);

    // Calculate distance for display
    const distance = calculateDistance(
      chotConfig.store.lat,
      chotConfig.store.lng,
      customerLat,
      customerLng
    );

    return {
      deliveryFee: quote.totalPrice,
      distance: distance.toFixed(1),
      estimatedTime: formatDeliveryTime(quote.estimatedTime),
      raw: quote,
    };
  } catch (error) {
    logger.error('Failed to get delivery quote', error);
    
    // Return fallback pricing if API fails
    return {
      deliveryFee: chotConfig.delivery.fallbackFee,
      distance: 'Unknown',
      estimatedTime: '30-45 mins',
      raw: null,
    };
  }
};

/**
 * Example 2: Create Delivery Order
 * Call this after successful payment to create delivery request
 */
export const createOrderDelivery = async (
  orderId: string,
  cartItems: CartItem[],
  deliveryAddress: Address,
  totalAmount: number,
  paymentMethod: 'cod' | 'prepaid'
) => {
  try {
    logger.log('Creating delivery order...', { orderId, paymentMethod });

    const deliveryRequest: DeliveryRequest = {
      orderId,
      
      // Pickup location (your store)
      pickupLocation: {
        lat: chotConfig.store.lat,
        lng: chotConfig.store.lng,
        address: chotConfig.store.address,
        name: chotConfig.store.name,
        phone: chotConfig.store.phone,
      },

      // Dropoff location (customer address)
      dropoffLocation: {
        lat: 28.7041, // Note: Update this with actual GPS if available
        lng: 77.1025,
        address: `${deliveryAddress.addressLine1}${
          deliveryAddress.addressLine2 ? ', ' + deliveryAddress.addressLine2 : ''
        }`,
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
      },

      // Cart items
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        weight: 0.5, // Approximate weight per item
      })),

      // Order total
      estimatedValue: totalAmount,

      // Payment type
      paymentMethod,

      // Special instructions
      specialInstructions: 'Fresh organic products - handle with care. Keep refrigerated if needed.',
    };

    // Create delivery
    const delivery = await deliveryService.createDelivery(deliveryRequest);

    logger.log('Delivery created successfully', delivery);

    return {
      success: true,
      deliveryId: delivery.deliveryId,
      partnerName: delivery.partnerName,
      partnerPhone: delivery.partnerPhone,
      vehicleType: delivery.vehicleType,
      estimatedPickupTime: delivery.estimatedPickupTime,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime,
      trackingUrl: delivery.trackingUrl,
      status: delivery.status,
    };
  } catch (error) {
    logger.error('Failed to create delivery order', error);
    throw error;
  }
};

/**
 * Example 3: Track Delivery in Real-time
 * Call this with polling to get real-time updates
 */
export const startDeliveryTracking = (deliveryId: string, onUpdate: (update: any) => void) => {
  logger.log('Starting delivery tracking...', { deliveryId });

  // Poll for updates every 30 seconds
  const pollInterval = setInterval(async () => {
    try {
      const tracking = await deliveryService.trackDelivery(deliveryId);
      
      logger.log('Tracking update received', tracking);
      
      onUpdate({
        status: tracking.status,
        location: tracking.location,
        estimatedArrival: tracking.estimatedArrival,
        partnerName: tracking.partnerName,
        notes: tracking.notes,
        timestamp: tracking.timestamp,
      });

      // Stop tracking if delivered or failed
      if (tracking.status === 'delivered' || tracking.status === 'failed') {
        clearInterval(pollInterval);
        logger.log('Delivery tracking completed', { status: tracking.status });
      }
    } catch (error) {
      logger.error('Tracking update failed', error);
    }
  }, chotConfig.polling.intervalMs);

  // Return cleanup function
  return () => clearInterval(pollInterval);
};

/**
 * Example 4: Cancel Delivery
 * Call this to cancel an ongoing delivery
 */
export const cancelDeliveryOrder = async (
  deliveryId: string,
  reason: string = 'User requested cancellation'
) => {
  try {
    logger.log('Cancelling delivery...', { deliveryId, reason });

    const result = await deliveryService.cancelDelivery(deliveryId, reason);

    logger.log('Delivery cancelled successfully', result);

    return result;
  } catch (error) {
    logger.error('Failed to cancel delivery', error);
    throw error;
  }
};

/**
 * Example 5: Rate Delivery Partner
 * Call this after delivery is completed
 */
export const rateDeliveryPartner = async (
  deliveryId: string,
  rating: number,
  feedback: string = ''
) => {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    logger.log('Rating delivery...', { deliveryId, rating });

    const result = await deliveryService.rateDelivery(
      deliveryId,
      rating,
      feedback
    );

    logger.log('Delivery rated successfully', result);

    return result;
  } catch (error) {
    logger.error('Failed to rate delivery', error);
    throw error;
  }
};

/**
 * Example 6: Validate Delivery Address
 * Call this before showing delivery options
 */
export const validateDeliveryAddress = async (
  address: Address
) => {
  try {
    logger.log('Validating delivery address...', {
      address: address.addressLine1,
      city: address.city,
    });

    // For demo purposes, we'll use default coordinates
    // In production, use GPS coordinates from map selection
    const lat = 28.7041;
    const lng = 77.1025;

    const validation = await deliveryService.validateAddress(
      lat,
      lng,
      `${address.addressLine1}, ${address.city}, ${address.pincode}`
    );

    logger.log('Address validation result', validation);

    if (!validation.serviceable) {
      return {
        isValid: false,
        message: 'This address is outside our delivery area',
      };
    }

    return {
      isValid: true,
      message: 'Address is serviceable',
    };
  } catch (error) {
    logger.error('Address validation failed', error);
    return {
      isValid: false,
      message: 'Unable to validate address. Please try again.',
    };
  }
};

/**
 * Example 7: Get Estimated Delivery Time
 * Use this to show ETA to customers
 */
export const getEstimatedDeliveryTime = async (
  customerLat: number,
  customerLng: number
) => {
  try {
    logger.log('Getting estimated delivery time...');

    const estimate = await deliveryService.getEstimatedTime(
      chotConfig.store.lat,
      chotConfig.store.lng,
      customerLat,
      customerLng
    );

    logger.log('Estimated delivery time', estimate);

    return {
      estimatedMinutes: estimate.estimatedMinutes,
      distance: estimate.distance,
      formatted: formatDeliveryTime(estimate.estimatedMinutes),
    };
  } catch (error) {
    logger.error('Failed to get estimated time', error);
    return {
      estimatedMinutes: 45,
      distance: 'Unknown',
      formatted: '30-45 mins',
    };
  }
};

/**
 * Example 8: Complete Order-to-Delivery Flow
 * This shows how to use multiple methods together
 */
export const completeOrderFlow = async (
  orderId: string,
  cartItems: CartItem[],
  deliveryAddress: Address,
  totalAmount: number,
  customerLat: number,
  customerLng: number,
  paymentMethod: 'cod' | 'prepaid'
) => {
  try {
    // Step 1: Validate address
    console.log('Step 1: Validating address...');
    const addressValidation = await validateDeliveryAddress(deliveryAddress);
    
    if (!addressValidation.isValid) {
      throw new Error(addressValidation.message);
    }

    // Step 2: Get delivery quote
    console.log('Step 2: Getting delivery quote...');
    const quote = await getDeliveryQuote(customerLat, customerLng, cartItems);
    console.log('Delivery fee:', quote.deliveryFee);

    // Step 3: Create delivery order
    console.log('Step 3: Creating delivery order...');
    const delivery = await createOrderDelivery(
      orderId,
      cartItems,
      deliveryAddress,
      totalAmount,
      paymentMethod
    );
    console.log('Delivery created:', delivery.deliveryId);

    // Step 4: Start tracking
    console.log('Step 4: Starting real-time tracking...');
    const stopTracking = startDeliveryTracking(
      delivery.deliveryId,
      (update) => {
        console.log('Delivery update:', update);
        // Update UI with tracking info
      }
    );

    return {
      orderId,
      deliveryId: delivery.deliveryId,
      partnerName: delivery.partnerName,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime,
      trackingUrl: delivery.trackingUrl,
      stopTracking, // Call this to stop polling
    };
  } catch (error) {
    logger.error('Order flow failed', error);
    throw error;
  }
};

/**
 * Example 9: Error Handling Pattern
 * Shows how to handle different error scenarios
 */
export const handleDeliveryError = (error: any) => {
  const errorMessage = error.message || 'Unknown error occurred';

  if (errorMessage.includes('pricing')) {
    return {
      type: 'PRICING_ERROR',
      message: 'Unable to calculate delivery cost',
      action: 'RETRY',
    };
  }

  if (errorMessage.includes('address') || errorMessage.includes('serviceable')) {
    return {
      type: 'ADDRESS_ERROR',
      message: 'This address is outside our delivery area',
      action: 'SELECT_DIFFERENT_ADDRESS',
    };
  }

  if (errorMessage.includes('API') || errorMessage.includes('network')) {
    return {
      type: 'API_ERROR',
      message: 'Network error. Please try again.',
      action: 'RETRY',
    };
  }

  return {
    type: 'UNKNOWN_ERROR',
    message: errorMessage,
    action: 'CONTACT_SUPPORT',
  };
};

export default {
  getDeliveryQuote,
  createOrderDelivery,
  startDeliveryTracking,
  cancelDeliveryOrder,
  rateDeliveryPartner,
  validateDeliveryAddress,
  getEstimatedDeliveryTime,
  completeOrderFlow,
  handleDeliveryError,
};
