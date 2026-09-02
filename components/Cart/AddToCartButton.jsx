// components/cart/AddToCartButton.jsx
//
// Drop-in button — handles all states visually
//
// Usage (minimal — needs variant):
//   <AddToCartButton
//     productId={item._id}
//     variant={item._id}          // use product _id as default variant if no variants
//     price={item.price.regularPrice}
//   />
//
// Usage (full):
//   <AddToCartButton
//     productId={item._id}
//     variant="variant_id_here"
//     price={800}
//     count={qty}
//     label="Add to Cart"
//     size="sm"                   // 'sm' | 'md' | 'lg'
//     style="outline"             // 'solid' | 'outline'
//     fullWidth
//   />

import { Pressable, Text, View, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAddToCart } from '@/hooks/useAddToCart';

const COLORS = {
  teal700: '#CD0F0F',
  teal800: '#0f5f5a',
  teal100: '#ccfbf1',
  green500: '#22c55e',
  amber500: '#f59e0b',
  red400: '#f87171',
  slate400: '#94a3b8',
  white: '#ffffff',
};

const SIZE = {
  sm: { py: 7, px: 10, fontSize: 11, iconSize: 13, radius: 9 },
  md: { py: 11, px: 16, fontSize: 13, iconSize: 16, radius: 12 },
  lg: { py: 14, px: 20, fontSize: 15, iconSize: 18, radius: 14 },
  xl: { py: 16, px: 24, fontSize: 16, iconSize: 20, radius: 16 },
  xxl: { py: 18, px: 28, fontSize: 17, iconSize: 22, radius: 18 },
};

export default function AddToCartButton({
  productId,
  variant,
  price,
  count = 1,
  label = 'Add to Cart',
  size = 'md',
  style = 'solid', // 'solid' | 'outline'
  fullWidth = false,
  onSuccess,
}) {
  const { addToCart, status } = useAddToCart();
  const s = SIZE[size] || SIZE.md;
  const isWeb = Platform.OS === 'web';

  const handlePress = async () => {
    const ok = await addToCart({ productId, variant: variant || productId, price, count });
    if (ok && onSuccess) onSuccess();
  };

  // ── Visual states ──
  const states = {
    idle: {
      bg: style === 'solid' ? COLORS.teal700 : 'transparent',
      border: COLORS.teal700,
      color: style === 'solid' ? COLORS.white : COLORS.teal700,
      icon: 'bag-add-outline',
      text: label,
    },
    loading: {
      bg: style === 'solid' ? COLORS.teal700 : 'transparent',
      border: COLORS.teal700,
      color: style === 'solid' ? COLORS.white : COLORS.teal700,
      icon: null,
      text: null, // shows spinner
    },
    added: {
      bg: COLORS.green500,
      border: COLORS.green500,
      color: COLORS.white,
      icon: 'checkmark-circle',
      text: 'Added!',
    },
    error: {
      bg: '#fef2f2',
      border: COLORS.red400,
      color: COLORS.red400,
      icon: 'alert-circle-outline',
      text: 'Out of stock',
    },
    login_required: {
      bg: COLORS.amber500,
      border: COLORS.amber500,
      color: COLORS.white,
      icon: 'person-outline',
      text: 'Login to add',
    },
  };

  const st = states[status] || states.idle;

  return (
    <Pressable
      onPress={handlePress}
      disabled={status === 'loading' || status === 'added'}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          // borderRadius: s.radius,
          borderWidth: 1.5,
          borderColor: st.border,
          backgroundColor: st.bg,
          alignSelf: fullWidth ? 'auto' : 'flex-start',
          opacity: status === 'loading' ? 0.85 : 1,
        },
        isWeb && {
          cursor: status === 'loading' || status === 'added' ? 'default' : 'pointer',
          transition: 'all 0.18s ease',
          boxShadow:
            status === 'idle' && style === 'solid' ? '0 4px 14px rgba(15,118,110,0.25)' : 'none',
        },
      ]}>
      {status === 'loading' ? (
        <ActivityIndicator size="small" color={style === 'solid' ? COLORS.white : COLORS.teal700} />
      ) : (
        <>
          {st.icon && <Ionicons name={st.icon} size={s.iconSize} color={st.color} />}
          <Text style={{ fontFamily : 'Poppins_400Regular', fontSize: s.fontSize, fontWeight: '700', color: st.color }}>
            {st.text}
          </Text>
        </>
      )}
    </Pressable>
  );
}
