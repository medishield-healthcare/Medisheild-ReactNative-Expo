// src/context/CartContext.jsx
//
// ✅ Global cart state — wrap your app with <CartProvider>
// ✅ Syncs with backend on mount (GET /user/cart)
// ✅ add(product, variant, count, price) → POST /user/cart
// ✅ remove(variant) → POST /user/cart/remove
// ✅ clear() → local clear (backend auto-clears on order)
// ✅ cartCount, cartTotal exposed for header badge
// ✅ Works even when user not logged in (guest mode — local only)

import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import API from '@/api/axios';
import { useAuth } from './AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────────
const ACTIONS = {
  SET_CART: 'SET_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR: 'CLEAR',
};

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState = {
  items: [], // [{ product, count, variant, price, itemId }]
  cartTotal: 0,
  loading: false,
  error: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CART: {
      const cart = action.payload?.data || action.payload;

      return {
        ...state,
        items: Array.isArray(cart?.products) ? cart.products : [],
        cartTotal: Number(cart?.cartTotal || 0),
        loading: false,
        error: null,
      };
    }
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.CLEAR:
      return { ...initialState };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // ── Fetch cart on login ──
  const fetchCart = useCallback(async () => {
    if (!user) {
      dispatch({ type: ACTIONS.CLEAR });
      return;
    }
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await API.get('/user/cart');
      dispatch({ type: ACTIONS.SET_CART, payload: data.data });
    } catch (e) {
      // 404 / no cart → empty state is fine
      dispatch({ type: ACTIONS.SET_CART, payload: null });
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Add to cart ──
  // payload shape matches backend userCart controller:
  // { productId, variant, count, price, totalcount }
  const add = useCallback(
    async ({ productId, variant, count = 1, price, totalcount }) => {
      if (!user) throw new Error('LOGIN_REQUIRED');
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const { data } = await API.post('/user/cart', {
          product: { productId, variant, count, price, totalcount: totalcount ?? count },
        });
        dispatch({ type: ACTIONS.SET_CART, payload: data });
        return { success: true };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to add to cart';
        dispatch({ type: ACTIONS.SET_ERROR, payload: msg });
        throw new Error(msg);
      }
    },
    [user]
  );

  // ── Remove from cart ──
  const remove = useCallback(
    async (variant) => {
      if (!user) return;
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const { data } = await API.post('/user/cart/remove', { product: { variant } });
        dispatch({ type: ACTIONS.SET_CART, payload: data });
      } catch (e) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: e?.response?.data?.message || 'Remove failed',
        });
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (variant, count) => {
      if (!user) throw new Error('LOGIN_REQUIRED');

      if (!Number.isInteger(count) || count < 1) {
        throw new Error('Quantity must be at least 1');
      }

      try {
        const { data } = await API.patch('/user/cart/quantity', {
          product: { variant, count },
        });

        dispatch({
          type: ACTIONS.SET_CART,
          payload: data,
        });

        return { success: true };
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || 'Failed to update quantity';

        throw new Error(msg);
      }
    },
    [user]
  );

  // ── Clear cart locally (after order placed) ──
  const clear = useCallback(() => dispatch({ type: ACTIONS.CLEAR }), []);

  // ── Helpers ──
  const cartCount = state.items.reduce((sum, i) => sum + (i.count || 0), 0);
  const isInCart = (variant) => state.items.some((i) => i.variant === variant);
  const getItem = (variant) => state.items.find((i) => i.variant === variant);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        cartTotal: state.cartTotal,
        loading: state.loading,
        error: state.error,
        cartCount,
        isInCart,
        getItem,
        add,
        remove,
        clear,
        refetch: fetchCart,
        updateQuantity
      }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
