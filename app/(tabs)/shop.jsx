// app/(tabs)/shop.jsx
// ✅ Infinite scroll pagination (12 per page)
// ✅ Search (debounced 400ms)
// ✅ Category filter (from /category API)
// ✅ Sort (newest, price asc/desc, featured)
// ✅ Price range filter
// ✅ Grid / List view toggle
// ✅ Web: sidebar filters | Mobile: bottom sheet filters
// ✅ Active filter chips with clear
// ✅ NativeWind + inline styles hybrid

import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import API from '@/api/axios';
import WebHeader from 'components/Header/header.web';
import C from '@/utils/theme';
import AddToCartButton from 'components/Cart/AddToCartButton';
import { useAuth } from '@/context/AuthContext';
const PAGE_LIMIT = 12;

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low→High', value: 'price.minimalPrice' },
  { label: 'Price: High→Low', value: '-price.minimalPrice' },
  { label: 'Featured', value: '-featured' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹500', min: '', max: '500' },
  { label: '₹500 – ₹1000', min: '500', max: '1000' },
  { label: '₹1000 – ₹2000', min: '1000', max: '2000' },
  { label: 'Above ₹2000', min: '2000', max: '' },
];

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Product Card (Grid) ───────────────────────────────────────────────────────
function ProductCardGrid({ item, onPress, onCart, cardWidth }) {
  const [hovered, setHovered] = useState(false);
  const { user, setUser } = useAuth();
  const isWeb = Platform.OS === 'web';
  const minimalPrice = item?.price?.minimalPrice ?? 0;
  const regularPrice = item?.price?.regularPrice ?? 0;
  const hasDiscount = regularPrice > minimalPrice && minimalPrice > 0;
  const discount = hasDiscount ? Math.round((1 - minimalPrice / regularPrice) * 100) : 0;
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlist = async () => {
    if (wishlistLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (!item?._id) return;

    try {
      setWishlistLoading(true);

      const res = await API.put('/product/wishlist', {
        prodId: item?._id,
      });

      // Backend updated user return karta hai
      setUser(res.data);
    } catch (error) {
      console.log('Wishlist error:', error?.response?.data || error?.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const wishlisted = user?.wishlist?.some((id) => id.toString() === item?._id?.toString()) || false;

  return (
    <View
      onMouseEnter={isWeb ? () => setHovered(true) : undefined}
      onMouseLeave={isWeb ? () => setHovered(false) : undefined}
      style={{
        fontFamily: 'Poppins_400Regular',
        width: cardWidth,
        backgroundColor: C.card || '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: hovered ? C.primary : C.border,
        marginBottom: 14,
        ...(isWeb
          ? {
              boxShadow: hovered
                ? '0 14px 36px rgba(15,118,110,0.14)'
                : '0 3px 14px rgba(0,0,0,0.06)',
              transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.22s ease',
              cursor: 'pointer',
            }
          : {
              shadowColor: C.primaryDark,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.07,
              shadowRadius: 10,
              elevation: 3,
            }),
      }}>
      <Pressable onPress={() => onPress(item._id)}>
        {/* ═══════════════════════════════════ */}
        {/* IMAGE */}
        {/* ═══════════════════════════════════ */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            position: 'relative',
            backgroundColor: '#f8fafb',
            overflow: 'hidden',
          }}>
          <Image
            source={
              item?.thumbnail_url?.startsWith('/') 
                ? {
                    uri: `https://images1.dentalkart.com/media/catalog/product${item.thumbnail_url}`,
                  }
                : item?.thumbnail_url
                  ? {
                      uri: item.thumbnail_url,
                    }
                  : require('../../assets/Image-not-found.png')
            }
            style={{
              fontFamily: 'Poppins_400Regular',
              width: '100%',
              height: cardWidth * 0.88,
              transform: [
                {
                  scale: hovered ? 1.04 : 1,
                },
              ],
              transition: 'transform 0.25s ease',
            }}
            resizeMode="contain"
          />

          {/* ─────────────────────────────── */}
          {/* FEATURED BADGE */}
          {/* ─────────────────────────────── */}

          {item?.featured && (
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: C.accent,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
              <Ionicons name="flash" size={10} color="#fff" />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  color: '#fff',
                  fontSize: 8,
                  fontWeight: '900',
                  letterSpacing: 0.6,
                }}>
                FEATURED
              </Text>
            </View>
          )}

          {/* ─────────────────────────────── */}
          {/* DISCOUNT BADGE */}
          {/* ─────────────────────────────── */}

          {hasDiscount && (
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                position: 'absolute',

                left: 10,

                bottom: 10,

                backgroundColor: '#dc2626',

                borderRadius: 6,

                paddingHorizontal: 8,

                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  color: '#fff',

                  fontSize: 9,

                  fontWeight: '900',

                  letterSpacing: 0.2,
                }}>
                {discount}% OFF
              </Text>
            </View>
          )}

          {/* ─────────────────────────────── */}
          {/* WISHLIST */}
          {/* ─────────────────────────────── */}

          <Pressable
            onPress={handleWishlist}
            style={{
              fontFamily: 'Poppins_400Regular',
              position: 'absolute',

              top: 10,

              right: 10,

              width: 36,

              height: 36,

              borderRadius: 18,

              backgroundColor: 'rgba(255,255,255,0.96)',

              alignItems: 'center',

              justifyContent: 'center',

              borderWidth: 1,

              borderColor: 'rgba(15,23,42,0.07)',

              boxShadow: '0 3px 12px rgba(0,0,0,0.10)',
            }}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={19}
              color={wishlisted ? C.primary : C.primaryDark}
            />
          </Pressable>

          {/* ─────────────────────────────── */}
          {/* QUICK ADD */}
          {/* ─────────────────────────────── */}
          {/* 
          {isWeb && hovered && (
            <Pressable
              onPress={(event) => {
                event?.stopPropagation?.();

                onCart(item);
              }}
              style={{ fontFamily : 'Poppins_400Regular',
                position: 'absolute',

                bottom: 0,

                left: 0,

                right: 0,

                height: 42,

                backgroundColor: C.primaryDark,

                alignItems: 'center',

                justifyContent: 'center',

                flexDirection: 'row',

                gap: 7,
              }}>
              <Ionicons name="bag-add-outline" size={17} color="#fff" />

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#fff',

                  fontSize: 11,

                  fontWeight: '800',

                  letterSpacing: 0.3,
                }}>
                QUICK ADD
              </Text>
            </Pressable>
          )} */}
        </View>

        {/* ═══════════════════════════════════ */}
        {/* PRODUCT INFORMATION */}
        {/* ═══════════════════════════════════ */}

        <View style={{ fontFamily: 'Poppins_400Regular', padding: 13 }}>
          {/* BRAND / MANUFACTURER */}

          {item?.manufacturer && (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins_400Regular',
                color: C.primary,

                fontSize: 9,

                fontWeight: '800',

                textTransform: 'uppercase',

                letterSpacing: 0.8,

                marginBottom: 5,
              }}>
              {item.manufacturer}
            </Text>
          )}

          {/* PRODUCT NAME */}

          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 16,

              fontWeight: '750',

              color: C.dark,

              lineHeight: 19,

              minHeight: 38,

              marginBottom: 8,
            }}>
            {item?.name || 'Product'}
          </Text>

          {/* RATING */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 9,
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                backgroundColor: '#fff7ed',
                borderRadius: 5,
                paddingHorizontal: 6,
                paddingVertical: 3,
              }}>
              <Ionicons name="star" size={10} color="#f59e0b" />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 12,

                  fontWeight: '800',

                  color: '#92400e',
                }}>
                {item?.average_rating ? Number(item.average_rating).toFixed(1) : '4.8'}
              </Text>
            </View>

            {item?.rating_count > 0 && (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 9,
                  color: C.muted,
                  marginLeft: 6,
                }}>
                ({item.rating_count})
              </Text>
            )}
          </View>

          {/* PRICE */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',

              alignItems: 'center',

              flexWrap: 'wrap',

              gap: 7,

              marginBottom: 12,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 20,

                fontWeight: '900',

                color: C.primary,
              }}>
              ₹{Number(minimalPrice).toLocaleString('en-IN')}
            </Text>

            {hasDiscount && (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 11,
                  color: C.muted,
                  textDecorationLine: 'line-through',
                }}>
                ₹{Number(regularPrice).toLocaleString('en-IN')}
              </Text>
            )}
          </View>

          {/* STOCK */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 11,
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#10b981',
              }}
            />

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 11,
                fontWeight: '700',
                color: '#047857',
                marginLeft: 6,
              }}>
              In Stock
            </Text>
          </View>

          {/* ═══════════════════════════════ */}
          {/* ACTIONS */}
          {/* ═══════════════════════════════ */}

          <View style={{ fontFamily: 'Poppins_400Regular', flexDirection: 'row', gap: 7 }}>
            {/* <View
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,
              }}>
              <AddToCartButton
                productId={item._id}
                variant={item.sku}
                price={minimalPrice}
                size="sm"
                style="outline"
                fullWidth={true}
              />
            </View> */}

            <Pressable
              onPress={(event) => {
                event?.stopPropagation?.();
                onPress(item._id);
              }}
              style={{
                fontFamily: 'Poppins_400Regular',
                flex: 1,
                minHeight: 36,
                // borderRadius: 9,
                backgroundColor: C.primary,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 8,
                boxShadow: hovered ? '0 5px 14px rgba(15,118,110,0.22)' : 'none',
                transition: 'all 0.2s ease',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 11,
                  fontWeight: '800',
                  color: '#fff',
                }}>
                Add to Cart
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
// ── Product Card (List) ───────────────────────────────────────────────────────
function ProductCardList({ item, onPress, onCart }) {
  return (
    <Pressable
      onPress={() => onPress(item._id)}
      style={{
        fontFamily: 'Poppins_400Regular',
        flexDirection: 'row',
        backgroundColor: C.card,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: C.border,
        ...(Platform.OS === 'web'
          ? { boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }
          : {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }),
      }}>
      <Image
        source={
              item?.thumbnail_url?.startsWith('/') 
                ? {
                    uri: `https://images1.dentalkart.com/media/catalog/product${item.thumbnail_url}`,
                  }
                : item?.thumbnail_url
                  ? {
                      uri: item.thumbnail_url,
                    }
                  : require('../../assets/Image-not-found.png')
            }
        style={{ fontFamily: 'Poppins_400Regular', width: 110, height: 110, backgroundColor: C.bg }}
        resizeMode="cover"
      />
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 16,
              fontWeight: '700',
              color: C.dark,
              lineHeight: 19,
              marginBottom: 3,
            }}>
            {item.name}
          </Text>
          {item.short_description && (
            <Text
              numberOfLines={1}
              style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: C.muted }}>
              {item.short_description}
            </Text>
          )}
        </View>
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 19,
                fontWeight: '800',
                color: C.primary,
              }}>
              ₹ {item.price?.regularPrice}
            </Text>
          </View>
          <View style={{ fontFamily: 'Poppins_400Regular', flexDirection: 'row', gap: 6 }}>
            {/* <Pressable
              onPress={() => onCart(item)}
              style={{ fontFamily : 'Poppins_400Regular',
                // borderRadius: 9,
                borderWidth: 1.5,
                borderColor: C.primary,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}>
              <Text style={{ fontFamily : 'Poppins_400Regular', fontSize: 11, fontWeight: '700', color: C.primary }}>Add to Cart</Text>
            </Pressable> */}
            {/* <AddToCartButton
              productId={item._id}
              variant={item.sku} // use _id as variant if product has no variants
              price={item.price.minimalPrice}
              size="sm"
              style="outline"
            /> */}
            <Pressable
              onPress={() => onPress(item._id)}
              style={{
                fontFamily: 'Poppins_400Regular',
                // borderRadius: 9,
                backgroundColor: C.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#fff',
                }}>
                Buy Now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ── Filter Panel (shared between sidebar + bottom sheet) ──────────────────────
function FilterPanel({ categories, filters, onChange, onClose, isMobile }) {
  const [local, setLocal] = useState(filters);
  const set = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  const apply = () => {
    onChange(local);
    onClose?.();
  };
  const reset = () => {
    const empty = { category: '', sort: '-createdAt', priceMin: '', priceMax: '' };
    setLocal(empty);
    onChange(empty);
    onClose?.();
  };

  const activePriceRange = PRICE_RANGES.findIndex(
    (r) => r.min === local.priceMin && r.max === local.priceMax
  );

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        flex: isMobile ? undefined : 1,
        position: 'relative',
      }}>
      {/* Sort */}
      <View style={{ fontFamily: 'Poppins_400Regular', marginBottom: 20 }}>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 12,
            fontWeight: '800',
            color: C.dark,
            letterSpacing: 1.2,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}>
          Sort By
        </Text>
        {SORT_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => set('sort', opt.value)}
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 9,
              paddingHorizontal: 12,
              borderRadius: 12,
              marginBottom: 4,
              backgroundColor: local.sort === opt.value ? C.primaryLight : 'transparent',
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: local.sort === opt.value ? C.primary : C.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {local.sort === opt.value && (
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: C.primary,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                fontWeight: '600',
                color: local.sort === opt.value ? C.primary : C.dark,
              }}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Categories */}
      {categories.length > 0 && (
        <View style={{ fontFamily: 'Poppins_400Regular', marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              fontWeight: '800',
              color: C.dark,
              letterSpacing: 1.2,
              marginBottom: 10,
              textTransform: 'uppercase',
            }}>
            Category
          </Text>
          <Pressable
            onPress={() => set('category', '')}
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 9,
              paddingHorizontal: 12,
              borderRadius: 12,
              marginBottom: 4,
              backgroundColor: !local.category ? C.primaryLight : 'transparent',
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: !local.category ? C.primary : C.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {!local.category && (
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: C.primary,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                fontWeight: '600',
                color: !local.category ? C.primary : C.dark,
              }}>
              All Categories
            </Text>
          </Pressable>
          {categories.map((cat) => (
            <Pressable
              key={cat._id || cat.name}
              onPress={() => set('category', cat.name)}
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginBottom: 4,
                backgroundColor: local.category === cat.name ? C.primaryLight : 'transparent',
              }}>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 2,
                  borderColor: local.category === cat.name ? C.primary : C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {local.category === cat.name && (
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: C.primary,
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 13,
                  fontWeight: '600',
                  color: local.category === cat.name ? C.primary : C.dark,
                }}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Price Range */}
      <View style={{ fontFamily: 'Poppins_400Regular', marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 12,
            fontWeight: '800',
            color: C.dark,
            letterSpacing: 1.2,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}>
          Price Range
        </Text>
        {PRICE_RANGES.map((range, i) => (
          <Pressable
            key={i}
            onPress={() => {
              set('priceMin', range.min);
              set('priceMax', range.max);
            }}
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 9,
              paddingHorizontal: 12,
              borderRadius: 12,
              marginBottom: 4,
              backgroundColor: activePriceRange === i ? C.primaryLight : 'transparent',
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: activePriceRange === i ? C.primary : C.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {activePriceRange === i && (
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: C.primary,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 13,
                fontWeight: '600',
                color: activePriceRange === i ? C.primary : C.dark,
              }}>
              {range.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Buttons */}
      <View style={{ fontFamily: 'Poppins_400Regular', flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={reset}
          style={{
            fontFamily: 'Poppins_400Regular',
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: C.border,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              fontWeight: '700',
              color: C.muted,
            }}>
            Reset
          </Text>
        </Pressable>
        <Pressable
          onPress={apply}
          style={{
            fontFamily: 'Poppins_400Regular',
            flex: 2,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: C.primary,
            alignItems: 'center',
            ...(Platform.OS === 'web' ? { boxShadow: '0 4px 14px rgba(15,118,110,0.28)' } : {}),
          }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              fontWeight: '800',
              color: '#fff',
            }}>
            Apply Filters
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 1024;
  const isMobile = width < 768;
  const px = isMobile ? 16 : isDesktop ? 32 : 24;

  // Grid columns based on screen width
  const numCols = width < 480 ? 1 : width < 768 ? 2 : width < 1024 ? 3 : width < 1400 ? 3 : 3;
  const cardGap = 12;

  // ── State ──
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showFilter, setShowFilter] = useState(false); // mobile bottom sheet
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);

  const { category } = useLocalSearchParams();
  console.log(category);

  const [filters, setFilters] = useState({
    category: category || '',
    sort: '-createdAt',
    priceMin: '',
    priceMax: '',
  });

  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: category,
      }));
      isFirstRender.current = true;
    }
  }, [category]);

  // ── Build API params ──
  const buildParams = useCallback(
    (pageNum) => {
      const params = {
        page: pageNum,
        limit: PAGE_LIMIT,
        sort: filters.sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.category) params.category = filters.category;
      if (filters.priceMin) params['price[gte]'] = filters.priceMin;
      if (filters.priceMax) params['price[lte]'] = filters.priceMax;
      return params;
    },
    [debouncedSearch, filters]
  );

  // ── Fetch page 1 (reset) ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
      const { data } = await API.get('/product', { params: buildParams(1) });
      const items = data.data || [];
      setProducts(items);
      setTotal(data.total || items.length);
      setHasMore(items.length === PAGE_LIMIT);
    } catch (e) {
      console.error('Shop fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // ── Load more (infinite scroll) ──
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data } = await API.get('/product', { params: buildParams(nextPage) });
      const items = data.data || [];
      setProducts((prev) => {
        // Deduplicate by _id
        const ids = new Set(prev.map((p) => p._id));
        return [...prev, ...items.filter((p) => !ids.has(p._id))];
      });
      setPage(nextPage);
      setHasMore(items.length === PAGE_LIMIT);
    } catch (e) {
      console.error('Load more error:', e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, page, buildParams]);

  // ── Fetch categories ──
  useEffect(() => {
    API.get('/category')
      .then(({ data }) => setCategories(data.data || data.categories || data || []))
      .catch(console.error);
  }, []);

  // ── Re-fetch on search/filter change ──
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchProducts();
      return;
    }
    fetchProducts();
  }, [debouncedSearch, filters]);

  // ── Active filter count ──
  const activeFilterCount = [
    filters.category,
    filters.sort !== '-createdAt' ? filters.sort : '',
    filters.priceMin || filters.priceMax,
  ].filter(Boolean).length;

  // ── Card width ──
  const contentWidth = isDesktop ? width - px * 2 - 260 : width - px * 2;
  const totalGap = (numCols - 1) * cardGap;
  const cardWidth = Math.floor((contentWidth - totalGap) / numCols);

  // ── Active filter chips ──
  const filterChips = [
    filters.category && { key: 'category', label: filters.category },
    filters.sort !== '-createdAt' && {
      key: 'sort',
      label: SORT_OPTIONS.find((s) => s.value === filters.sort)?.label,
    },
    (filters.priceMin || filters.priceMax) && {
      key: 'price',
      label:
        PRICE_RANGES.find((r) => r.min === filters.priceMin && r.max === filters.priceMax)?.label ||
        'Custom Price',
    },
  ].filter(Boolean);

  const clearChip = (key) => {
    if (key === 'category') setFilters((p) => ({ ...p, category: '' }));
    if (key === 'sort') setFilters((p) => ({ ...p, sort: '-createdAt' }));
    if (key === 'price') setFilters((p) => ({ ...p, priceMin: '', priceMax: '' }));
  };

  // ── Render footer ──
  const renderFooter = () => {
    if (loadingMore)
      return (
        <View
          style={{ fontFamily: 'Poppins_400Regular', paddingVertical: 24, alignItems: 'center' }}>
          <ActivityIndicator color={C.primary} />
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              color: C.muted,
              fontSize: 12,
              marginTop: 6,
            }}>
            Loading more...
          </Text>
        </View>
      );
    if (!hasMore && products.length > 0)
      return (
        <View
          style={{ fontFamily: 'Poppins_400Regular', paddingVertical: 20, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Poppins_400Regular', color: C.muted, fontSize: 12 }}>
            ✓ All {products.length} products loaded
          </Text>
        </View>
      );
    return null;
  };

  // ── Render empty ──
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          paddingVertical: 60,
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: C.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}>
          <Ionicons name="search-outline" size={32} color={C.muted} />
        </View>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 17,
            fontWeight: '800',
            color: C.dark,
            marginBottom: 6,
          }}>
          No products found
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            color: C.muted,
            textAlign: 'center',
            lineHeight: 20,
          }}>
          Try adjusting your search or filters
        </Text>
        <Pressable
          onPress={() => {
            setSearch('');
            setFilters({ category: '', sort: '-createdAt', priceMin: '', priceMax: '' });
          }}
          style={{
            fontFamily: 'Poppins_400Regular',
            marginTop: 16,
            backgroundColor: C.primaryLight,
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              color: C.primary,
              fontWeight: '700',
              fontSize: 13,
            }}>
            Clear all filters
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: C.bg }}>
      {isWeb ? <WebHeader /> : null}

      {/* ── TOP BAR ── */}
      {isMobile && (
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            backgroundColor: C.white,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
            paddingHorizontal: px,
            paddingVertical: 10,
            ...(isWeb
              ? { position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }
              : {}),
          }}>
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            {/* Back */}
            {!isWeb && (
              <Pressable
                onPress={() => router.back()}
                style={{
                  fontFamily: 'Poppins_400Regular',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: C.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: C.border,
                }}>
                <Ionicons name="arrow-back" size={18} color={C.dark} />
              </Pressable>
            )}

            {/* Search */}
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.bg,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: C.border,
                paddingHorizontal: 12,
                paddingVertical: isMobile ? 2 : 10,
                gap: 8,
                width: isMobile ? '50%' : 'fit-content',
              }}>
              <Ionicons name="search-outline" size={17} color={C.muted} />
              <TextInput
                placeholder="Search dental products..."
                placeholderTextColor={C.muted}
                value={search}
                onChangeText={setSearch}
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flex: 1,
                  fontSize: 14,
                  color: C.dark,
                  fontWeight: '500',
                  ...(isWeb ? { outlineStyle: 'none' } : {}),
                }}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={17} color={C.muted} />
                </Pressable>
              )}
            </View>

            {/* View toggle */}
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: C.border,
                overflow: 'hidden',
              }}>
              {['grid', 'list'].map((mode) => (
                <Pressable
                  key={mode}
                  onPress={() => setViewMode(mode)}
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: viewMode === mode ? C.primary : C.white,
                  }}>
                  <Ionicons
                    name={mode === 'grid' ? 'grid-outline' : 'list-outline'}
                    size={17}
                    color={viewMode === mode ? '#fff' : C.muted}
                  />
                </Pressable>
              ))}
            </View>

            {/* Filter btn (mobile) */}
            {!isDesktop && (
              <Pressable
                onPress={() => setShowFilter(true)}
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: activeFilterCount > 0 ? C.primary : C.bg,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeFilterCount > 0 ? C.primary : C.border,
                }}>
                <Ionicons
                  name="options-outline"
                  size={17}
                  color={activeFilterCount > 0 ? '#fff' : C.dark}
                />
                {activeFilterCount > 0 && (
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 10,
                        fontWeight: '800',
                        color: C.primary,
                      }}>
                      {activeFilterCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>

          {/* Active filter chips */}
          {filterChips.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingTop: 10 }}>
              {filterChips.map((chip) => (
                <Pressable
                  key={chip.key}
                  onPress={() => clearChip(chip.key)}
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: C.primaryLight,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: '#ffffff',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 12,
                      fontWeight: '600',
                      color: C.primary,
                    }}>
                    {chip.label}
                  </Text>
                  <Ionicons name="close" size={13} color={C.primary} />
                </Pressable>
              ))}
              {filterChips.length > 1 && (
                <Pressable
                  onPress={() =>
                    setFilters({ category: '', sort: '-createdAt', priceMin: '', priceMax: '' })
                  }
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: '#fee2e2',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#dc2626',
                    }}>
                    Clear all
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* ── BODY ── */}
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          flex: 1,
          flexDirection: isDesktop ? 'row' : 'column',
        }}>
        {/* ── Desktop Sidebar ── */}
        {isDesktop && (
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              width: 248,
              backgroundColor: C.white,
              borderRightWidth: 1,
              borderRightColor: C.border,
              padding: 20,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 18,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 16,
                    fontWeight: '900',
                    color: C.dark,
                  }}>
                  Filters
                </Text>
                {activeFilterCount > 0 && (
                  <Pressable
                    onPress={() =>
                      setFilters({ category: '', sort: '-createdAt', priceMin: '', priceMax: '' })
                    }>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 12,
                        color: '#dc2626',
                        fontWeight: '600',
                      }}>
                      Reset all
                    </Text>
                  </Pressable>
                )}
                {isWeb && (
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      flexDirection: 'row',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: C.border,
                      overflow: 'hidden',
                    }}>
                    {['grid', 'list'].map((mode) => (
                      <Pressable
                        key={mode}
                        onPress={() => setViewMode(mode)}
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          width: 36,
                          height: 36,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: viewMode === mode ? C.primary : C.white,
                        }}>
                        <Ionicons
                          name={mode === 'grid' ? 'grid-outline' : 'list-outline'}
                          size={17}
                          color={viewMode === mode ? '#fff' : C.muted}
                        />
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <FilterPanel
                categories={categories}
                filters={filters}
                onChange={setFilters}
                isMobile={false}
              />
            </ScrollView>
          </View>
        )}

        {/* ── Product List ── */}
        <View style={{ fontFamily: 'Poppins_400Regular', flex: 1 }}>
          {/* Result count bar */}
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              paddingHorizontal: px,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: C.muted }}>
              {loading ? 'Searching...' : `${products.length}${hasMore ? '+' : ''} products found`}
            </Text>
            {/* Sort quick select on desktop */}
            {isDesktop && (
              <View style={{ fontFamily: 'Poppins_400Regular', flexDirection: 'row', gap: 6 }}>
                {SORT_OPTIONS.slice(0, 3).map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => setFilters((p) => ({ ...p, sort: opt.value }))}
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 8,
                      backgroundColor: filters.sort === opt.value ? C.primary : C.bg,
                      borderWidth: 1,
                      borderColor: filters.sort === opt.value ? C.primary : C.border,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 12,
                        fontWeight: '600',
                        color: filters.sort === opt.value ? '#fff' : C.dark,
                      }}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Loading skeleton */}
          {loading ? (
            <ScrollView contentContainerStyle={{ padding: px }}>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: cardGap,
                }}>
                {Array(PAGE_LIMIT)
                  .fill(0)
                  .map((_, i) => (
                    <View
                      key={i}
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        width: cardWidth,
                        borderRadius: 18,
                        overflow: 'hidden',
                        backgroundColor: C.white,
                        borderWidth: 1,
                        borderColor: C.border,
                      }}>
                      <View
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          height: cardWidth * 0.85,
                          backgroundColor: '#e2e8f0',
                        }}
                      />
                      <View style={{ fontFamily: 'Poppins_400Regular', padding: 11, gap: 8 }}>
                        <View
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            height: 12,
                            backgroundColor: '#e2e8f0',
                            borderRadius: 6,
                            width: '80%',
                          }}
                        />
                        <View
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            height: 12,
                            backgroundColor: '#e2e8f0',
                            borderRadius: 6,
                            width: '50%',
                          }}
                        />
                        <View
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            height: 34,
                            backgroundColor: '#e2e8f0',
                            borderRadius: 9,
                          }}
                        />
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
          ) : viewMode === 'list' ? (
            // ── LIST VIEW ──
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ padding: px, paddingBottom: 24 }}
              renderItem={({ item }) => (
                <ProductCardList
                  item={item}
                  onPress={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Cart:', item._id)}
                />
              )}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
            />
          ) : (
            // ── GRID VIEW ──
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              numColumns={numCols}
              key={`grid-${numCols}`} // re-mount on col change
              contentContainerStyle={{ padding: px, paddingBottom: 24 }}
              columnWrapperStyle={numCols > 1 ? { gap: cardGap } : undefined}
              renderItem={({ item }) => (
                <ProductCardGrid
                  item={item}
                  cardWidth={cardWidth}
                  onPress={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Cart:', item._id)}
                />
              )}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
            />
          )}
        </View>
      </View>

      {/* ── Mobile Bottom Sheet Filter ── */}
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilter(false)}>
        <Pressable
          style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={() => setShowFilter(false)}
        />
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: C.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: '85%',
          }}>
          {/* Handle */}
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.border,
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 18,
                fontWeight: '900',
                color: C.dark,
              }}>
              Filters
            </Text>
            <Pressable onPress={() => setShowFilter(false)}>
              <Ionicons name="close" size={22} color={C.dark} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FilterPanel
              categories={categories}
              filters={filters}
              onChange={setFilters}
              onClose={() => setShowFilter(false)}
              isMobile
            />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
