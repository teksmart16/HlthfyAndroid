# Payment Screen - Visual Layout

## Screen Structure

```
┌─────────────────────────────────────┐
│         PAYMENT SCREEN              │
├─────────────────────────────────────┤
│  ← Back      Payment                │  ← Header (Green #059669)
├─────────────────────────────────────┤
│                                     │
│  📋 ORDER SUMMARY                   │  ← Scrollable Content
│  ┌─────────────────────────────────┐│
│  │ Ghee (1)        ₹850            ││
│  │ Brown Sugar (2) ₹360            ││
│  │ ─────────────────────────────── ││
│  │ Subtotal                  ₹1210 ││
│  │ Delivery Fee              ₹0    ││
│  │ Tax (5%)                  ₹60   ││
│  │ ─────────────────────────────── ││
│  │ TOTAL AMOUNT              ₹1270││
│  └─────────────────────────────────┘│
│                                     │
│  📍 DELIVERY ADDRESS                │
│  ┌─────────────────────────────────┐│
│  │ John Doe                        ││
│  │ 123 Main Street                 ││
│  │ Mumbai, Maharashtra - 400001    ││
│  │ 📞 +91-9876543210              ││
│  └─────────────────────────────────┘│
│                                     │
│  💳 PAYMENT METHOD                  │
│  ┌─ ◯ QR CODE PAYMENT ─────────────┐│
│  │   Fast & Secure UPI/Card        ││
│  │                                 ││
│  │   ┌─────────────────────────┐   ││
│  │   │    ██████████████████   │   ││
│  │   │    ██    QR CODE    ██   │   ││
│  │   │    ██████████████████   │   ││
│  │   └─────────────────────────┘   ││
│  │   Scan with any UPI app         ││
│  │   Amount: ₹1270                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─ ◯ CASH ON DELIVERY ───────────┐ │
│  │   Pay when you receive order   │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ✓ Agree to Terms & Conditions     │
│                                     │
├─────────────────────────────────────┤
│                                     │  ← Footer (White)
│  [CONFIRM & PAY ₹1270]              │
│                                     │
└─────────────────────────────────────┘
```

## Section Details

### 1. Header (Green Background)
- Back button to return to address selection
- "Payment" title
- Status bar aware padding

### 2. Order Summary Card (White)
- **Items List**
  - Product name
  - Quantity (x)
  - Individual total
  
- **Price Breakdown**
  - Subtotal (sum of items)
  - Delivery Fee (conditional)
  - Tax (5%)
  - Dividers between sections
  - Bold green total

### 3. Delivery Address Card (White)
- Recipient name (bold)
- Full address (multiple lines)
- Phone number with icon
- Selected address only shown

### 4. Payment Methods (White Cards)

#### QR Code Payment
- Title and description
- Radio button (selected = green)
- **Expanded View (When Selected):**
  - QR code image (200x200px)
  - Green border around QR
  - Scanning instructions
  - Amount to pay displayed

#### Cash on Delivery
- Title and description
- Radio button (selected = green)
- No expansion, static option

### 5. Terms & Conditions Section (White)
- Light information card
- Green left border
- Small text, center alignment

### 6. Footer (White, Fixed)
- White background
- Top border
- "CONFIRM & PAY" button
- Shows total amount
- Disabled until method selected
- Loading spinner during processing

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header Background | Green | #059669 |
| Primary Button | Green | #059669 |
| Selected Radio | Green | #059669 |
| Light Green (Hover) | Light Green | #F0FDF4 |
| Card Background | White | #FFFFFF |
| Primary Text | Dark Gray | #111827 |
| Secondary Text | Medium Gray | #6B7280 |
| Borders | Light Gray | #D1D5DB |
| Background | Very Light Gray | #F9FAFB |

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Header Title | 24px | Bold | White |
| Section Title | 18px | Bold | Dark Gray |
| Item Name | 14px | Regular | Dark Gray |
| Price | 14-18px | Bold | Dark Gray/Green |
| Total Amount | 18px | Bold | Green |
| Description Text | 12-14px | Regular | Medium Gray |
| Address Text | 14-16px | Regular | Dark Gray |

## Spacing

- Header padding: 50px top, 20px bottom, 20px sides
- Section margin: 24px bottom
- Card padding: 16px
- Content padding: 16px sides
- Item spacing: 8-12px

## Interactive States

### Button States
- **Normal**: Green background, white text
- **Disabled**: Gray background, gray text
- **Pressed**: Slightly darker green
- **Loading**: Shows spinner, disabled

### Radio Button States
- **Unselected**: White background, gray border
- **Selected**: Green background, green border

### Card Selection
- **Unselected**: White background, gray border
- **Selected**: Light green background, green border (2px)

## Payment Processing Flow

```
User Selects Method
        ↓
Disables Confirm Button
        ↓
Shows Loading Spinner
        ↓
2-3 Second Delay
        ↓
Success Alert + Details
        ↓
Clears Cart
        ↓
Returns to Home Screen
```

## Responsive Design

The layout is designed to work on:
- Small phones (320px width)
- Standard phones (375px width)
- Tablets (600px+ width)

Key responsive adjustments:
- Padding scales with screen size
- Text remains readable
- Images maintain aspect ratio
- Cards stack vertically
- Footer always visible

## Accessibility Features

- High contrast (white on green, dark text on white)
- Clear radio buttons and selection states
- Descriptive button labels
- Error states clearly marked
- No horizontal scrolling required
- Touch targets > 44x44px

## Dark Mode (Optional Future Enhancement)

When/if dark mode is implemented:
- Background: Very dark gray
- Cards: Dark gray
- Text: White/light gray
- Accents: Keep green or adjust
- Borders: Light gray on dark background
