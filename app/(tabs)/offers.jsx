import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';

import API from '@/api/axios';
import C from '@/utils/theme';
import Footer from 'components/Footer/Footer';
import WebHeader from 'components/Header/header.web';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
// ─────────────────────────────────────────────────────────────
// BREAKPOINT
// ─────────────────────────────────────────────────────────────

function useBreakpoint() {
  const { width } = useWindowDimensions();

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,

    cols: width < 480 ? 1 : width < 768 ? 2 : width < 1100 ? 3 : 4,

    px: width < 640 ? 16 : width < 1024 ? 24 : 48,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// const API_BASE_URL = 'http://192.168.1.15:5000';

function getImageUrl(url) {
  if (!url) return null;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return url;
}

function formatPrice(value) {
  const number = Number(value || 0);

  return `₹${number.toLocaleString('en-IN')}`;
}

function getDiscount(price, regularPrice) {
  const sale = Number(price || 0);
  const regular = Number(regularPrice || 0);

  if (!sale || !regular || regular <= sale) {
    return null;
  }

  return Math.round(((regular - sale) / regular) * 100);
}

function getRating(product) {
  const rating = Number(product?.average_rating || 0);

  if (!rating) return '0.0';

  return rating.toFixed(1);
}

function getCategoryName(product) {
  const categories = product?.categories || [];

  const category = categories.find((item) => item?.name && item.name.toLowerCase() !== 'offers');

  return category?.name || 'Dental Care';
}

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────

function OfferProductCard({ product, width, onPress }) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlist = async () => {
    if (wishlistLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (!product?._id) return;

    try {
      setWishlistLoading(true);

      const res = await API.put('/product/wishlist', {
        prodId: product?._id,
      });

      // Backend updated user return karta hai
      setUser(res.data);
    } catch (error) {
      console.log('Wishlist error:', error?.response?.data || error?.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const wishlisted =
    user?.wishlist?.some((id) => id.toString() === product?._id?.toString()) || false;

  const image = getImageUrl(product?.thumbnail_url);

  const salePrice = Number(product?.price?.minimalPrice || 0);

  const regularPrice = Number(product?.price?.regularPrice || 0);

  const discount = getDiscount(salePrice, regularPrice);

  const rating = getRating(product);

  const inStock = product?.is_in_stock === true && Number(product?.max_sale_qty ?? 1) > 0;

  const cardWidth =
    width >= 1100 ? '23.5%' : width >= 768 ? '31.8%' : width >= 480 ? '48%' : '100%';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: cardWidth,
        marginBottom: 22,
        opacity: pressed ? 0.94 : 1,
      })}>
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          backgroundColor: '#fff',
          borderRadius: 18,
          borderWidth: 1,
          borderColor: '#e8eeee',
          overflow: 'hidden',

          shadowColor: '#0f172a',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: Platform.OS === 'web' ? 0.06 : 0.04,
          shadowRadius: 14,
          elevation: 2,
        }}>
        {/* IMAGE AREA */}
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            height: 235,
            backgroundColor: '#f8fafb',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* OFFER BADGE */}
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 5,
              backgroundColor: C.primary || '#CD0F0F',
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 7,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                color: '#fff',
                fontSize: 9,
                fontWeight: '900',
                letterSpacing: 0.7,
              }}>
              OFFER
            </Text>
          </View>

          {/* WISHLIST */}
          <Pressable
            onPress={handleWishlist}
            style={{
              fontFamily: 'Poppins_400Regular',
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 5,

              width: 36,
              height: 36,
              borderRadius: 18,

              backgroundColor: '#fff',

              alignItems: 'center',
              justifyContent: 'center',

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.08,
              shadowRadius: 5,
              elevation: 2,
            }}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={19}
              color={wishlisted ? C.primary : C.primaryDark}
            />
          </Pressable>

          {/* PRODUCT IMAGE */}
          {image ? (
            <Image
              source={
                !image
                  ? require('../../assets/Image-not-found.png') 
                  : image.startsWith('/')
                    ? {
                        uri: `https://images1.dentalkart.com/media/catalog/product${image}`,
                      }
                    : {
                        uri: image,
                      }
              }
              resizeMode="contain"
              style={{ fontFamily: 'Poppins_400Regular', width: '84%', height: '84%' }}
            />
          ) : (
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="image-outline" size={44} color="#cbd5e1" />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  marginTop: 7,
                  color: '#94a3b8',
                  fontSize: 10,
                  fontWeight: '600',
                }}>
                No image
              </Text>
            </View>
          )}
        </View>

        {/* CONTENT */}
        <View style={{ fontFamily: 'Poppins_400Regular', padding: 15 }}>
          {/* CATEGORY */}
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins_400Regular',
              color: C.primary || '#CD0F0F',
              fontSize: 9,
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 6,
            }}>
            {getCategoryName(product)}
          </Text>

          {/* PRODUCT NAME */}
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'Poppins_400Regular',
              color: '#0f172a',
              fontSize: 17,
              lineHeight: 20,
              fontWeight: '800',
              minHeight: 40,
            }}>
            {product?.name || 'Product'}
          </Text>

          {/* BRAND */}
          {!!product?.manufacturer && (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins_400Regular',
                marginTop: 7,
                color: '#64748b',
                fontSize: 10,
                fontWeight: '600',
              }}>
              {product.manufacturer}
            </Text>
          )}

          {/* RATING */}
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 9,
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff7ed',
                paddingHorizontal: 7,
                paddingVertical: 4,
                borderRadius: 6,
              }}>
              <Ionicons name="star" size={11} color="#f59e0b" />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  marginLeft: 4,
                  fontSize: 10,
                  fontWeight: '800',
                  color: '#92400e',
                }}>
                {rating}
              </Text>
            </View>

            {!!product?.rating_count && (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  marginLeft: 7,
                  color: '#94a3b8',
                  fontSize: 10,
                }}>
                ({product.rating_count})
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
              marginTop: 13,
              gap: 7,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                color: '#0f172a',
                fontSize: 20,
                fontWeight: '900',
              }}>
              {formatPrice(salePrice)}
            </Text>

            {regularPrice > salePrice && (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  color: '#94a3b8',
                  fontSize: 11,
                  fontWeight: '600',
                  textDecorationLine: 'line-through',
                }}>
                {formatPrice(regularPrice)}
              </Text>
            )}

            {discount && (
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  backgroundColor: '#ecfdf5',
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: '#047857',
                    fontSize: 9,
                    fontWeight: '900',
                  }}>
                  {discount}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* SHORT DESCRIPTION */}
          {!!product?.short_description && (
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Poppins_400Regular',
                marginTop: 8,
                color: '#64748b',
                fontSize: 10,
                lineHeight: 16,
              }}>
              {product.short_description}
            </Text>
          )}

          {/* STOCK */}
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: inStock ? '#10b981' : '#ef4444',
              }}
            />

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                marginLeft: 6,
                color: inStock ? '#047857' : '#dc2626',
                fontSize: 10,
                fontWeight: '700',
              }}>
              {inStock ? 'In Stock' : 'Currently unavailable'}
            </Text>
          </View>

          {/* VIEW PRODUCT */}
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              marginTop: 14,
              height: 40,
              // borderRadius: 9,
              backgroundColor: C.primary || '#CD0F0F',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                color: '#fff',
                fontSize: 10,
                fontWeight: '900',
                letterSpacing: 0.5,
              }}>
              Buy Now
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color="#fff"
              style={{ fontFamily: 'Poppins_400Regular', marginLeft: 7 }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING
// ─────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        minHeight: 500,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={C.primary || '#CD0F0F'} />

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 14,
          color: '#64748b',
          fontSize: 12,
          fontWeight: '700',
        }}>
        Loading offers...
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// ERROR
// ─────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }) {
  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        minHeight: 430,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
      }}>
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#fef2f2',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="cloud-offline-outline" size={30} color="#ef4444" />
      </View>

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 18,
          color: '#0f172a',
          fontSize: 19,
          fontWeight: '900',
          textAlign: 'center',
        }}>
        Couldn't load offers
      </Text>

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 7,
          maxWidth: 400,
          color: '#64748b',
          fontSize: 12,
          lineHeight: 19,
          textAlign: 'center',
        }}>
        {message || 'Something went wrong while fetching the latest offers.'}
      </Text>

      <Pressable
        onPress={onRetry}
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 20,
          height: 42,
          paddingHorizontal: 20,
          borderRadius: 9,
          backgroundColor: C.primary || '#CD0F0F',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="refresh" size={15} color="#fff" />

        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            marginLeft: 7,
            color: '#fff',
            fontSize: 11,
            fontWeight: '900',
          }}>
          TRY AGAIN
        </Text>
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// EMPTY
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  const router = useRouter();

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        minHeight: 430,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
      }}>
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          width: 82,
          height: 82,
          borderRadius: 41,
          backgroundColor: '#f0fdfa',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="pricetag-outline" size={35} color={C.primary || '#CD0F0F'} />
      </View>

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 20,
          color: '#0f172a',
          fontSize: 20,
          fontWeight: '900',
          textAlign: 'center',
        }}>
        No offers available
      </Text>

      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 7,
          maxWidth: 390,
          color: '#64748b',
          fontSize: 12,
          lineHeight: 19,
          textAlign: 'center',
        }}>
        We don't have any active offers right now. Check back soon for new deals.
      </Text>

      <Pressable
        onPress={() => router.back()}
        style={{
          fontFamily: 'Poppins_400Regular',
          marginTop: 20,
          height: 42,
          paddingHorizontal: 22,
          borderRadius: 9,
          backgroundColor: C.primary || '#CD0F0F',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            color: '#fff',
            fontSize: 11,
            fontWeight: '900',
          }}>
          CONTINUE SHOPPING
        </Text>
      </Pressable>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// OFFERS PAGE
// ─────────────────────────────────────────────────────────────

function Offers() {
  const router = useRouter();

  const { width, isMobile, isTablet, isDesktop, px } = useBreakpoint();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  // ─────────────────────────────────────────────
  // FETCH OFFERS
  // ─────────────────────────────────────────────

  const fetchOffers = useCallback(async ({ pageNumber = 1, append = false } = {}) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const res = await API.get('/product', {
        params: {
          page: pageNumber,
          limit: 12,
          sort: '-createdAt',
          category: 'Offers',
        },
      });

      console.log('OFFERS API RESPONSE:', res.data);

      const incoming = Array.isArray(res?.data?.data) ? res.data.data : [];

      console.log('OFFERS PRODUCTS:', incoming);

      if (append) {
        setProducts((prev) => [...prev, ...incoming]);
      } else {
        setProducts(incoming);
      }

      setPage(pageNumber);

      // If less than 12 came back,
      // assume there are no more products.
      setHasMore(incoming.length === 12);
    } catch (err) {
      console.log('OFFERS API ERROR:', err?.response?.data || err?.message || err);

      if (!append) {
        setError(err?.response?.data?.message || 'Unable to load offers right now.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  // ─────────────────────────────────────────────
  // INITIAL LOAD
  // ─────────────────────────────────────────────

  useEffect(() => {
    fetchOffers({
      pageNumber: 1,
      append: false,
    });
  }, [fetchOffers]);

  // ─────────────────────────────────────────────
  // REFRESH
  // ─────────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);

    fetchOffers({
      pageNumber: 1,
      append: false,
    });
  };

  // ─────────────────────────────────────────────
  // LOAD MORE
  // ─────────────────────────────────────────────

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    fetchOffers({
      pageNumber: page + 1,
      append: true,
    });
  };

  // ─────────────────────────────────────────────
  // HEADER STATS
  // ─────────────────────────────────────────────

  const stats = useMemo(() => {
    const inStock = products.filter((product) => product?.is_in_stock === true).length;

    return {
      total: products.length,
      inStock,
    };
  }, [products]);

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <ScrollView
        style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <LoadingState />
      </ScrollView>
    );
  }

  // ─────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────

  if (error && products.length === 0) {
    return (
      <ScrollView
        style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <ErrorState
          message={error}
          onRetry={() =>
            fetchOffers({
              pageNumber: 1,
              append: false,
            })
          }
        />
      </ScrollView>
    );
  }

  // ─────────────────────────────────────────────
  // EMPTY
  // ─────────────────────────────────────────────

  if (!products.length) {
    return (
      <ScrollView
        style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <EmptyState />
      </ScrollView>
    );
  }

  // ─────────────────────────────────────────────
  // MAIN
  // ─────────────────────────────────────────────

  return (
    <SafeAreaView style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: '#fff' }}>
      <WebHeader />
      <ScrollView
        style={{ fontFamily: 'Poppins_400Regular', flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={
          {
            //   paddingBottom: 50,
          }
        }>
        {/* HERO */}
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            paddingHorizontal: px,
            paddingTop: isMobile ? 28 : 46,
            paddingBottom: isMobile ? 28 : 40,

            backgroundColor: C.primaryDark || '#064e3b',
          }}>
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              maxWidth: 1250,
              width: '100%',
              alignSelf: 'center',
            }}>
            {/* EYEBROW */}
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  width: 28,
                  height: 1,
                  backgroundColor: '#ffffff',
                }}
              />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  marginLeft: 9,
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: '900',
                  letterSpacing: 1.8,
                }}>
                MEDISHIELD DEALS
              </Text>
            </View>

            {/* TITLE */}
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                marginTop: 13,
                color: '#fff',
                fontSize: isMobile ? 32 : isTablet ? 42 : 52,
                lineHeight: isMobile ? 38 : isTablet ? 50 : 60,
                fontWeight: '900',
                letterSpacing: -1.3,
                maxWidth: 700,
              }}>
              Better products.
              {'\n'}
              Better prices.
            </Text>

            {/* DESCRIPTION */}
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                marginTop: 12,
                color: C.white,
                fontSize: isMobile ? 12 : 13,
                lineHeight: 21,
                maxWidth: 620,
              }}>
              Explore our latest dental product offers and discover professional essentials at
              exceptional prices.
            </Text>

            {/* STATS */}
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: isMobile ? 'column' : 'row',
                marginTop: 26,
                gap: isMobile ? 10 : 12,
              }}>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  minWidth: 135,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.10)',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '900',
                  }}>
                  {stats.total}
                </Text>

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    marginTop: 2,
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: '700',
                  }}>
                  PRODUCTS SHOWN
                </Text>
              </View>

              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  minWidth: 135,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.10)',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: '900',
                  }}>
                  {stats.inStock}
                </Text>

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    marginTop: 2,
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: '700',
                  }}>
                  READY TO SHIP
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PRODUCT SECTION */}
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            paddingHorizontal: px,
            paddingTop: isMobile ? 25 : 38,
          }}>
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              maxWidth: 1250,
              width: '100%',
              alignSelf: 'center',
            }}>
            {/* SECTION HEADER */}
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 22,
                gap: 12,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: '#0f172a',
                    fontSize: isMobile ? 22 : 28,
                    fontWeight: '900',
                    letterSpacing: -0.6,
                  }}>
                  Offers for you
                </Text>

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    marginTop: 4,
                    color: '#64748b',
                    fontSize: 11,
                  }}>
                  Handpicked deals from our dental product collection.
                </Text>
              </View>

              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  alignSelf: isMobile ? 'flex-start' : 'auto',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 7,
                  backgroundColor: C.primaryLight || '#FDF2F2',
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: C.primaryDark || '#CD0F0F',
                    fontSize: 10,
                    fontWeight: '800',
                  }}>
                  {products.length} PRODUCTS
                </Text>
              </View>
            </View>

            {/* GRID */}
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: width >= 480 ? 'space-evenly' : 'flex-start',
              }}>
              {products.map((product, index) => (
                <OfferProductCard
                  key={product?._id || product?.id || product?.sku || index}
                  product={product}
                  width={width}
                  onPress={() => {
                    const id = product?._id || product?.id;

                    if (id) {
                      router.push(`/product/${id}`);
                    }
                  }}
                />
              ))}
            </View>

            {/* LOAD MORE */}
            {hasMore && (
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  alignItems: 'center',
                  paddingTop: 8,
                  paddingBottom: 25,
                }}>
                <Pressable
                  onPress={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    minWidth: 170,
                    height: 44,
                    paddingHorizontal: 22,
                    borderRadius: 9,
                    borderWidth: 1,
                    borderColor: C.primary || '#CD0F0F',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  {loadingMore ? (
                    <ActivityIndicator size="small" color={C.primary || '#CD0F0F'} />
                  ) : (
                    <>
                      <Text
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          color: C.primary || '#CD0F0F',
                          fontSize: 11,
                          fontWeight: '900',
                          letterSpacing: 0.4,
                        }}>
                        LOAD MORE
                      </Text>

                      <Ionicons
                        name="arrow-down"
                        size={14}
                        color={C.primary || '#CD0F0F'}
                        style={{ fontFamily: 'Poppins_400Regular', marginLeft: 7 }}
                      />
                    </>
                  )}
                </Pressable>
              </View>
            )}

            {/* END MESSAGE */}
            {!hasMore && products.length > 0 && (
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  alignItems: 'center',
                  paddingVertical: 25,
                }}>
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 35,
                    height: 1,
                    backgroundColor: '#cbd5e1',
                    marginBottom: 10,
                  }}
                />

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: '#94a3b8',
                    fontSize: 10,
                    fontWeight: '600',
                  }}>
                  You've reached the end
                </Text>
              </View>
            )}
          </View>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Offers;
