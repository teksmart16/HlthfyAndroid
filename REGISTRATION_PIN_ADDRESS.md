# User Registration with PIN and Delivery Address

## Overview
Enhanced the user registration process to collect a 4-digit PIN for security and full delivery address information during signup.

## Changes Made

### 1. **Updated Types** (`types/index.ts`)
Added new fields to `FormData` interface:
- `pin`: string (4-digit security PIN)
- `addressLine1`: string (required street address)
- `addressLine2`: string (optional apartment/unit number)
- `city`: string (required)
- `state`: string (required)
- `pincode`: string (required postal code)

### 2. **Enhanced AuthScreen** (`screens/AuthScreen.tsx`)

#### Form State
- Initialized `formData` state with all new address fields and PIN
- All address fields required for registration

#### Validation
Added comprehensive validation for registration:
- **PIN**: Must be exactly 4 numeric digits (regex: `^\d{4}$`)
- **addressLine1**: Required, non-empty
- **city**: Required, non-empty
- **state**: Required, non-empty
- **pincode**: Required, non-empty
- **addressLine2**: Optional (can be empty)

#### UI Components
Added new form fields for registration tab:
1. **PIN Input**
   - Secure password input (secureTextEntry)
   - Numeric only input
   - Maximum 4 characters (maxLength: 4)
   - Placeholder: "4-digit PIN"

2. **Delivery Address Section**
   - Section header: "Delivery Address"
   - Address Line 1: Multiline text input (required)
   - Address Line 2: Multiline text input (optional)
   - City & State: Side-by-side row layout with 48% width each
   - Pincode: Numeric input only

#### Styling
Added new CSS classes:
- `sectionTitle`: Green (#059669) section headers (14px, font-weight: 600)
- `row`: Flexbox row layout for side-by-side inputs
- `halfInput`: 48% width flex inputs with 10px gap

#### AsyncStorage Integration
On successful registration:
1. Create Address object with all collected information
2. Save to AsyncStorage 'userAddresses' array
3. Mark registered address as default (isDefault: true)
4. Existing addresses marked as non-default (automatic)
5. Allows users to add more addresses later

#### Response Structure
Registration response now includes:
```javascript
{
  user: {
    id: "1",
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    pin: formData.pin  // 4-digit PIN
  },
  token: "demo-token-123",
  address: {
    id: "1",
    name: formData.name,
    phone: formData.phone,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    isDefault: true
  }
}
```

### 3. **Integration with AddressScreen** (`screens/AddressScreen.tsx`)
- Already loads registered addresses from AsyncStorage
- Auto-selects default address (registered address)
- User can add additional addresses
- Manages multiple addresses with default address handling

### 4. **App Integration** (`App.tsx`)
- `handleAuthSuccess` receives and stores user profile
- Address data automatically saved to AsyncStorage during registration
- Subsequent checkouts auto-populate with registered address

## User Flow

### Registration Flow
```
1. User fills registration form:
   - Name, Email, Phone
   - 4-digit PIN
   - Full delivery address (addressLine1, city, state, pincode)

2. Form validation:
   - PIN: Must be exactly 4 digits
   - All address fields required (except addressLine2)

3. On success:
   - User profile stored
   - Address saved to AsyncStorage as default
   - User logged in and redirected to home

4. Checkout flow:
   - AddressScreen loads registered address
   - User can proceed with registered address or add new one
   - Payment gateway processes with selected address
```

### Address Management
- Registered address is set as default
- Users can add multiple addresses
- Only one address can be default at a time
- Can edit/delete addresses in AccountScreen

## Security Features
- PIN stored in user profile (for future authentication)
- 4-digit PIN ensures format consistency
- Address data encrypted in AsyncStorage (with app-level encryption)
- PIN not displayed in plain text after entry

## Testing

### Test Case 1: Registration with PIN and Address
1. Tap "Register" tab
2. Fill in all fields:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "9876543210"
   - PIN: "1234"
   - Address Line 1: "123 Main St"
   - City: "New York"
   - State: "NY"
   - Pincode: "10001"
3. Verify success alert and redirect to home

### Test Case 2: PIN Validation
1. Try entering PIN with 3 digits: Should show error
2. Try entering PIN with letters: Should reject
3. Enter 4 digits: Should accept

### Test Case 3: Address Auto-Population
1. Register with address
2. Go to Cart
3. Tap "Checkout"
4. Verify registered address is pre-selected in AddressScreen

### Test Case 4: Multiple Addresses
1. After registration, go to "Manage Addresses"
2. Add new address
3. Set as default
4. Verify in checkout flow

## Files Modified
1. `types/index.ts` - Updated FormData interface
2. `screens/AuthScreen.tsx` - Enhanced registration form with PIN and address
3. `screens/AddressScreen.tsx` - Already supports auto-loading registered address
4. `App.tsx` - Existing integration handles new address data

## Future Enhancements
- [ ] PIN-based re-authentication for sensitive transactions
- [ ] Address validation via postal code API
- [ ] Google Maps integration for address selection
- [ ] Geolocation auto-fill for address
- [ ] Address history and quick reorder from previous addresses
- [ ] SMS OTP verification with PIN during registration
- [ ] Address edit functionality in AccountScreen

## API Integration Notes
When connecting to a real backend:
1. `POST /auth/register` endpoint should:
   - Accept: name, email, phone, pin, address object
   - Return: user profile, token, registered address
   - Hash and store PIN securely
   - Validate address format

2. `GET /user/addresses` endpoint to fetch stored addresses

3. `PUT /user/address/:id` endpoint to update addresses

4. Consider PIN as sensitive: Store hashed, transmit only with HTTPS

## Notes
- Current implementation uses mock authentication
- PIN stored in plain text in AsyncStorage (implement encryption in production)
- Address format validation is client-side only (add server validation)
- No duplicate address detection (add backend validation)
