// hooks/useAddToCart.js
//
// Reusable hook for "Add to Cart" action
// ✅ Shows success/error/login-required feedback
// ✅ Used on ProductCard, ProductDetails, anywhere
//
// Usage:
//   const { addToCart, status } = useAddToCart();
//   <Pressable onPress={() => addToCart({ productId, variant, price, count })}>
//     <Text>{status === 'added' ? '✓ Added' : 'Add to Cart'}</Text>
//   </Pressable>

import { useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

// status: 'idle' | 'loading' | 'added' | 'error' | 'login_required'
export function useAddToCart() {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { add } = useCart();
  const { user } = useAuth();
  const router   = useRouter();

  const addToCart = useCallback(async ({
    productId,
    variant,       // required by backend
    price,
    count = 1,
    totalcount,
  }) => {
    if (!user) {
      setStatus('login_required');
      setTimeout(() => {
        setStatus('idle');
        router.push('/auth/login');
      }, 1500);
      return false;
    }

    setStatus('loading');
    try {
      await add({ productId, variant, count, price, totalcount: totalcount ?? count });
      setStatus('added');
      setTimeout(() => setStatus('idle'), 2200);
      return true;
    } catch (e) {
      const msg = e?.message || 'Failed to add';
      setErrorMsg(msg);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
      return false;
    }
  }, [add, user, router]);

  return { addToCart, status, errorMsg };
}