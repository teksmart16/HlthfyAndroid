# Add QR Code Image

To complete the payment gateway setup, you need to add a QR code image file.

## Steps to Add QR Code:

### Option 1: Generate a QR Code Online
1. Go to https://www.qr-code-generator.com/ or https://qr.io/
2. Enter your UPI ID or payment link (example: `upi://pay?pa=yourupiid@bank&pn=NameOfPayee&am=amount`)
3. Generate the QR code
4. Download as PNG
5. Save it as `QR.png` in this directory

### Option 2: Use an Existing Payment Gateway QR
- Download your payment provider's QR code (Razorpay, PayU, etc.)
- Save as `QR.png` in this directory

### Option 3: Create a Sample UPI Link
For testing, create a UPI link with your UPI ID:
```
UPI: yourupiid@bank
```

The QR code file should be:
- **Filename**: QR.png (case-sensitive)
- **Location**: assets/QR.png
- **Format**: PNG
- **Size**: Minimum 200x200 pixels (recommended 300x300)
- **Content**: Should link to your payment system

Once you add the QR.png file, the payment screen will automatically display it when users select QR Code Payment.

## Testing Without QR Code
The app will work but show an error when trying to load the image. To avoid this during development:

Option A: Use a dummy image
- Create a simple image (200x200 PNG)
- Save it as QR.png

Option B: Update the code temporarily
If you want to test without the image, comment out the Image component in PaymentScreen.tsx:
```tsx
// <Image
//   source={require('../assets/QR.png')}
//   style={styles.qrCode}
// />
// <Text style={styles.qrInstructions}>Scan this QR code with any UPI app or your phone camera</Text>
```

## After Adding QR.png
1. The payment gateway will display the QR code
2. Users can scan it with their phone camera or UPI app
3. The amount (₹totalPrice) will be shown below the QR code
