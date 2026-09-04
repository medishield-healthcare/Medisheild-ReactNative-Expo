import { useState, useCallback } from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

import API from '@/api/axios';

import WebHeader from 'components/Header/header.web';
import C from '@/utils/theme';

// ═══════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════

const T = {
  teal950: '#083b3b',
  teal900: '#CD0F0F',
  teal800: '#115e59',
  teal700: '#CD0F0F',
  teal600: '#0d9488',
  teal500: '#14b8a6',

  teal100: '#ccfbf1',
  teal50: '#f0fdfa',

  slate950: '#020617',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',

  white: '#ffffff',

  amber500: '#f59e0b',
  amber100: '#fef3c7',
  amber50: '#fffbeb',

  green500: '#22c55e',
  green100: '#dcfce7',
  green50: '#f0fdf4',

  red500: '#ef4444',
  red100: '#fee2e2',
  red50: '#fef2f2',

  bg: '#f5fafa',

  shadow: '0 4px 20px rgba(15,23,42,0.06)',
  shadowMd: '0 10px 35px rgba(15,118,110,0.12)',
};

// ═══════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════

const SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

// ═══════════════════════════════════════════════
// CART ITEM
// ═══════════════════════════════════════════════

function CartItem({ item, onRemove, isWeb }) {
  const [removing, setRemoving] = useState(false);

  const product = item.product || {};

  const imgUrl = product.thumbnail_url || product.image;

  const name = product.name || 'Product';

  const quantity = item.count || 1;

  const unitPrice = item.price || 0;

  const subtotal = unitPrice * quantity;

  const handleRemove = async () => {
    setRemoving(true);

    await onRemove(item.variant);

    setRemoving(false);
  };

  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        backgroundColor: T.white,

        borderRadius: 20,

        borderWidth: 1,

        borderColor: T.slate200,

        padding: isWeb ? 16 : 13,

        flexDirection: 'row',

        gap: 15,

        ...(isWeb
          ? {
              boxShadow: '0 4px 18px rgba(15,23,42,0.05)',
            }
          : {
              shadowColor: '#000',

              shadowOffset: {
                width: 0,
                height: 2,
              },

              shadowOpacity: 0.04,

              shadowRadius: 8,

              elevation: 2,
            }),
      }}>
      {/* PRODUCT IMAGE */}

      <View
        style={{ fontFamily : 'Poppins_400Regular',
          width: isWeb ? 110 : 88,

          height: isWeb ? 110 : 88,

          borderRadius: 15,

          backgroundColor: T.slate50,

          overflow: 'hidden',

          borderWidth: 1,

          borderColor: T.slate100,

          alignItems: 'center',

          justifyContent: 'center',

          flexShrink: 0,
        }}>
        {imgUrl ? (
          <Image
            source={{
              uri: imgUrl,
            }}
            style={{ fontFamily : 'Poppins_400Regular',
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="cube-outline" size={30} color={T.slate300} />
        )}
      </View>

      {/* PRODUCT INFO */}

      <View
        style={{ fontFamily : 'Poppins_400Regular',
          flex: 1,

          minWidth: 0,

          justifyContent: 'space-between',
        }}>
        <View>
          {product.manufacturer && (
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                alignSelf: 'flex-start',

                backgroundColor: T.teal50,

                borderRadius: 999,

                paddingHorizontal: 8,

                paddingVertical: 3,

                marginBottom: 6,

                borderWidth: 1,

                borderColor: T.teal100,
              }}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: 9,

                  fontWeight: '800',

                  color: T.teal700,

                  letterSpacing: 0.5,
                }}>
                {product.manufacturer}
              </Text>
            </View>
          )}

          <Text
            numberOfLines={2}
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: isWeb ? 15 : 13,

              fontWeight: '800',

              color: T.slate900,

              lineHeight: isWeb ? 21 : 18,

              marginBottom: 4,
            }}>
            {name}
          </Text>

          {product.short_description && (
            <Text
              numberOfLines={1}
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 11,

                color: T.slate400,

                marginBottom: 5,
              }}>
              {product.short_description}
            </Text>
          )}
        </View>

        {/* BOTTOM */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent: 'space-between',

            marginTop: 10,

            gap: 10,
          }}>
          {/* QTY */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: 'row',

              alignItems: 'center',

              gap: 6,
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 11,

                color: T.slate500,

                fontWeight: '600',
              }}>
              Qty
            </Text>

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                minWidth: 32,

                height: 28,

                paddingHorizontal: 8,

                borderRadius: 8,

                backgroundColor: T.slate50,

                borderWidth: 1,

                borderColor: T.slate200,

                alignItems: 'center',

                justifyContent: 'center',
              }}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: 12,

                  fontWeight: '800',

                  color: T.slate800,
                }}>
                {quantity}
              </Text>
            </View>
          </View>

          {/* PRICE */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              alignItems: 'flex-end',
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 10,

                color: T.slate400,

                marginBottom: 1,
              }}>
              Item total
            </Text>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 17,

                fontWeight: '900',

                color: T.teal700,
              }}>
              ₹{subtotal.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </View>

      {/* REMOVE */}

      <Pressable
        onPress={handleRemove}
        disabled={removing}
        style={{ fontFamily : 'Poppins_400Regular',
          width: 34,

          height: 34,

          borderRadius: 10,

          backgroundColor: removing ? T.slate50 : T.red50,

          borderWidth: 1,

          borderColor: removing ? T.slate200 : T.red100,

          alignItems: 'center',

          justifyContent: 'center',

          alignSelf: 'flex-start',

          ...(isWeb
            ? {
                cursor: 'pointer',
              }
            : {}),
        }}>
        {removing ? (
          <ActivityIndicator size="small" color={T.slate400} />
        ) : (
          <Ionicons name="trash-outline" size={15} color={T.red500} />
        )}
      </Pressable>
    </View>
  );
}

// ═══════════════════════════════════════════════
// ADDRESS FORM
// ═══════════════════════════════════════════════

function AddressForm({ value, onChange }) {
  const fields = [
    {
      key: 'name',
      label: 'Full Name',
      placeholder: 'John Doe',
      half: false,
      icon: 'person-outline',
    },
    {
      key: 'mobile',
      label: 'Mobile Number',
      placeholder: '9876543210',
      half: true,
      keyboard: 'phone-pad',
      icon: 'call-outline',
    },
    {
      key: 'address',
      label: 'Address',
      placeholder: 'House / Street / Area',
      half: false,
      icon: 'location-outline',
    },
    {
      key: 'city',
      label: 'City',
      placeholder: 'Lucknow',
      half: true,
      icon: 'business-outline',
    },
    {
      key: 'state',
      label: 'State',
      placeholder: 'Uttar Pradesh',
      half: true,
      icon: 'map-outline',
    },
    {
      key: 'country',
      label: 'Country',
      placeholder: 'India',
      half: true,
      icon: 'globe-outline',
    },
    {
      key: 'pincode',
      label: 'Pincode',
      placeholder: '226001',
      half: true,
      keyboard: 'numeric',
      icon: 'navigate-outline',
    },
  ];

  const renderField = (field) => (
    <View
      key={field.key}
      style={{ fontFamily : 'Poppins_400Regular',
        flex: field.half ? 1 : undefined,

        minWidth: field.half ? 145 : undefined,
      }}>
      <Text
        style={{ fontFamily : 'Poppins_400Regular',
          fontSize: 11,

          fontWeight: '700',

          color: T.slate600,

          marginBottom: 6,
        }}>
        {field.label}
      </Text>

      <View
        style={{ fontFamily : 'Poppins_400Regular',
          height: 48,

          backgroundColor: T.slate50,

          borderRadius: 12,

          borderWidth: 1,

          borderColor: T.slate200,

          flexDirection: 'row',

          alignItems: 'center',

          paddingHorizontal: 12,
        }}>
        <Ionicons name={field.icon} size={16} color={T.slate400} />

        <TextInput
          value={value[field.key] || ''}
          onChangeText={(text) =>
            onChange({
              ...value,

              [field.key]: text,
            })
          }
          placeholder={field.placeholder}
          placeholderTextColor={T.slate400}
          keyboardType={field.keyboard || 'default'}
          style={{ fontFamily : 'Poppins_400Regular',
            flex: 1,

            marginLeft: 9,

            fontSize: 13,

            color: T.slate900,

            ...(Platform.OS === 'web'
              ? {
                  outlineStyle: 'none',
                }
              : {}),
          }}
        />
      </View>
    </View>
  );

  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        gap: 13,
      }}>
      {/* FULL WIDTH */}

      {fields.filter((field) => !field.half).map(renderField)}

      {/* HALF WIDTH */}

      <View
        style={{ fontFamily : 'Poppins_400Regular',
          flexDirection: 'row',

          gap: 12,

          flexWrap: 'wrap',
        }}>
        {fields.filter((field) => field.half).map(renderField)}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════
// PRICE SUMMARY
// ═══════════════════════════════════════════════

function PriceSummary({ cartTotal, shipping, discount, coinsUsed, couponDiscount, finalTotal }) {
  const rows = [
    {
      label: 'Subtotal',
      value: cartTotal,
      show: true,
    },

    {
      label: 'Shipping',
      value: shipping,
      show: true,

      prefix: shipping === 0 ? 'FREE' : null,
    },

    {
      label: 'Coupon discount',
      value: -couponDiscount,
      show: couponDiscount > 0,
      color: T.green500,
    },

    {
      label: 'Coins redeemed',
      value: -coinsUsed,
      show: coinsUsed > 0,
      color: T.amber500,
    },
  ];

  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        gap: 12,
      }}>
      {rows
        .filter((row) => row.show)
        .map((row) => (
          <View
            key={row.label}
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: 'row',

              justifyContent: 'space-between',

              alignItems: 'center',
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 13,

                color: T.slate600,
              }}>
              {row.label}
            </Text>

            {row.prefix ? (
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: 13,

                  fontWeight: '800',

                  color: T.green500,
                }}>
                {row.prefix}
              </Text>
            ) : (
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: 13,

                  fontWeight: '700',

                  color: row.color || T.slate900,
                }}>
                {row.value < 0 ? '-' : ''}₹{Math.abs(row.value).toLocaleString('en-IN')}
              </Text>
            )}
          </View>
        ))}

      <View
        style={{ fontFamily : 'Poppins_400Regular',
          height: 1,

          backgroundColor: T.slate200,

          marginVertical: 3,
        }}
      />

      {/* TOTAL */}

      <View
        style={{ fontFamily : 'Poppins_400Regular',
          flexDirection: 'row',

          justifyContent: 'space-between',

          alignItems: 'center',
        }}>
        <View>
          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 16,

              fontWeight: '800',

              color: T.slate900,
            }}>
            Total
          </Text>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 10,

              color: T.slate400,

              marginTop: 2,
            }}>
            Inclusive of applicable charges
          </Text>
        </View>

        <Text
          style={{ fontFamily : 'Poppins_400Regular',
            fontSize: 24,

            fontWeight: '900',

            color: T.teal700,

            letterSpacing: -0.5,
          }}>
          ₹{finalTotal.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* FREE SHIPPING */}

      {shipping === 0 && cartTotal > 0 && (
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            flexDirection: 'row',

            alignItems: 'center',

            gap: 7,

            backgroundColor: T.green50,

            borderRadius: 10,

            paddingHorizontal: 11,

            paddingVertical: 8,

            borderWidth: 1,

            borderColor: T.green100,
          }}>
          <Ionicons name="checkmark-circle" size={15} color={T.green500} />

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 11,

              color: '#15803d',

              fontWeight: '700',
            }}>
            You qualify for free shipping!
          </Text>
        </View>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════
// RAZORPAY
// ═══════════════════════════════════════════════

async function loadRazorpay() {
  if (Platform.OS !== 'web') {
    try {
      const RazorpayCheckout = require('react-native-razorpay').default;

      return RazorpayCheckout;
    } catch {
      Alert.alert('Error', 'Razorpay not installed. Run: npm install react-native-razorpay');

      return null;
    }
  }

  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(window.Razorpay);
    }

    const script = document.createElement('script');

    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve(window.Razorpay);

    script.onerror = () => resolve(null);

    document.body.appendChild(script);
  });
}

// ═══════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════

function CheckoutSteps({ checkoutStep, isMobile, px }) {
  const steps = [
    {
      key: 'cart',
      label: 'Cart',
      icon: 'cart-outline',
    },

    {
      key: 'address',
      label: 'Address',
      icon: 'location-outline',
    },

    {
      key: 'payment',
      label: 'Payment',
      icon: 'card-outline',
    },
  ];

  const currentIndex = steps.findIndex((step) => step.key === checkoutStep);

  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        paddingHorizontal: px,

        paddingVertical: 15,

        backgroundColor: T.white,

        borderBottomWidth: 1,

        borderBottomColor: T.slate100,
      }}>
      <View
        style={{ fontFamily : 'Poppins_400Regular',
          maxWidth: 1100,

          width: '100%',

          alignSelf: 'center',

          flexDirection: 'row',

          alignItems: 'center',

          justifyContent: 'center',
        }}>
        {steps.map((step, index) => {
          const done = currentIndex > index;

          const current = currentIndex === index;

          return (
            <View
              key={step.key}
              style={{ fontFamily : 'Poppins_400Regular',
                flexDirection: 'row',

                alignItems: 'center',

                flex: index < 2 ? 1 : undefined,
              }}>
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',

                  alignItems: 'center',

                  gap: 7,
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    width: isMobile ? 32 : 36,

                    height: isMobile ? 32 : 36,

                    borderRadius: 18,

                    backgroundColor: done || current ? T.teal700 : T.slate100,

                    alignItems: 'center',

                    justifyContent: 'center',

                    borderWidth: current ? 3 : 1,

                    borderColor: current ? T.teal100 : done ? T.teal700 : T.slate200,
                  }}>
                  <Ionicons
                    name={done ? 'checkmark' : step.icon}
                    size={isMobile ? 14 : 16}
                    color={done || current ? T.white : T.slate400}
                  />
                </View>

                {!isMobile && (
                  <View>
                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        fontSize: 11,

                        fontWeight: current || done ? '800' : '600',

                        color: current ? T.teal700 : done ? T.slate700 : T.slate400,
                      }}>
                      {step.label}
                    </Text>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        fontSize: 9,

                        color: T.slate400,

                        marginTop: 1,
                      }}>
                      {done ? 'Completed' : current ? 'Current step' : 'Upcoming'}
                    </Text>
                  </View>
                )}
              </View>

              {index < 2 && (
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    flex: 1,
                    height: 2,
                    backgroundColor: currentIndex > index ? T.teal700 : T.slate200,

                    marginHorizontal: isMobile ? 7 : 15,
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════
// MAIN CART PAGE
// ═══════════════════════════════════════════════

export default function CartPage() {
  const router = useRouter();

  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';

  const isDesktop = width >= 1024;

  const isTablet = width >= 640 && width < 1024;

  const isMobile = width < 640;

  const px = isDesktop ? 48 : isTablet ? 28 : 16;

  const { user } = useAuth();

  const { items, cartTotal, loading, remove, clear, refetch } = useCart();

  // ═══════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════

  const [address, setAddress] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '',
  });

  const [couponCode, setCoupon] = useState('');

  const [couponData, setCouponData] = useState(null);

  const [couponLoading, setCouponLoad] = useState(false);

  const [couponError, setCouponErr] = useState('');

  const [coinsToUse, setCoinsToUse] = useState(0);

  const [checkoutStep, setStep] = useState('cart');

  const [paymentLoading, setPayLoading] = useState(false);

  const [orderSuccess, setSuccess] = useState(null);

  // ═══════════════════════════════════════════
  // PREFILL USER
  // ═══════════════════════════════════════════

  useState(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,

        name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),

        mobile: user.mobile || '',
      }));
    }
  });

  // ═══════════════════════════════════════════
  // PRICE CALCULATIONS
  // ═══════════════════════════════════════════

  const shipping = cartTotal >= SHIPPING_THRESHOLD ? 0 : cartTotal > 0 ? SHIPPING_CHARGE : 0;

  const couponDiscount = couponData
    ? Math.round(
        couponData.type === 'percent'
          ? (cartTotal * couponData.discount) / 100
          : couponData.discount
      )
    : 0;

  const maxCoins = Math.min(
    user?.medishieldcoins || 0,

    Math.floor(cartTotal * 0.1)
  );

  const finalTotal = Math.max(
    0,

    cartTotal + shipping - couponDiscount - coinsToUse
  );

  // ═══════════════════════════════════════════
  // COUPON
  // ═══════════════════════════════════════════

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

  // ═══════════════════════════════════════════
  // ADDRESS VALIDATION
  // ═══════════════════════════════════════════

  const validateAddress = () => {
    const required = ['name', 'mobile', 'address', 'city', 'state', 'country', 'pincode'];

    for (const key of required) {
      if (!address[key]?.trim()) {
        return `Please fill in ${key}`;
      }
    }

    if (!/^\d{10}$/.test(address.mobile)) {
      return 'Enter valid 10-digit mobile number';
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      return 'Enter valid 6-digit pincode';
    }

    return null;
  };

  // ═══════════════════════════════════════════
  // PAYMENT
  // ═══════════════════════════════════════════

  const initiatePayment = useCallback(async () => {
    const addressErr = validateAddress();

    if (addressErr) {
      Alert.alert('Incomplete Address', addressErr);

      return;
    }

    setPayLoading(true);

    try {
      const { data: rzpOrder } = await API.post('/user/create-razorpay-order', {
        amount: finalTotal,

        currency: 'INR',
      });

      const RazorpayCheckout = await loadRazorpay();

      if (!RazorpayCheckout) {
        throw new Error('Razorpay failed to load');
      }

      const options = {
        description: 'MediShield Order',

        image: 'https://your-logo-url.png',

        currency: 'INR',

        key: 'rzp_test_SXvWtsQXTQpVC1',

        amount: rzpOrder.amount,

        order_id: rzpOrder.id,

        name: 'MediShield Dental',

        prefill: {
          email: user?.email || '',

          contact: address.mobile,

          name: address.name,
        },

        theme: {
          color: '#CD0F0F',
        },
      };

      if (Platform.OS === 'web') {
        await new Promise((resolve, reject) => {
          const rzp = new RazorpayCheckout({
            ...options,

            handler: async (response) => {
              try {
                await completeOrder({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  paymentSignature: response.razorpay_signature,
                  rzpAmount: rzpOrder.amount,
                });
                resolve();
              } catch (error) {
                reject(error);
              }
            },
          });

          rzp.on('payment.failed', (response) => reject(new Error(response.error.description)));

          rzp.open();
        });
      } else {
        const response = await RazorpayCheckout.open(options);

        await completeOrder({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          paymentSignature: response.razorpay_signature,
          rzpAmount: rzpOrder.amount,
        });
      }
    } catch (e) {
      console.error('Payment error:', e);
      Alert.alert('Payment Failed', e?.message || 'Something went wrong. Please try again.');
    } finally {
      setPayLoading(false);
    }
  }, [finalTotal, address, user, coinsToUse, couponData]);

  // ═══════════════════════════════════════════
  // COMPLETE ORDER
  // ═══════════════════════════════════════════

  const completeOrder = async ({ paymentId, orderId, paymentSignature, rzpAmount }) => {
    const { data } = await API.post('/user/cart/create-order', {
      paymentId,
      orderId,
      paymentSignature,
      amount: rzpAmount / 100,
      shipping,
      shippingAddress: address,
      msc: coinsToUse,
      couponId: couponData?._id || null,
      disc: couponDiscount,
    });

    if (data.message === 'success') {
      clear();

      setSuccess({
        orderId,
        amount: rzpAmount / 100,
      });

      setStep('success');
    }
  };

  // ═══════════════════════════════════════════
  // SUCCESS SCREEN
  // ═══════════════════════════════════════════

  if (checkoutStep === 'success' && orderSuccess) {
    return (
      <SafeAreaView
        style={{ fontFamily : 'Poppins_400Regular',
          flex: 1,
          backgroundColor: T.teal50,
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? 20 : 32,
        }}>
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            backgroundColor: T.white,
            borderRadius: 28,
            padding: isMobile ? 25 : 40,
            alignItems: 'center',
            maxWidth: 460,
            width: '100%',
            ...(isWeb
              ? {
                  boxShadow: T.shadowMd,
                }
              : {
                  shadowColor: T.teal700,
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.12,
                  shadowRadius: 20,
                  elevation: 7,
                }),
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: T.green100,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Ionicons name="checkmark-circle" size={52} color={T.green500} />
          </View>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 26,
              fontWeight: '900',
              color: T.slate900,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}>
            Order Placed!
          </Text>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 14,
              color: T.slate500,
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: 24,
            }}>
            Your order has been confirmed. You'll receive a confirmation email shortly.
          </Text>

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: T.slate50,
              borderRadius: 16,
              padding: 17,
              width: '100%',
              marginBottom: 24,
              borderWidth: 1,
              borderColor: T.slate100,
              alignItems: 'center',
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 11,
                color: T.slate400,
                marginBottom: 4,
              }}>
              Amount paid
            </Text>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 28,
                fontWeight: '900',
                color: T.teal700,
              }}>
              ₹{orderSuccess.amount.toLocaleString('en-IN')}
            </Text>
          </View>

          <Pressable
            onPress={() => router.replace('/')}
            style={{ 
              fontFamily : 'Poppins_400Regular',
              backgroundColor: T.teal700,
              borderRadius: 14,
              paddingVertical: 15,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              ...(isWeb
                ? {
                    boxShadow: '0 6px 18px rgba(15,118,110,0.22)',
                  }
                : {}),
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: T.white,
                fontSize: 15,
                fontWeight: '800',
              }}>
              Continue Shopping
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════
  // NOT LOGGED IN
  // ═══════════════════════════════════════════

  if (!user) {
    return (
      <SafeAreaView
        style={{ 
          fontFamily : 'Poppins_400Regular',
          flex: 1,
          backgroundColor: T.bg,
        }}>
        {isWeb && <WebHeader />}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 25,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: 92,
              height: 92,
              borderRadius: 46,
              backgroundColor: C.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Ionicons name="bag-outline" size={42} color={C.primaryDark} />
          </View>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 24,

              fontWeight: '900',

              color: T.slate900,

              marginBottom: 8,
            }}>
            Your cart is waiting
          </Text>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 14,

              color: T.slate500,

              textAlign: 'center',

              marginBottom: 28,

              lineHeight: 21,
            }}>
            Sign in to view your cart and continue to checkout.
          </Text>

          <Pressable
            onPress={() => router.push('/login')}
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: T.teal700,

              borderRadius: 14,

              paddingHorizontal: 34,

              paddingVertical: 14,
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: T.white,

                fontSize: 14,

                fontWeight: '800',
              }}>
              Sign In
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════
  // EMPTY CART
  // ═══════════════════════════════════════════

  if (!loading && items.length === 0) {
    return (
      <SafeAreaView
        style={{ fontFamily : 'Poppins_400Regular',
          flex: 1,

          backgroundColor: T.bg,
        }}>
        {isWeb && <WebHeader />}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            flex: 1,

            alignItems: 'center',

            justifyContent: 'center',

            padding: 25,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: 100,

              height: 100,

              borderRadius: 50,

              backgroundColor: T.slate100,

              alignItems: 'center',

              justifyContent: 'center',

              marginBottom: 20,
            }}>
            <Ionicons name="cart-outline" size={46} color={T.slate400} />
          </View>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 24,

              fontWeight: '900',

              color: T.slate900,

              marginBottom: 8,
            }}>
            Your cart is empty
          </Text>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 14,

              color: T.slate500,

              textAlign: 'center',

              marginBottom: 28,
            }}>
            Looks like you haven't added anything yet.
          </Text>

          <Pressable
            onPress={() => router.push('/shop')}
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: T.teal700,

              borderRadius: 14,

              paddingHorizontal: 34,

              paddingVertical: 14,
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: T.white,

                fontSize: 14,

                fontWeight: '800',
              }}>
              Start Shopping
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════
  // MAIN CART
  // ═══════════════════════════════════════════

  return (
    <SafeAreaView
      style={{ fontFamily : 'Poppins_400Regular',
        flex: 1,

        backgroundColor: T.bg,
      }}>
      {/* HEADER */}

      {isWeb ? (
        <WebHeader />
      ) : (
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 16,

            paddingVertical: 11,

            backgroundColor: T.white,

            borderBottomWidth: 1,

            borderBottomColor: T.slate100,

            gap: 12,
          }}>
          <Pressable
            onPress={() => router.back()}
            style={{ fontFamily : 'Poppins_400Regular',
              width: 38,

              height: 38,

              borderRadius: 12,

              backgroundColor: T.slate50,

              alignItems: 'center',

              justifyContent: 'center',

              borderWidth: 1,

              borderColor: T.slate200,
            }}>
            <Ionicons name="arrow-back" size={20} color={T.slate700} />
          </Pressable>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              flex: 1,

              fontSize: 18,

              fontWeight: '900',

              color: T.slate900,
            }}>
            My Cart{' '}
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: T.slate400,

                fontWeight: '600',
              }}>
              ({items.length})
            </Text>
          </Text>
        </View>
      )}

      {/* CHECKOUT STEPS */}

      <CheckoutSteps checkoutStep={checkoutStep} isMobile={isMobile} px={px} />

      {loading ? (
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            flex: 1,

            alignItems: 'center',

            justifyContent: 'center',
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: 70,

              height: 70,

              borderRadius: 35,

              backgroundColor: T.teal50,

              alignItems: 'center',

              justifyContent: 'center',

              marginBottom: 12,
            }}>
            <ActivityIndicator color={T.teal700} size="large" />
          </View>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              color: T.slate500,

              fontSize: 13,

              fontWeight: '600',
            }}>
            Loading your cart...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: '100%',

              maxWidth: 1240,

              alignSelf: 'center',

              paddingHorizontal: px,

              paddingTop: isMobile ? 20 : 30,
            }}>
            {/* PAGE TITLE */}

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                marginBottom: 24,
              }}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: isMobile ? 25 : 32,

                  fontWeight: '900',

                  color: T.slate900,

                  letterSpacing: -0.7,
                }}>
                {checkoutStep === 'cart'
                  ? 'Shopping Cart'
                  : checkoutStep === 'address'
                    ? 'Delivery Details'
                    : 'Secure Payment'}
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: 13,

                  color: T.slate500,

                  marginTop: 5,
                }}>
                {checkoutStep === 'cart'
                  ? 'Review your selected dental products before checkout.'
                  : checkoutStep === 'address'
                    ? 'Where should we deliver your order?'
                    : 'Complete your payment securely with Razorpay.'}
              </Text>
            </View>

            {/* MAIN LAYOUT */}

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flexDirection: isDesktop ? 'row' : 'column',

                gap: isDesktop ? 28 : 18,

                alignItems: 'flex-start',
              }}>
              {/* ═══════════════════════════ */}
              {/* LEFT */}
              {/* ═══════════════════════════ */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flex: isDesktop ? 1 : undefined,

                  width: isDesktop ? undefined : '100%',

                  gap: 14,
                }}>
                {/* CART */}

                {checkoutStep === 'cart' && (
                  <>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        alignItems: 'center',

                        justifyContent: 'space-between',

                        marginBottom: 2,
                      }}>
                      <View>
                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 17,

                            fontWeight: '800',

                            color: T.slate900,
                          }}>
                          Cart Items
                        </Text>

                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 11,

                            color: T.slate400,

                            marginTop: 2,
                          }}>
                          {items.length} {items.length === 1 ? 'item' : 'items'} selected
                        </Text>
                      </View>

                      <View
                        style={{ fontFamily : 'Poppins_400Regular',
                          backgroundColor: T.teal50,

                          paddingHorizontal: 10,

                          paddingVertical: 6,

                          borderRadius: 999,

                          borderWidth: 1,

                          borderColor: T.teal100,
                        }}>
                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 11,

                            color: T.teal700,

                            fontWeight: '800',
                          }}>
                          ₹{cartTotal.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>

                    {items.map((item, index) => (
                      <CartItem
                        key={item.variant || index}
                        item={item}
                        onRemove={remove}
                        isWeb={isWeb}
                      />
                    ))}
                  </>
                )}

                {/* ADDRESS */}

                {checkoutStep === 'address' && (
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      backgroundColor: T.white,

                      borderRadius: 20,

                      padding: isMobile ? 16 : 22,

                      borderWidth: 1,

                      borderColor: T.slate200,

                      ...(isWeb
                        ? {
                            boxShadow: T.shadow,
                          }
                        : {}),
                    }}>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        alignItems: 'center',

                        gap: 12,

                        marginBottom: 20,
                      }}>
                      <View
                        style={{ fontFamily : 'Poppins_400Regular',
                          width: 42,

                          height: 42,

                          borderRadius: 13,

                          backgroundColor: T.teal50,

                          alignItems: 'center',

                          justifyContent: 'center',

                          borderWidth: 1,

                          borderColor: T.teal100,
                        }}>
                        <Ionicons name="location-outline" size={21} color={T.teal700} />
                      </View>

                      <View>
                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 18,

                            fontWeight: '900',

                            color: T.slate900,
                          }}>
                          Delivery Address
                        </Text>

                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 11,

                            color: T.slate400,

                            marginTop: 2,
                          }}>
                          Enter where you'd like your order delivered
                        </Text>
                      </View>
                    </View>

                    <AddressForm value={address} onChange={setAddress} />
                  </View>
                )}
              </View>

              {/* ═══════════════════════════ */}
              {/* RIGHT */}
              {/* ═══════════════════════════ */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  width: isDesktop ? 370 : '100%',

                  gap: 12,
                }}>
                {/* COUPON */}

                {checkoutStep === 'cart' && (
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      backgroundColor: T.white,

                      borderRadius: 18,

                      padding: 16,

                      borderWidth: 1,

                      borderColor: T.slate200,

                      ...(isWeb
                        ? {
                            boxShadow: T.shadow,
                          }
                        : {}),
                    }}>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        alignItems: 'center',

                        gap: 10,

                        marginBottom: 12,
                      }}>
                      <View
                        style={{ fontFamily : 'Poppins_400Regular',
                          width: 34,

                          height: 34,

                          borderRadius: 10,

                          backgroundColor: T.teal50,

                          alignItems: 'center',

                          justifyContent: 'center',
                        }}>
                        <Ionicons name="pricetag-outline" size={17} color={T.teal700} />
                      </View>

                      <View>
                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 14,

                            fontWeight: '800',

                            color: T.slate900,
                          }}>
                          Have a coupon?
                        </Text>

                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 10,

                            color: T.slate400,

                            marginTop: 1,
                          }}>
                          Save more on your order
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        gap: 8,
                      }}>
                      <TextInput
                        value={couponCode}
                        onChangeText={(text) => {
                          setCoupon(text.toUpperCase());

                          setCouponErr('');

                          setCouponData(null);
                        }}
                        placeholder="ENTER CODE"
                        placeholderTextColor={T.slate400}
                        autoCapitalize="characters"
                        style={{ fontFamily : 'Poppins_400Regular',
                          flex: 1,

                          height: 44,

                          backgroundColor: T.slate50,

                          borderRadius: 10,

                          borderWidth: 1,

                          borderColor: couponData ? T.green500 : T.slate200,

                          paddingHorizontal: 12,

                          fontSize: 12,

                          fontWeight: '700',

                          color: T.slate900,

                          ...(Platform.OS === 'web'
                            ? {
                                outlineStyle: 'none',
                              }
                            : {}),
                        }}
                      />

                      <Pressable
                        onPress={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        style={{ fontFamily : 'Poppins_400Regular',
                          minWidth: 72,

                          height: 44,

                          backgroundColor: T.teal700,

                          borderRadius: 10,

                          alignItems: 'center',

                          justifyContent: 'center',

                          opacity: !couponCode.trim() ? 0.45 : 1,
                        }}>
                        {couponLoading ? (
                          <ActivityIndicator size="small" color={T.white} />
                        ) : (
                          <Text
                            style={{ fontFamily : 'Poppins_400Regular',
                              color: T.white,

                              fontWeight: '800',

                              fontSize: 12,
                            }}>
                            Apply
                          </Text>
                        )}
                      </Pressable>
                    </View>

                    {couponData && (
                      <View
                        style={{ fontFamily : 'Poppins_400Regular',
                          flexDirection: 'row',

                          alignItems: 'center',

                          gap: 6,

                          marginTop: 9,
                        }}>
                        <Ionicons name="checkmark-circle" size={15} color={T.green500} />

                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 11,

                            color: '#15803d',

                            fontWeight: '700',
                          }}>
                          Coupon applied! ₹{couponDiscount} off
                        </Text>
                      </View>
                    )}

                    {couponError && (
                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          fontSize: 11,

                          color: T.red500,

                          marginTop: 7,

                          fontWeight: '600',
                        }}>
                        {couponError}
                      </Text>
                    )}
                  </View>
                )}

                {/* COINS */}

                {checkoutStep === 'cart' && (user?.medishieldcoins || 0) > 0 && (
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      backgroundColor: T.amber50,

                      borderRadius: 18,

                      padding: 16,

                      borderWidth: 1,

                      borderColor: T.amber100,
                    }}>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        alignItems: 'center',

                        gap: 10,

                        marginBottom: 11,
                      }}>
                      <View
                        style={{ fontFamily : 'Poppins_400Regular',
                          width: 38,

                          height: 38,

                          borderRadius: 12,

                          backgroundColor: T.amber100,

                          alignItems: 'center',

                          justifyContent: 'center',
                        }}>
                        <Ionicons name="sparkles-outline" size={19} color={T.amber500} />
                      </View>

                      <View
                        style={{ fontFamily : 'Poppins_400Regular',
                          flex: 1,
                        }}>
                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 14,

                            fontWeight: '800',

                            color: '#92400e',
                          }}>
                          MediShield Coins
                        </Text>

                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 10,

                            color: '#b45309',

                            marginTop: 2,

                            lineHeight: 15,
                          }}>
                          You have {user.medishieldcoins} coins
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => setCoinsToUse(coinsToUse > 0 ? 0 : maxCoins)}
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        alignItems: 'center',

                        justifyContent: 'center',

                        gap: 7,

                        backgroundColor: coinsToUse > 0 ? T.amber500 : T.white,

                        borderRadius: 11,

                        paddingVertical: 10,

                        borderWidth: 1,

                        borderColor: coinsToUse > 0 ? T.amber500 : T.amber100,
                      }}>
                      <Ionicons
                        name={coinsToUse > 0 ? 'checkmark-circle' : 'add-circle-outline'}
                        size={16}
                        color={coinsToUse > 0 ? T.white : T.amber500}
                      />

                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          fontSize: 12,

                          fontWeight: '800',

                          color: coinsToUse > 0 ? T.white : '#92400e',
                        }}>
                        {coinsToUse > 0
                          ? `Using ${maxCoins} coins (−₹${maxCoins})`
                          : `Use ${maxCoins} coins (−₹${maxCoins})`}
                      </Text>
                    </Pressable>
                  </View>
                )}

                {/* SUMMARY */}

                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    backgroundColor: T.white,

                    borderRadius: 20,

                    padding: isMobile ? 17 : 20,

                    borderWidth: 1,

                    borderColor: T.slate200,

                    ...(isWeb
                      ? {
                          boxShadow: T.shadowMd,
                        }
                      : {
                          shadowColor: T.teal700,

                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },

                          shadowOpacity: 0.05,

                          shadowRadius: 10,

                          elevation: 3,
                        }),
                  }}>
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      flexDirection: 'row',

                      alignItems: 'center',

                      gap: 9,

                      marginBottom: 17,
                    }}>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        width: 34,

                        height: 34,

                        borderRadius: 10,

                        backgroundColor: T.teal50,

                        alignItems: 'center',

                        justifyContent: 'center',
                      }}>
                      <Ionicons name="receipt-outline" size={17} color={T.teal700} />
                    </View>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        fontSize: 16,

                        fontWeight: '900',

                        color: T.slate900,
                      }}>
                      Order Summary
                    </Text>
                  </View>

                  <PriceSummary
                    cartTotal={cartTotal}
                    shipping={shipping}
                    discount={0}
                    coinsUsed={coinsToUse}
                    couponDiscount={couponDiscount}
                    finalTotal={finalTotal}
                  />
                </View>

                {/* CTA */}

                <Pressable
                  onPress={() => {
                    if (checkoutStep === 'cart') {
                      setStep('address');
                    } else if (checkoutStep === 'address') {
                      initiatePayment();
                    }
                  }}
                  disabled={paymentLoading || items.length === 0}
                  style={{ fontFamily : 'Poppins_400Regular',
                    minHeight: 56,

                    backgroundColor: T.teal700,

                    borderRadius: 15,

                    flexDirection: 'row',

                    alignItems: 'center',

                    justifyContent: 'center',

                    gap: 9,

                    opacity: items.length === 0 ? 0.5 : 1,

                    ...(isWeb
                      ? {
                          boxShadow: '0 8px 22px rgba(15,118,110,0.25)',

                          cursor: 'pointer',
                        }
                      : {
                          shadowColor: T.teal700,

                          shadowOffset: {
                            width: 0,
                            height: 7,
                          },

                          shadowOpacity: 0.25,

                          shadowRadius: 12,

                          elevation: 6,
                        }),
                  }}>
                  {paymentLoading ? (
                    <ActivityIndicator color={T.white} size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name={checkoutStep === 'address' ? 'lock-closed-outline' : 'arrow-forward'}
                        size={18}
                        color={T.white}
                      />

                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          color: T.white,

                          fontSize: 15,

                          fontWeight: '900',
                        }}>
                        {checkoutStep === 'cart'
                          ? 'Proceed to Address'
                          : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                      </Text>
                    </>
                  )}
                </Pressable>

                {/* BACK */}

                {checkoutStep === 'address' && (
                  <Pressable
                    onPress={() => setStep('cart')}
                    style={{ fontFamily : 'Poppins_400Regular',
                      alignItems: 'center',

                      paddingVertical: 8,
                    }}>
                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: T.slate500,

                        fontSize: 12,

                        fontWeight: '600',
                      }}>
                      ← Back to cart
                    </Text>
                  </Pressable>
                )}

                {/* SECURITY */}

                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',

                    alignItems: 'center',

                    justifyContent: 'center',

                    gap: 6,

                    paddingVertical: 3,
                  }}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={T.slate400} />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: 10,

                      color: T.slate400,

                      fontWeight: '600',
                    }}>
                    Secure checkout · Razorpay
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
