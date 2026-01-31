/**
 * Chot Delivery Service Configuration Helper
 * This file helps with environment setup and initialization
 */

// Load environment variables
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    console.warn(`Warning: Environment variable ${key} not set`);
    return '';
  }
  return value || defaultValue || '';
};

// Validate configuration
export const validateChotConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const apiBase = getEnvVariable('CHOT_API_BASE');
  const apiKey = getEnvVariable('CHOT_API_KEY');
  const merchantId = getEnvVariable('CHOT_MERCHANT_ID');

  if (!apiBase) {
    errors.push('CHOT_API_BASE not configured');
  }

  if (!apiKey) {
    errors.push('CHOT_API_KEY not configured');
  }

  if (!merchantId) {
    errors.push('CHOT_MERCHANT_ID not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Store configuration
export const chotConfig = {
  apiBase: getEnvVariable('CHOT_API_BASE', 'https://api.chot.app/v1'),
  apiKey: getEnvVariable('CHOT_API_KEY', ''),
  merchantId: getEnvVariable('CHOT_MERCHANT_ID', ''),
  
  // Default store location (update with your actual store coordinates)
  store: {
    name: 'Hlthfy Store',
    lat: parseFloat(getEnvVariable('STORE_LAT', '28.6139')),
    lng: parseFloat(getEnvVariable('STORE_LNG', '77.2090')),
    address: getEnvVariable('STORE_ADDRESS', 'Your Store Address'),
    phone: getEnvVariable('STORE_PHONE', '+91-XXXXXXXXXX'),
  },

  // Delivery settings
  delivery: {
    maxRadius: parseFloat(getEnvVariable('MAX_DELIVERY_RADIUS', '25')), // km
    fallbackFee: parseFloat(getEnvVariable('FALLBACK_DELIVERY_FEE', '50')), // rupees
    
    // Pricing rules (adjust as needed)
    pricing: {
      baseFee: 50,
      perKmRate: 5,
      perKgRate: 10,
      freeDeliveryAbove: 500, // rupees
    },

    // Time estimates
    timeEstimates: {
      minPickupTime: 15, // minutes
      maxPickupTime: 45,
      minDeliveryTime: 30,
      maxDeliveryTime: 120,
    },
  },

  // API endpoints
  endpoints: {
    pricing: '/pricing/quote',
    delivery: '/delivery/create',
    status: '/delivery/{id}/status',
    track: '/delivery/{id}/track',
    cancel: '/delivery/{id}/cancel',
    rate: '/delivery/{id}/rate',
    address: '/address/validate',
    routing: '/routing/estimate',
    subscribe: '/delivery/subscribe',
  },

  // Feature flags
  features: {
    realTimeTracking: true,
    webhookSupport: true,
    multipleVehicles: true,
    scheduledDelivery: false, // Coming soon
    groupDeliveries: false, // Coming soon
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    backoffMultiplier: 2,
    maxDelayMs: 10000,
  },

  // Polling configuration
  polling: {
    intervalMs: 30000, // 30 seconds
    maxDurationMs: 14400000, // 4 hours
  },

  // Logging
  debug: getEnvVariable('DEBUG_DELIVERY', 'false') === 'true',
};

// Logger helper
export const logger = {
  log: (message: string, data?: any) => {
    if (chotConfig.debug) {
      console.log(`[Chot Delivery] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any) => {
    console.error(`[Chot Delivery Error] ${message}`, error || '');
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[Chot Delivery Warning] ${message}`, data || '');
  },
};

// Initialize and validate configuration on app start
export const initializeChotConfig = (): boolean => {
  const validation = validateChotConfig();
  
  if (!validation.isValid) {
    logger.error('Chot configuration validation failed', validation.errors);
    return false;
  }

  logger.log('Chot configuration initialized successfully', {
    apiBase: chotConfig.apiBase,
    merchantId: chotConfig.merchantId,
    storeLocation: `${chotConfig.store.lat}, ${chotConfig.store.lng}`,
  });

  return true;
};

// Helper to calculate estimated delivery cost
export const calculateDeliveryCost = (
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number,
  weightKg: number = 1
): number => {
  // Calculate distance using Haversine formula
  const distance = calculateDistance(
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng
  );

  const { baseFee, perKmRate, perKgRate } = chotConfig.delivery.pricing;
  const distanceCost = distance * perKmRate;
  const weightCost = weightKg * perKgRate;

  return Math.round(baseFee + distanceCost + weightCost);
};

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper to format delivery time estimate
export const formatDeliveryTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper to get status badge color
export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    assigned: '#FFA500',
    pending: '#FFA500',
    picked_up: '#059669',
    in_transit: '#059669',
    delivered: '#10B981',
    failed: '#DC2626',
  };
  return colors[status] || '#6B7280';
};

// Helper to get status display text
export const getStatusText = (status: string): string => {
  const texts: { [key: string]: string } = {
    assigned: 'Partner Assigned',
    pending: 'Pending Pickup',
    picked_up: 'Order Picked Up',
    in_transit: 'On the Way',
    delivered: 'Delivered',
    failed: 'Delivery Failed',
  };
  return texts[status] || status;
};

// Export for use in application
export default chotConfig;
