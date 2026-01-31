# Payment Gateway Update - QR Code Integration

## Changes Made

### 1. New Payment Screen (`screens/PaymentScreen.tsx`)
- Created a comprehensive payment gateway screen with two payment methods:
  - **QR Code Payment**: Display a QR code for fast UPI/Card payment
  - **Cash on Delivery (COD)**: Traditional payment on delivery

### 2. Updated App Flow
- Modified `App.tsx` to add a new screen state: `'payment'`
- Added `handlePaymentSuccess()` function to process successful payments
- Updated navigation flow: Cart → Address Selection → Payment → Order Confirmation

### 3. Updated Address Screen
- Modified to navigate directly to payment screen after address selection
- Added disabled state styling for the proceed button

## Features

### QR Code Payment
- Displays a QR code image (200x200px) with a border
- Shows payment amount
- Includes instructions for scanning
- Simulates payment processing with 2-second delay

### Price Breakdown
- Subtotal calculation
- Conditional delivery fee (Free for orders > ₹500)
- 5% tax calculation
- Total amount display

### Order Summary
- Lists all cart items with quantities and prices
- Displays delivery address
- Shows payment method selected

## Installation

### Step 1: Add QR Code Image
You need to add an actual QR.png file to the assets folder:

1. **Option A: Generate a QR Code**
   - Use a QR code generator (e.g., qrcode-monkey.com)
   - Create a QR code pointing to your payment gateway/UPI link
   - Export as PNG (minimum 200x200 pixels, ideally 300x300)
   - Save as `QR.png` in `assets/` folder

2. **Option B: Use an Existing QR Code**
   - Save your payment gateway's QR code as `QR.png`
   - Place it in `c:\Users\User\HlthfyAndroid\assets\QR.png`

### Step 2: Verify the Image Path
The PaymentScreen imports the QR code like this:
```tsx
<Image
  source={require('../assets/QR.png')}
  style={styles.qrCode}
/>
```

Make sure the file is named exactly `QR.png` (case-sensitive).

## File Structure
```
HlthfyAndroid/
├── screens/
│   ├── PaymentScreen.tsx (NEW)
│   ├── AddressScreen.tsx (UPDATED)
│   └── ...
├── assets/
│   └── QR.png (ADD YOUR QR CODE HERE)
└── App.tsx (UPDATED)
```

## Payment Flow
1. User adds items to cart
2. User proceeds to checkout
3. User selects delivery address
4. **NEW**: User is taken to payment screen
5. User selects payment method:
   - QR Code: Shows QR code to scan
   - COD: Confirms payment method
6. User confirms and pays
7. Order confirmation is shown
8. Cart is cleared

## Testing
1. Start the app: `npm start`
2. Add items to cart
3. Proceed to checkout
4. Select or add delivery address
5. Proceed to payment
6. Select payment method (QR or COD)
7. Confirm payment to see the order placed message

## Customization

### Change QR Code Image
- Replace the `QR.png` file in the assets folder
- No code changes needed

### Adjust Delivery Fee
In `PaymentScreen.tsx`, find the `calculatePriceDetails` function:
```tsx
const deliveryFee = subtotal > 500 ? 0 : 50; // Change the amount and threshold here
```

### Modify Tax Percentage
```tsx
const tax = Math.round(subtotal * 0.05); // Change 0.05 to desired percentage
```

### Change Colors
Update the color values in the `styles` object:
- Green: `#059669` (primary color)
- Light green: `#E5F9F0`
- Gray shades for text and borders

## Next Steps
1. Add the QR.png file to the assets folder
2. Run `npm start` to test the payment flow
3. Customize colors, fees, and tax as needed
4. Integrate with real payment gateway when ready

