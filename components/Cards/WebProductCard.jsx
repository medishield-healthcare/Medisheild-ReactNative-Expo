import C from '@/utils/theme';

import { Image, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useState } from 'react';
import AddToCartButton from 'components/Cart/AddToCartButton';

function WebProductCard({ item, onBuy, onCart, cols }) {
  const [hovered, setHovered] = useState(false);

  const { width } = useWindowDimensions();

  const isMobile = width < 640;

  const isTablet = width >= 640 && width < 1024;

  // ─────────────────────────────────────────────
  // CARD WIDTH
  // ─────────────────────────────────────────────

  const cardPct = `${(100 / cols).toFixed(2)}%`;

  // ─────────────────────────────────────────────
  // PRODUCT DATA
  // ─────────────────────────────────────────────

  const productName = item?.name || 'Product';

  const salePrice = item?.price?.minimalPrice ?? item?.price?.salePrice ?? 0;

  const regularPrice = item?.price?.regularPrice ?? 0;

  const hasDiscount = regularPrice > salePrice;

  const discount =
    hasDiscount && regularPrice > 0
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : null;

  const rating = Number(item?.average_rating || 0);

  const ratingCount = Number(item?.rating_count || 0);

  const isInStock = item?.is_in_stock !== false;

  // ─────────────────────────────────────────────
  // IMAGE HEIGHT
  // ─────────────────────────────────────────────

  const imageHeight = isMobile ? 165 : isTablet ? 185 : 215;

  return (
    <Pressable
      onPress={() => onBuy(item?._id)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width: cardPct,

        marginBottom: 20,

        backgroundColor: C.card || '#ffffff',

        borderRadius: 18,

        overflow: 'hidden',

        borderWidth: 1,

        borderColor: hovered ? C.primary : C.border,

        transform: [
          {
            translateY: hovered ? -4 : 0,
          },
        ],

        boxShadow: hovered ? '0 14px 38px rgba(15,118,110,0.14)' : '0 3px 14px rgba(0,0,0,0.05)',

        transition: 'all 0.22s ease',
      }}>
      {/* ═══════════════════════════════════════ */}
      {/* PRODUCT IMAGE */}
      {/* ═══════════════════════════════════════ */}

      <View
        style={{
          position: 'relative',

          backgroundColor: '#f8fafb',

          height: imageHeight,

          overflow: 'hidden',
        }}>
        <Image
          source={
            item?.thumbnail_url?.startsWith('/')
              ? require('../../assets/Image-not-found.png')
              : {
                  uri: item?.thumbnail_url,
                }
          }
          style={{
            width: '100%',
            height: '100%',
            transform: [
              {
                scale: hovered ? 1.04 : 1,
              },
            ],
            transition: 'transform 0.25s ease',
          }}
          resizeMode="contain"
        />

        {/* ───────────────────────────────────── */}
        {/* FEATURED BADGE */}
        {/* ───────────────────────────────────── */}

        {item?.featured && (
          <View
            style={{
              position: 'absolute',

              top: 11,
              left: 11,

              backgroundColor: C.accent,

              paddingHorizontal: 8,
              paddingVertical: 5,

              borderRadius: 6,

              flexDirection: 'row',
              alignItems: 'center',

              gap: 4,
            }}>
            <Ionicons name="flash" size={10} color="#fff" />

            <Text
              style={{
                color: '#fff',

                fontSize: 8,

                fontWeight: '900',

                letterSpacing: 0.7,
              }}>
              FEATURED
            </Text>
          </View>
        )}

        {/* ───────────────────────────────────── */}
        {/* DISCOUNT BADGE */}
        {/* ───────────────────────────────────── */}

        {discount && (
          <View
            style={{
              position: 'absolute',

              left: 11,

              bottom: 11,

              backgroundColor: '#dc2626',

              paddingHorizontal: 8,
              paddingVertical: 5,

              borderRadius: 6,
            }}>
            <Text
              style={{
                color: '#fff',

                fontSize: 9,

                fontWeight: '900',
              }}>
              {discount}% OFF
            </Text>
          </View>
        )}

        {/* ───────────────────────────────────── */}
        {/* WISHLIST */}
        {/* ───────────────────────────────────── */}

        <Pressable
          onPress={(event) => {
            event?.stopPropagation?.();
          }}
          style={{
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

            transition: 'all 0.2s ease',
          }}>
          <Ionicons name="heart-outline" size={18} color={C.dark} />
        </Pressable>

        {/* ───────────────────────────────────── */}
        {/* QUICK ADD OVERLAY */}
        {/* ───────────────────────────────────── */}

        {hovered && (
          <Pressable
            onPress={(event) => {
              event?.stopPropagation?.();

              onCart(item);
            }}
            style={{
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
              style={{
                color: '#fff',

                fontSize: 11,

                fontWeight: '800',

                letterSpacing: 0.3,
              }}>
              QUICK ADD
            </Text>
          </Pressable>
        )}
      </View>

      {/* ═══════════════════════════════════════ */}
      {/* PRODUCT INFORMATION */}
      {/* ═══════════════════════════════════════ */}

      <View
        style={{
          padding: isMobile ? 12 : 15,
        }}>
        {/* ───────────────────────────────────── */}
        {/* BRAND */}
        {/* ───────────────────────────────────── */}

        {item?.manufacturer && (
          <Text
            numberOfLines={1}
            style={{
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

        {/* ───────────────────────────────────── */}
        {/* PRODUCT NAME */}
        {/* ───────────────────────────────────── */}

        <Pressable
          onPress={(event) => {
            event?.stopPropagation?.();

            onBuy(item?._id);
          }}
          style={{
            height: 66,
            // backgroundColor:"black"
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: isMobile ? 12 : 14,

              fontWeight: '700',

              color: C.dark,
            }}>
            {productName.slice(0, 40)}
          </Text>
          <Text style={{ color: C.dark, fontSize: isMobile ? 10 : 10 }}>
            {item.short_description?.slice(0, 100)}
          </Text>
        </Pressable>

        {/* ───────────────────────────────────── */}
        {/* RATING */}
        {/* ───────────────────────────────────── */}

        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',

            marginTop: 9,

            minHeight: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              backgroundColor: '#fff7ed',

              borderRadius: 5,

              paddingHorizontal: 6,

              paddingVertical: 3,

              gap: 3,
            }}>
            <Ionicons name="star" size={10} color="#f59e0b" />

            <Text
              style={{
                fontSize: 9,

                fontWeight: '800',

                color: '#92400e',
              }}>
              {rating ? rating.toFixed(1) : '0.0'}
            </Text>
          </View>

          {ratingCount > 0 && (
            <Text
              style={{
                marginLeft: 6,

                color: C.muted,

                fontSize: 9,
              }}>
              ({ratingCount})
            </Text>
          )}
        </View>

        {/* ───────────────────────────────────── */}
        {/* PRICE */}
        {/* ───────────────────────────────────── */}

        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',

            flexWrap: 'wrap',

            gap: 7,

            marginTop: 11,

            // marginBottom: 12,
          }}>
          <Text
            style={{
              fontSize: isMobile ? 16 : 18,

              fontWeight: '900',

              color: C.primary,
            }}>
            ₹{Number(salePrice || 0).toLocaleString('en-IN')}
          </Text>

          {hasDiscount && (
            <Text
              style={{
                fontSize: 11,

                color: C.muted,

                textDecorationLine: 'line-through',
              }}>
              ₹{Number(regularPrice).toLocaleString('en-IN')}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <Text
            style={{
              fontSize: 11,
              color: C.muted,
            }}>
            You save{' '}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: C.primary,
            }}>
            ₹{Number(regularPrice - salePrice).toLocaleString('en-IN')}
          </Text>
        </View>
        {/* ───────────────────────────────────── */}
        {/* STOCK */}
        {/* ───────────────────────────────────── */}

        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',

            marginBottom: 12,
          }}>
          <View
            style={{
              width: 6,
              height: 6,

              borderRadius: 3,

              backgroundColor: isInStock ? '#10b981' : '#ef4444',
            }}
          />

          <Text
            style={{
              marginLeft: 6,

              fontSize: 9,

              fontWeight: '700',

              color: isInStock ? '#047857' : '#dc2626',
            }}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>

        {/* ───────────────────────────────────── */}
        {/* ADD TO CART */}
        {/* ───────────────────────────────────── */}

        <Pressable
          onPress={() => {
            onBuy(item?._id);
          }}
          style={{
            height: 40,
            borderWidth: 1.5,
            backgroundColor: C.primary,
            borderColor: C.primary,

            alignItems: 'center',

            justifyContent: 'center',

            flexDirection: 'row',

            gap: 6,
            color: 'white',
            transition: 'all 0.2s ease',
          }}>
          {/* <Ionicons
            name="bag-outline"
            size={15}
            color="#fff"
          /> */}

          <Text
            style={{
              fontSize: 11,

              fontWeight: '800',

              color: hovered ? '#fff' : '#fff',

              letterSpacing: 0.2,
            }}>
            Buy Now
          </Text>
        </Pressable>
        {/* <AddToCartButton
          productId={item._id}
          variant={item.sku || item._id}
          price={item.price.regularPrice}
          fullWidth={true}
        /> */}
      </View>
    </Pressable>
  );
}

export default WebProductCard;
