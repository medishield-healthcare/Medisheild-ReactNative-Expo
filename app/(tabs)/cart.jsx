// app/(tabs)/cart.jsx  (ya app/cart.jsx depending on your structure)
//
// ✅ Cart items from CartContext
// ✅ Remove items
// ✅ Coins redemption (medishield coins)
// ✅ Coupon code input
// ✅ Price breakdown
// ✅ Razorpay payment → createOrder
// ✅ Shipping address form
// ✅ Web + Mobile responsive

import { useState, useCallback } from 'react';
import {
  View, Text, Image, Pressable, ScrollView,
  TextInput, ActivityIndicator, Platform,
  useWindowDimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axios';
import WebHeader from 'components/Header/header.web';

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  teal900:  '#0f4f4f',
  teal700:  '#0f766e',
  teal600:  '#0d9488',
  teal100:  '#ccfbf1',
  teal50:   '#f0fdfa',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50:  '#f8fafc',
  white:    '#ffffff',
  amber500: '#f59e0b',
  amber100: '#fef3c7',
  amber50:  '#fffbeb',
  green500: '#22c55e',
  green100: '#dcfce7',
  red500:   '#ef4444',
  red100:   '#fee2e2',
  bg:       '#f0fafa',
  shadow:   '0 2px 12px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 24px rgba(15,118,110,0.10)',
};

const SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE    = 99;

// ─────────────────────────────────────────────────────────────────────────────
// CART ITEM CARD
// ─────────────────────────────────────────────────────────────────────────────
function CartItem({ item, onRemove, isWeb }) {
  const [removing, setRemoving] = useState(false);
  const product  = item.product || {};
  const imgUrl   = product.thumbnail_url || product.image;
  const name     = product.name || 'Product';
  const subtotal = (item.price || 0) * (item.count || 1);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.variant);
    setRemoving(false);
  };

  return (
    <View style={{
      flexDirection: 'row', gap: 14,
      backgroundColor: T.white,
      borderRadius: 16, padding: 14,
      borderWidth: 1, borderColor: T.slate100,
      ...(isWeb ? { boxShadow: T.shadow } : {
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
      }),
    }}>
      {/* Image */}
      <View style={{
        width: 90, height: 90, borderRadius: 12,
        backgroundColor: T.slate50, overflow: 'hidden',
        borderWidth: 1, borderColor: T.slate100, flexShrink: 0,
      }}>
        {imgUrl ? (
          <Image source={{ uri: imgUrl }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="cube-outline" size={28} color={T.slate300} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '700', color: T.slate900, lineHeight: 20, marginBottom: 4 }}>
            {name}
          </Text>
          {product.short_description && (
            <Text numberOfLines={1} style={{ fontSize: 12, color: T.slate400, marginBottom: 6 }}>
              {product.short_description}
            </Text>
          )}
          {product.manufacturer && (
            <View style={{ alignSelf: 'flex-start', backgroundColor: T.teal50, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: T.teal100 }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: T.teal700 }}>{product.manufacturer}</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          {/* Qty badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12, color: T.slate500 }}>Qty:</Text>
            <View style={{ backgroundColor: T.slate100, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: T.slate800 }}>{item.count}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
            <Text style={{ fontSize: 12, color: T.slate400 }}>₹</Text>
            <Text style={{ fontSize: 17, fontWeight: '900', color: T.teal700 }}>
              {subtotal.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </View>

      {/* Remove button */}
      <Pressable
        onPress={handleRemove}
        disabled={removing}
        style={{
          width: 32, height: 32, borderRadius: 10,
          backgroundColor: removing ? T.slate50 : T.red100,
          alignItems: 'center', justifyContent: 'center',
          alignSelf: 'flex-start',
          ...(isWeb ? { cursor: 'pointer' } : {}),
        }}
      >
        {removing
          ? <ActivityIndicator size="small" color={T.slate400} />
          : <Ionicons name="trash-outline" size={15} color={T.red500} />
        }
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHIPPING ADDRESS FORM
// ─────────────────────────────────────────────────────────────────────────────
function AddressForm({ value, onChange }) {
  const fields = [
    { key: 'name',     label: 'Full Name',    placeholder: 'John Doe',        half: false },
    { key: 'mobile',   label: 'Mobile',       placeholder: '9876543210',      half: true,  keyboard: 'phone-pad' },
    { key: 'address',  label: 'Address',      placeholder: 'Street, Area',    half: false },
    { key: 'city',     label: 'City',         placeholder: 'Lucknow',         half: true },
    { key: 'state',    label: 'State',        placeholder: 'Uttar Pradesh',   half: true },
    { key: 'country',  label: 'Country',      placeholder: 'India',           half: true },
    { key: 'pincode',  label: 'Pincode',      placeholder: '226001',          half: true,  keyboard: 'numeric' },
  ];

  return (
    <View style={{ gap: 12 }}>
      {/* Full-width fields */}
      {fields.filter(f => !f.half).map(f => (
        <View key={f.key}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: T.slate600, marginBottom: 5 }}>{f.label}</Text>
          <TextInput
            value={value[f.key] || ''}
            onChangeText={t => onChange({ ...value, [f.key]: t })}
            placeholder={f.placeholder}
            placeholderTextColor={T.slate400}
            keyboardType={f.keyboard || 'default'}
            style={{
              backgroundColor: T.white, borderRadius: 12,
              borderWidth: 1.5, borderColor: T.slate200,
              paddingHorizontal: 14, paddingVertical: 11,
              fontSize: 14, color: T.slate900,
              ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
            }}
          />
        </View>
      ))}

      {/* Half-width fields in pairs */}
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {fields.filter(f => f.half).map(f => (
          <View key={f.key} style={{ flex: 1, minWidth: 140 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: T.slate600, marginBottom: 5 }}>{f.label}</Text>
            <TextInput
              value={value[f.key] || ''}
              onChangeText={t => onChange({ ...value, [f.key]: t })}
              placeholder={f.placeholder}
              placeholderTextColor={T.slate400}
              keyboardType={f.keyboard || 'default'}
              style={{
                backgroundColor: T.white, borderRadius: 12,
                borderWidth: 1.5, borderColor: T.slate200,
                paddingHorizontal: 14, paddingVertical: 11,
                fontSize: 14, color: T.slate900,
                ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function PriceSummary({ cartTotal, shipping, discount, coinsUsed, couponDiscount, finalTotal }) {
  const rows = [
    { label: 'Subtotal',         value: cartTotal,       show: true },
    { label: 'Shipping',         value: shipping,        show: true,    prefix: shipping === 0 ? 'FREE' : null },
    { label: 'Coupon discount',  value: -couponDiscount, show: couponDiscount > 0, color: T.green500 },
    { label: 'Coins redeemed',   value: -coinsUsed,      show: coinsUsed > 0,      color: T.amber500 },
  ];

  return (
    <View style={{ gap: 12 }}>
      {rows.filter(r => r.show).map(r => (
        <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: T.slate600 }}>{r.label}</Text>
          {r.prefix ? (
            <Text style={{ fontSize: 14, fontWeight: '700', color: T.green500 }}>{r.prefix}</Text>
          ) : (
            <Text style={{ fontSize: 14, fontWeight: '700', color: r.color || T.slate900 }}>
              {r.value < 0 ? '-' : ''}₹{Math.abs(r.value).toLocaleString('en-IN')}
            </Text>
          )}
        </View>
      ))}

      <View style={{ height: 1, backgroundColor: T.slate100 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 17, fontWeight: '800', color: T.slate900 }}>Total</Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: T.teal700, letterSpacing: -0.3 }}>
          ₹{finalTotal.toLocaleString('en-IN')}
        </Text>
      </View>

      {shipping === 0 && cartTotal > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: T.green100, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 }}>
          <Ionicons name="checkmark-circle" size={15} color={T.green500} />
          <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '600' }}>
            You qualify for free shipping! 🎉
          </Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────
async function loadRazorpay() {
  if (Platform.OS !== 'web') {
    // For native, use react-native-razorpay package
    // npm install react-native-razorpay
    try {
      const RazorpayCheckout = require('react-native-razorpay').default;
      return RazorpayCheckout;
    } catch {
      Alert.alert('Error', 'Razorpay not installed. Run: npm install react-native-razorpay');
      return null;
    }
  }
  // Web: load Razorpay script
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const script = document.createElement('script');
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CART PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb     = Platform.OS === 'web';
  const isDesktop = width >= 1024;
  const isMobile  = width < 640;
  const px        = isDesktop ? 48 : isMobile ? 16 : 24;

  const { user }               = useAuth();
  const { items, cartTotal, loading, remove, clear, refetch } = useCart();

  // ── Local state ──
  const [address, setAddress]   = useState({
    name: '', mobile: '', address: '', city: '', state: 'Uttar Pradesh', country: 'India', pincode: '',
  });
  const [couponCode,    setCoupon]      = useState('');
  const [couponData,    setCouponData]  = useState(null); // { discount, type, _id }
  const [couponLoading, setCouponLoad] = useState(false);
  const [couponError,   setCouponErr]  = useState('');
  const [coinsToUse,    setCoinsToUse] = useState(0);
  const [checkoutStep,  setStep]       = useState('cart'); // 'cart' | 'address' | 'payment'
  const [paymentLoading,setPayLoading] = useState(false);
  const [orderSuccess,  setSuccess]    = useState(null);

  // ── Pre-fill name/mobile from user ──
  useState(() => {
    if (user) {
      setAddress(prev => ({
        ...prev,
        name:   `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        mobile: user.mobile || '',
      }));
    }
  });

  // ── Price calculations ──
  const shipping        = cartTotal >= SHIPPING_THRESHOLD ? 0 : cartTotal > 0 ? SHIPPING_CHARGE : 0;
  const couponDiscount  = couponData ? Math.round(
    couponData.type === 'percent'
      ? (cartTotal * couponData.discount / 100)
      : couponData.discount
  ) : 0;
  const maxCoins        = Math.min(user?.medishieldcoins || 0, Math.floor(cartTotal * 0.1)); // max 10% via coins
  const finalTotal      = Math.max(0, cartTotal + shipping - couponDiscount - coinsToUse);

  // ── Apply coupon ──
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoad(true);
    setCouponErr('');
    try {
      const { data } = await API.get(`/coupon/${couponCode.trim()}`);
      setCouponData(data);
    } catch {
      setCouponErr('Invalid or expired coupon code.');
      setCouponData(null);
    } finally {
      setCouponLoad(false);
    }
  };

  // ── Validate address ──
  const validateAddress = () => {
    const required = ['name', 'mobile', 'address', 'city', 'state', 'country', 'pincode'];
    for (const key of required) {
      if (!address[key]?.trim()) return `Please fill in ${key}`;
    }
    if (!/^\d{10}$/.test(address.mobile)) return 'Enter valid 10-digit mobile number';
    if (!/^\d{6}$/.test(address.pincode)) return 'Enter valid 6-digit pincode';
    return null;
  };

  // ── Initiate Razorpay payment ──
  const initiatePayment = useCallback(async () => {
    const addressErr = validateAddress();
    if (addressErr) {
      Alert.alert('Incomplete Address', addressErr);
      return;
    }

    setPayLoading(true);
    try {
      // Step 1: Create Razorpay order
      const { data: rzpOrder } = await API.post('/user/create-razorpay-order', {
        amount:   finalTotal,
        currency: 'INR',
      });

      // Step 2: Open Razorpay checkout
      const RazorpayCheckout = await loadRazorpay();
      if (!RazorpayCheckout) throw new Error('Razorpay failed to load');

      const options = {
        description:  'MediShield Order',
        image:        'https://your-logo-url.png', // replace with your logo
        currency:     'INR',
        key:          process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID, // add to .env
        amount:       rzpOrder.amount,
        order_id:     rzpOrder.id,
        name:         'MediShield Dental',
        prefill: {
          email:   user?.email || '',
          contact: address.mobile,
          name:    address.name,
        },
        theme: { color: '#0f766e' },
      };

      if (Platform.OS === 'web') {
        // Web Razorpay
        await new Promise((resolve, reject) => {
          const rzp = new RazorpayCheckout({
            ...options,
            handler: async (response) => {
              try {
                await completeOrder({
                  paymentId:        response.razorpay_payment_id,
                  orderId:          response.razorpay_order_id,
                  paymentSignature: response.razorpay_signature,
                  rzpAmount:        rzpOrder.amount,
                });
                resolve();
              } catch (e) { reject(e); }
            },
          });
          rzp.on('payment.failed', (r) => reject(new Error(r.error.description)));
          rzp.open();
        });
      } else {
        // Native Razorpay
        const response = await RazorpayCheckout.open(options);
        await completeOrder({
          paymentId:        response.razorpay_payment_id,
          orderId:          response.razorpay_order_id,
          paymentSignature: response.razorpay_signature,
          rzpAmount:        rzpOrder.amount,
        });
      }
    } catch (e) {
      console.error('Payment error:', e);
      Alert.alert('Payment Failed', e?.message || 'Something went wrong. Please try again.');
    } finally {
      setPayLoading(false);
    }
  }, [finalTotal, address, user, coinsToUse, couponData]);

  // ── Complete order after payment ──
  const completeOrder = async ({ paymentId, orderId, paymentSignature, rzpAmount }) => {
    const { data } = await API.post('/user/cart/create-order', {
      paymentId,
      orderId,
      paymentSignature,
      amount:          rzpAmount / 100,
      shipping,
      shippingAddress: address,
      msc:             coinsToUse,
      couponId:        couponData?._id || null,
      disc:            couponDiscount,
    });

    if (data.message === 'success') {
      clear();
      setSuccess({ orderId, amount: rzpAmount / 100 });
      setStep('success');
    }
  };

  // ── Success screen ──
  if (checkoutStep === 'success' && orderSuccess) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.teal50, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{
          backgroundColor: T.white, borderRadius: 28,
          padding: 40, alignItems: 'center', maxWidth: 440, width: '100%',
          ...(isWeb ? { boxShadow: T.shadowMd } : {}),
        }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: T.green100, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Ionicons name="checkmark-circle" size={48} color={T.green500} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: T.slate900, marginBottom: 8 }}>Order Placed!</Text>
          <Text style={{ fontSize: 14, color: T.slate500, textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
            Your order has been confirmed. You'll receive a confirmation email shortly.
          </Text>
          <View style={{ backgroundColor: T.slate50, borderRadius: 14, padding: 14, width: '100%', marginBottom: 24 }}>
            <Text style={{ fontSize: 12, color: T.slate400, textAlign: 'center' }}>Amount paid</Text>
            <Text style={{ fontSize: 26, fontWeight: '900', color: T.teal700, textAlign: 'center' }}>
              ₹{orderSuccess.amount.toLocaleString('en-IN')}
            </Text>
          </View>
          <Pressable
            onPress={() => router.replace('/')}
            style={{ backgroundColor: T.teal700, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14, width: '100%', alignItems: 'center' }}
          >
            <Text style={{ color: T.white, fontSize: 15, fontWeight: '800' }}>Continue Shopping</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
        {isWeb && <WebHeader />}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: T.teal100, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Ionicons name="bag-outline" size={36} color={T.teal700} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.slate900, marginBottom: 8 }}>Your cart is waiting</Text>
          <Text style={{ fontSize: 14, color: T.slate500, textAlign: 'center', marginBottom: 28, lineHeight: 22 }}>
            Sign in to view your cart and checkout
          </Text>
          <Pressable
            onPress={() => router.push('/login')}
            style={{ backgroundColor: T.teal700, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 }}
          >
            <Text style={{ color: T.white, fontSize: 15, fontWeight: '700' }}>Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Empty cart ──
  if (!loading && items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
        {isWeb && <WebHeader />}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: T.slate100, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Ionicons name="cart-outline" size={42} color={T.slate400} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.slate900, marginBottom: 8 }}>Your cart is empty</Text>
          <Text style={{ fontSize: 14, color: T.slate500, textAlign: 'center', marginBottom: 28 }}>
            Looks like you haven't added anything yet
          </Text>
          <Pressable
            onPress={() => router.push('/shop')}
            style={{ backgroundColor: T.teal700, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 }}
          >
            <Text style={{ color: T.white, fontSize: 15, fontWeight: '700' }}>Start Shopping</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main cart UI ──
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>

      {/* Header */}
      {isWeb ? <WebHeader /> : (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: T.white, borderBottomWidth: 1, borderBottomColor: T.slate100, gap: 12 }}>
          <Pressable onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: T.slate50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.slate200 }}>
            <Ionicons name="arrow-back" size={20} color={T.slate700} />
          </Pressable>
          <Text style={{ flex: 1, fontSize: 17, fontWeight: '800', color: T.slate900 }}>
            My Cart {items.length > 0 && <Text style={{ color: T.slate400 }}>({items.length})</Text>}
          </Text>
        </View>
      )}

      {/* Step indicator */}
      <View style={{ flexDirection: 'row', paddingHorizontal: px, paddingVertical: 12, gap: 0 }}>
        {['Cart', 'Address', 'Payment'].map((step, i) => {
          const steps = ['cart', 'address', 'payment'];
          const isDone    = steps.indexOf(checkoutStep) > i;
          const isCurrent = steps[i] === checkoutStep;
          return (
            <View key={step} style={{ flexDirection: 'row', alignItems: 'center', flex: i < 2 ? 1 : undefined }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: isDone || isCurrent ? T.teal700 : T.slate200,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDone
                    ? <Ionicons name="checkmark" size={13} color={T.white} />
                    : <Text style={{ fontSize: 11, fontWeight: '800', color: isCurrent ? T.white : T.slate500 }}>{i + 1}</Text>
                  }
                </View>
                <Text style={{ fontSize: 13, fontWeight: isCurrent ? '700' : '500', color: isCurrent ? T.teal700 : T.slate400 }}>
                  {step}
                </Text>
              </View>
              {i < 2 && <View style={{ flex: 1, height: 1.5, backgroundColor: isDone ? T.teal700 : T.slate200, marginHorizontal: 8 }} />}
            </View>
          );
        })}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={T.teal700} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{
            paddingHorizontal: px,
            flexDirection: isDesktop ? 'row' : 'column',
            gap: isDesktop ? 32 : 20,
            alignItems: 'flex-start',
          }}>

            {/* ── LEFT: Cart items / Address form ── */}
            <View style={{ flex: isDesktop ? 1 : undefined, width: '100%', gap: 16 }}>

              {checkoutStep === 'cart' && (
                <>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: T.slate900, marginTop: 8 }}>
                    Cart Items ({items.length})
                  </Text>
                  {items.map((item, i) => (
                    <CartItem
                      key={item.variant || i}
                      item={item}
                      onRemove={remove}
                      isWeb={isWeb}
                    />
                  ))}
                </>
              )}

              {checkoutStep === 'address' && (
                <View style={{
                  backgroundColor: T.white, borderRadius: 20,
                  padding: 20, borderWidth: 1, borderColor: T.slate100,
                  ...(isWeb ? { boxShadow: T.shadow } : {}),
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: T.slate900, marginBottom: 18 }}>
                    Delivery Address
                  </Text>
                  <AddressForm value={address} onChange={setAddress} />
                </View>
              )}
            </View>

            {/* ── RIGHT: Order summary ── */}
            <View style={{ width: isDesktop ? 340 : '100%', gap: 14 }}>

              {/* Coupon */}
              {checkoutStep === 'cart' && (
                <View style={{
                  backgroundColor: T.white, borderRadius: 18,
                  padding: 16, borderWidth: 1, borderColor: T.slate100,
                  ...(isWeb ? { boxShadow: T.shadow } : {}),
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: T.slate900, marginBottom: 12 }}>
                    Coupon Code
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      value={couponCode}
                      onChangeText={t => { setCoupon(t.toUpperCase()); setCouponErr(''); setCouponData(null); }}
                      placeholder="Enter coupon code"
                      placeholderTextColor={T.slate400}
                      autoCapitalize="characters"
                      style={{
                        flex: 1, backgroundColor: T.slate50, borderRadius: 10,
                        borderWidth: 1.5, borderColor: couponData ? T.green500 : T.slate200,
                        paddingHorizontal: 12, paddingVertical: 10,
                        fontSize: 14, fontWeight: '600', color: T.slate900,
                        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
                      }}
                    />
                    <Pressable
                      onPress={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      style={{
                        backgroundColor: T.teal700, borderRadius: 10,
                        paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
                        opacity: !couponCode.trim() ? 0.5 : 1,
                      }}
                    >
                      {couponLoading
                        ? <ActivityIndicator size="small" color={T.white} />
                        : <Text style={{ color: T.white, fontWeight: '700', fontSize: 13 }}>Apply</Text>
                      }
                    </Pressable>
                  </View>
                  {couponData && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <Ionicons name="checkmark-circle" size={15} color={T.green500} />
                      <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '600' }}>
                        Coupon applied! ₹{couponDiscount} off
                      </Text>
                    </View>
                  )}
                  {couponError && (
                    <Text style={{ fontSize: 12, color: T.red500, marginTop: 6 }}>{couponError}</Text>
                  )}
                </View>
              )}

              {/* Coins redemption */}
              {checkoutStep === 'cart' && (user?.medishieldcoins || 0) > 0 && (
                <View style={{
                  backgroundColor: T.amber50, borderRadius: 18,
                  padding: 16, borderWidth: 1, borderColor: T.amber100,
                  ...(isWeb ? { boxShadow: T.shadow } : {}),
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: T.amber100, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="logo-bitcoin" size={16} color={T.amber500} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400e' }}>
                        MediShield Coins
                      </Text>
                      <Text style={{ fontSize: 11, color: '#b45309' }}>
                        You have {user.medishieldcoins} coins · Max usable: {maxCoins} (10% of order)
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => setCoinsToUse(coinsToUse > 0 ? 0 : maxCoins)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 8,
                      backgroundColor: coinsToUse > 0 ? T.amber500 : T.white,
                      borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9,
                      borderWidth: 1, borderColor: coinsToUse > 0 ? T.amber500 : T.amber100,
                    }}
                  >
                    <Ionicons
                      name={coinsToUse > 0 ? 'checkmark-circle' : 'add-circle-outline'}
                      size={16}
                      color={coinsToUse > 0 ? T.white : T.amber500}
                    />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: coinsToUse > 0 ? T.white : '#92400e' }}>
                      {coinsToUse > 0 ? `Using ${maxCoins} coins  (−₹${maxCoins})` : `Use ${maxCoins} coins  (−₹${maxCoins})`}
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Price summary */}
              <View style={{
                backgroundColor: T.white, borderRadius: 18,
                padding: 18, borderWidth: 1, borderColor: T.slate100,
                ...(isWeb ? { boxShadow: T.shadow } : {}),
              }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: T.slate900, marginBottom: 16 }}>
                  Order Summary
                </Text>
                <PriceSummary
                  cartTotal={cartTotal}
                  shipping={shipping}
                  discount={0}
                  coinsUsed={coinsToUse}
                  couponDiscount={couponDiscount}
                  finalTotal={finalTotal}
                />
              </View>

              {/* CTA button */}
              <Pressable
                onPress={() => {
                  if (checkoutStep === 'cart')    setStep('address');
                  else if (checkoutStep === 'address') initiatePayment();
                }}
                disabled={paymentLoading || items.length === 0}
                style={{
                  backgroundColor: T.teal700,
                  borderRadius: 16, paddingVertical: 16,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: items.length === 0 ? 0.5 : 1,
                  ...(isWeb ? { boxShadow: '0 6px 20px rgba(15,118,110,0.28)', cursor: 'pointer' } : {
                    shadowColor: T.teal700, shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.28, shadowRadius: 12, elevation: 6,
                  }),
                }}
              >
                {paymentLoading ? (
                  <ActivityIndicator color={T.white} size="small" />
                ) : (
                  <>
                    <Ionicons
                      name={checkoutStep === 'address' ? 'lock-closed' : 'arrow-forward'}
                      size={18} color={T.white}
                    />
                    <Text style={{ color: T.white, fontSize: 16, fontWeight: '800' }}>
                      {checkoutStep === 'cart'
                        ? `Proceed to Address`
                        : `Pay ₹${finalTotal.toLocaleString('en-IN')}`
                      }
                    </Text>
                  </>
                )}
              </Pressable>

              {checkoutStep === 'address' && (
                <Pressable
                  onPress={() => setStep('cart')}
                  style={{ alignItems: 'center', paddingVertical: 10 }}
                >
                  <Text style={{ color: T.slate500, fontSize: 13 }}>← Back to cart</Text>
                </Pressable>
              )}

              {/* Security note */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Ionicons name="shield-checkmark-outline" size={14} color={T.slate400} />
                <Text style={{ fontSize: 12, color: T.slate400 }}>
                  Secured by Razorpay · 256-bit SSL
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}