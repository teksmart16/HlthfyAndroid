# Payment Gateway Flow Diagram

## 📊 Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    HLTHFY APP                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Login/Register  │
                    │   (AuthScreen)   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Browse Products │
                    │  (HomeScreen)    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Add to Cart     │
                    │  (HomeScreen)    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  View Cart       │
                    │  (CartScreen)    │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼────────┐   ┌──────▼──────┐
            │ Continue Shop  │   │  Checkout   │
            │ (Tab Navigator)│   │   (Button)  │
            └────────────────┘   └──────┬──────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │ Select Address   │ ← NEW in flow
                              │ (AddressScreen)  │
                              └──────────────────┘
                                        │
                        ┌───────────────┴──────────────┐
                        │                              │
                  ┌─────▼──────┐            ┌─────────▼────┐
                  │ Add Address │ ←─────────┤  No Address  │
                  └─────┬──────┘            └──────────────┘
                        │
                        ▼
                  ┌──────────────────┐
                  │ Select Delivery  │
                  │    Address       │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  PAYMENT SCREEN  │ ← NEW SCREEN
                  │  (PaymentScreen) │
                  └────────┬─────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
      ┌────▼────┐     ┌────▼────┐    ┌────▼──────┐
      │ Review  │     │ Select  │    │ Select    │
      │ Summary │     │ Payment │    │ Payment   │
      └────┬────┘     │ Method  │    │ Method    │
           │          └────┬────┘    └────┬──────┘
           │               │              │
           ▼               ▼              ▼
      ┌──────────────────────────────────────┐
      │    PAYMENT METHOD SELECTION          │
      │  ┌────────────────────────────────┐  │
      │  │  ◯ QR CODE PAYMENT             │  │
      │  │    [Shows QR Code]             │  │
      │  └────────────────────────────────┘  │
      │  ┌────────────────────────────────┐  │
      │  │  ◯ CASH ON DELIVERY            │  │
      │  │    [Direct selection]          │  │
      │  └────────────────────────────────┘  │
      └────────────────┬─────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │ Confirm & Pay Button        │
         │ [Disabled until selected]   │
         └──────────────┬──────────────┘
                        │
                ┌───────┴────────┐
                │                │
         ┌──────▼─────┐    ┌─────▼──────┐
         │ QR Payment │    │ COD Payment│
         └──────┬─────┘    └─────┬──────┘
                │                │
         ┌──────▼──────┐    ┌─────▼──────┐
         │ 2 sec delay │    │ 1.5s delay │
         │ Processing  │    │ Processing │
         └──────┬──────┘    └─────┬──────┘
                │                │
                └────────┬────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Success Alert               │
        │  ✓ Order Placed Successfully!│
        │  Delivery: Address Details   │
        │  Expected Delivery: 2-3 days │
        └──────────────┬─────────────────┘
                       │
                       ▼
        ┌────────────────────────────────┐
        │  Cart Cleared                  │
        │  Return to Home (Tab Navigator)│
        │  Show Order Confirmation       │
        └────────────────────────────────┘
```

## 🔄 State Management Flow

```
App.tsx
│
├── isAuthenticated: false → true (after login)
│
├── currentScreen: 'main'
│   │
│   └── User clicks "Proceed to Checkout"
│       │
│       └── currentScreen: 'address'
│           │
│           └── AddressScreen renders
│               │
│               └── User selects address
│                   │
│                   └── handleAddressSelected()
│                       │
│                       └── setCurrentScreen('payment')
│                           │
│                           └── PaymentScreen renders
│                               │
│                               ├── User selects payment method
│                               │
│                               └── User clicks "Confirm & Pay"
│                                   │
│                                   └── handleQRPayment() or handleCODPayment()
│                                       │
│                                       └── onPaymentSuccess()
│                                           │
│                                           └── handlePaymentSuccess()
│                                               │
│                                               ├── Clear cart
│                                               ├── Reset selectedAddress
│                                               ├── setCurrentScreen('main')
│                                               │
│                                               └── Show Order Confirmation
```

## 📱 Component Hierarchy

```
App.tsx (Main Component)
│
├── Conditional Rendering Logic
│   ├── Loading Screen
│   ├── Auth Screen
│   ├── Address Screen (When currentScreen='address')
│   ├── Payment Screen (When currentScreen='payment') ← NEW
│   ├── Manage Addresses (When currentScreen='manageAddresses')
│   │
│   └── Tab Navigator (When currentScreen='main')
│       ├── Home Tab
│       │   └── HomeScreen
│       │       ├── Hero Banner
│       │       ├── Owner Profile
│       │       ├── Categories
│       │       └── Products List
│       │
│       ├── Cart Tab
│       │   └── CartScreen
│       │       ├── Cart Items
│       │       ├── Quantity Controls
│       │       └── Checkout Button
│       │
│       └── Account Tab
│           └── AccountScreen
│               ├── User Profile
│               ├── Menu Items
│               └── Logout Button
│
└── PaymentScreen (NEW COMPONENT)
    ├── Order Summary Card
    │   ├── Items List
    │   └── Price Breakdown
    ├── Delivery Address Card
    ├── Payment Methods
    │   ├── QR Code Payment
    │   │   └── QR Code Display
    │   └── Cash on Delivery
    ├── Terms & Conditions
    └── Footer with Confirm Button
```

## 💾 Data Flow Diagram

```
User Data Flow:
┌────────────┐
│ AsyncStorage│ ← Persisted Data
├────────────┤
│ isAuthenticated
│ userProfile
│ userAddresses
│ cart
│ authToken
└────────────┘
        ↑
        │
        └─── App.tsx State Management
                │
                ├─ isAuthenticated (boolean)
                ├─ userProfile (UserProfile | null)
                ├─ cart (CartItem[])
                ├─ currentScreen (string)
                ├─ selectedAddress (Address | null)
                └─ loading (boolean)

Payment Data Flow:
┌─────────────────────┐
│  calculateTotalPrice│ (cart items)
│  calculatePriceDetails│
│    ├─ subtotal
│    ├─ deliveryFee
│    ├─ tax
│    └─ finalTotal
└──────────────────────┘
        │
        ▼
┌─────────────────────┐
│ PaymentScreen       │
│  └─ Display totals
└──────────────────────┘
        │
        ▼
┌─────────────────────┐
│ User Confirmation   │
└──────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Clear cart from     │
│ App state           │
│ Remove from Storage │
└──────────────────────┘
```

## 🎯 Key Decision Points

```
USER JOURNEY:

Start
  │
  ├─ Has Account?
  │  ├─ No → Auth Screen → Login/Register
  │  └─ Yes → Home Screen
  │
  ├─ Browse Products?
  │  ├─ Yes → View product details → Add to cart
  │  └─ No → View cart
  │
  ├─ Go to Checkout?
  │  ├─ No → Continue shopping
  │  └─ Yes → Address Selection
  │
  ├─ Has Address?
  │  ├─ No → Add Address Form
  │  └─ Yes → Select Address
  │
  ├─ Proceed to Payment?
  │  └─ Yes → Payment Screen
  │
  ├─ Select Payment Method?
  │  ├─ QR Code
  │  │  └─ Show QR code image
  │  └─ Cash on Delivery
  │     └─ Direct confirmation
  │
  ├─ Confirm Order?
  │  ├─ No → Go back to address
  │  └─ Yes → Process payment
  │
  └─ Payment Success?
     ├─ Yes → Order confirmed
     │        ├─ Clear cart
     │        ├─ Show confirmation
     │        └─ Return to home
     │
     └─ No → Show error
            └─ Retry payment
```

## 📊 API Integration Points (Future)

```
Current: Mock Implementation
         ↓
├─ handleQRPayment()    [2s delay]
├─ handleCODPayment()   [1.5s delay]
│
↓
Future: Real API Integration
         │
         ├─ POST /api/payment/initiate
         │  ├─ Request: { amount, orderId, items, address }
         │  └─ Response: { success, transactionId, message }
         │
         ├─ POST /api/orders/create
         │  ├─ Request: { items, address, payment_method }
         │  └─ Response: { orderId, status, deliveryDate }
         │
         ├─ POST /api/payment/verify
         │  ├─ Request: { transactionId, orderId }
         │  └─ Response: { verified, status }
         │
         └─ GET /api/orders/{orderId}
            ├─ Request: { orderId }
            └─ Response: { status, tracking, deliveryDate }
```

## 🎨 UI State Transitions

```
Payment Screen States:
┌─────────────────┐
│ Initial State   │
│ No method       │
│ Confirm button  │
│ disabled        │
└────────┬────────┘
         │
         ├─ User selects QR
         │  └─ Card highlights
         │     └─ QR code expands
         │        └─ Button enabled
         │
         ├─ User selects COD
         │  └─ Card highlights
         │     └─ Button enabled
         │
         └─ User clicks Confirm
            ├─ isProcessing = true
            ├─ Button disabled
            ├─ Loading spinner shows
            └─ 2s animation
               └─ Success alert
                  └─ onPaymentSuccess()
```

---

This complete flow diagram shows every step of the payment process from browsing to order confirmation! 🎉
