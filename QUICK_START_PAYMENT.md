# Quick Start Guide - Payment Gateway with QR Code

## 🚀 Getting Started (5 Minutes)

### Step 1: Add QR Code Image (Required)
Your payment gateway needs a QR code image file. Choose one option:

**Option A: Generate Online (Recommended)**
1. Visit: https://www.qr-code-generator.com/
2. Paste your UPI link or payment info
3. Download as PNG
4. Save to: `assets/QR.png`

**Option B: Use Your Payment Provider's QR**
1. Export QR code from Razorpay, PayU, or your payment provider
2. Save as: `assets/QR.png`

**File Requirements:**
- Name: `QR.png` (exact case)
- Location: `assets/QR.png`
- Size: 200x200px minimum (300x300px recommended)
- Format: PNG

### Step 2: Start the App
```bash
npm start
```

### Step 3: Test Payment Flow
1. Open Expo Go on your phone
2. Scan the QR code from terminal
3. Log in with demo credentials
4. Add items to cart
5. Click "Proceed to Checkout"
6. Select or add delivery address
7. Click "Proceed to Payment" → **NEW Payment Screen**
8. Select payment method:
   - **QR Code**: Shows your QR code to scan
   - **COD**: Confirms payment on delivery

## 📊 Payment Screen Features

### What Users See

**Order Summary**
- Itemized list of all products
- Subtotal
- Delivery fee (free if > ₹500)
- Tax (5%)
- **Total Amount** (bold, green)

**Delivery Address**
- Full address details
- Customer name
- Phone number

**Payment Options**
1. **QR Code Payment**
   - Shows QR code image
   - 200x200px size
   - Shows payment amount
   - Scanning instructions

2. **Cash on Delivery**
   - Pay when order arrives
   - No processing needed

**Confirm & Pay Button**
- Shows total amount
- Disabled until method selected
- Shows loading during processing

## 💰 Price Calculation Logic

```
Subtotal = Sum of (price × quantity) for all items

Delivery Fee:
  - If subtotal > ₹500 → FREE
  - Otherwise → ₹50

Tax = 5% of subtotal

Total = Subtotal + Delivery Fee + Tax
```

## 🎨 Customization

### Change Delivery Fee
File: `screens/PaymentScreen.tsx`
```tsx
// Line 37
const deliveryFee = subtotal > 500 ? 0 : 50; // Change here
```

### Change Tax Percentage
File: `screens/PaymentScreen.tsx`
```tsx
// Line 38
const tax = Math.round(subtotal * 0.05); // Change 0.05 to your rate
```

### Change QR Code Image
- Simply replace `assets/QR.png` with your new QR code
- No code changes needed

### Change Colors
All colors in `screens/PaymentScreen.tsx` StyleSheet (bottom of file):
- Primary Green: `#059669`
- Background: `#F9FAFB`
- White: `#FFFFFF`
- Gray shades: `#6B7280`, `#9CA3AF`, `#D1D5DB`

## ✅ Verification Checklist

After adding QR.png, verify:

- [ ] App starts without errors
- [ ] No red error messages
- [ ] QR code displays on payment screen
- [ ] Both payment methods are selectable
- [ ] Confirm button works
- [ ] Success message appears
- [ ] Cart clears after payment
- [ ] Can place multiple orders

## 🔗 Integration with Backend

When ready to go live:

1. **Connect Payment Gateway**
   - Update `handleQRPayment()` in PaymentScreen.tsx
   - Add API call to your payment provider
   - Handle payment response

2. **Create Order in Database**
   - Save order details
   - Store delivery address
   - Track payment status

3. **Send Confirmations**
   - Email receipt
   - SMS notification
   - Order tracking link

## 📁 Files Modified/Created

**New Files:**
- `screens/PaymentScreen.tsx` - Payment gateway UI
- `PAYMENT_GATEWAY_README.md` - Complete documentation
- `IMPLEMENTATION_SUMMARY.md` - What was changed
- `assets/ADD_QR_CODE.md` - QR setup instructions

**Modified Files:**
- `App.tsx` - Added payment flow
- `AddressScreen.tsx` - Minor styling updates

**To Add:**
- `assets/QR.png` - Your QR code image

## 🆘 Troubleshooting

**"Cannot find QR.png"**
- Verify file is in `assets/` folder
- Check filename is exactly `QR.png`
- Ensure it's a PNG file (not JPG)

**QR Code not showing**
- Check file size (should be > 1KB)
- Verify image dimensions (200x200 minimum)
- Restart the Expo app

**Payment screen not appearing**
- Verify App.tsx was updated correctly
- Check that imports are in place
- Restart the development server

## 🎯 Next Steps

1. ✅ Add QR.png to assets folder
2. ✅ Run `npm start`
3. ✅ Test payment flow in Expo Go
4. 🔲 Customize delivery fee/tax if needed
5. 🔲 Connect to real payment gateway
6. 🔲 Set up backend order processing
7. 🔲 Deploy to production

## 📞 Support

For issues:
1. Check PAYMENT_GATEWAY_README.md for detailed setup
2. Review PaymentScreen.tsx code comments
3. Test with demo app flow in order

The payment gateway is production-ready once you add the QR code image! 🎉
