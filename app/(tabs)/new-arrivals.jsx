import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import API from '@/api/axios';
import C from '@/utils/theme';


import WebProductCard from 'components/Cards/WebProductCard';
import GridSkeleton from 'components/Cards/GridSkeleton';
import NoProdcucts from 'components/Section/NoProdcucts';
import WebHeader from 'components/Header/header.web';
import Footer from 'components/Footer/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────
// BREAKPOINT
// ─────────────────────────────────────────────

function useBreakpoint() {
  const { width } = useWindowDimensions();

  return {
    width,

    isMobile: width < 640,

    isTablet: width >= 640 && width < 1024,

    isDesktop: width >= 1024,

    cols: width < 480 ? 2 : width < 768 ? 2 : width < 1024 ? 3 : 4,

    px: width < 640 ? 16 : width < 1024 ? 24 : 40,
  };
}

// ─────────────────────────────────────────────
// NEW ARRIVALS
// ─────────────────────────────────────────────

function NewArrivals() {
  const router = useRouter();

  const { isMobile, isTablet, isDesktop, cols, px } = useBreakpoint();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  // ─────────────────────────────────────────
  // FETCH NEW ARRIVALS
  // ─────────────────────────────────────────

  const fetchNewArrivals = useCallback(async ({ pageNumber = 1, append = false } = {}) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const response = await API.get('/product', {
        params: {
          page: pageNumber,
          limit: 12,
          sort: '-createdAt',
        },
      });

      console.log('NEW ARRIVALS RESPONSE:', response?.data);

      const newProducts = Array.isArray(response?.data?.data) ? response.data.data : [];

      if (append) {
        setProducts((prev) => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setPage(pageNumber);

      // API returns 12 => there may
      // be more products available
      setHasMore(newProducts.length === 12);
    } catch (err) {
      console.log('NEW ARRIVALS ERROR:', err?.response?.data || err?.message || err);

      if (!append) {
        setError(err?.response?.data?.message || 'Unable to load new arrivals.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  // ─────────────────────────────────────────
  // INITIAL FETCH
  // ─────────────────────────────────────────

  useEffect(() => {
    fetchNewArrivals({
      pageNumber: 1,
      append: false,
    });
  }, [fetchNewArrivals]);

  // ─────────────────────────────────────────
  // REFRESH
  // ─────────────────────────────────────────

  const handleRefresh = () => {
    setRefreshing(true);

    fetchNewArrivals({
      pageNumber: 1,
      append: false,
    });
  };

  // ─────────────────────────────────────────
  // LOAD MORE
  // ─────────────────────────────────────────

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    fetchNewArrivals({
      pageNumber: page + 1,
      append: true,
    });
  };

  // ─────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────

  if (loading) {
    return (
      <View
        style={{ fontFamily : 'Poppins_400Regular',
          flex: 1,
          backgroundColor: C.bg,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: px,
            paddingVertical: 30,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              maxWidth: 1240,
              width: '100%',
              alignSelf: 'center',
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                marginBottom: 25,
              }}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: isMobile ? 26 : 32,

                  fontWeight: '900',

                  color: C.dark,
                }}>
                New Arrivals
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  fontSize: 13,

                  color: C.muted,

                  marginTop: 5,
                }}>
                Discover our latest dental products
              </Text>
            </View>

            <GridSkeleton cols={cols} />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────

  if (error && products.length === 0) {
    return (
      <View
        style={{ fontFamily : 'Poppins_400Regular',
          flex: 1,

          backgroundColor: C.bg,

          alignItems: 'center',

          justifyContent: 'center',

          paddingHorizontal: 25,
        }}>
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: 70,
            height: 70,

            borderRadius: 35,

            backgroundColor: '#fef2f2',

            alignItems: 'center',

            justifyContent: 'center',
          }}>
          <Ionicons name="cloud-offline-outline" size={32} color="#ef4444" />
        </View>

        <Text
          style={{ fontFamily : 'Poppins_400Regular',
            marginTop: 18,

            fontSize: 20,

            fontWeight: '900',

            color: C.dark,

            textAlign: 'center',
          }}>
          Couldn't load products
        </Text>

        <Text
          style={{ fontFamily : 'Poppins_400Regular',
            marginTop: 7,

            fontSize: 12,

            color: C.muted,

            textAlign: 'center',

            maxWidth: 400,

            lineHeight: 18,
          }}>
          {error}
        </Text>

        <Pressable
          onPress={() =>
            fetchNewArrivals({
              pageNumber: 1,
              append: false,
            })
          }
          style={{ fontFamily : 'Poppins_400Regular',
            marginTop: 20,

            backgroundColor: C.primary,

            borderRadius: 10,

            paddingHorizontal: 20,

            paddingVertical: 11,

            flexDirection: 'row',

            alignItems: 'center',

            gap: 7,
          }}>
          <Ionicons name="refresh" size={15} color="#fff" />

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              color: '#fff',

              fontSize: 12,

              fontWeight: '800',
            }}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  // ─────────────────────────────────────────
  // MAIN PAGE
  // ─────────────────────────────────────────

  return (
    <SafeAreaView
      style={{ fontFamily : 'Poppins_400Regular',
        flex: 1,

        backgroundColor: C.bg,
      }}>
        <WebHeader/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{
        //   paddingBottom: 60,
        }}>
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            maxWidth: 1240,

            width: '100%',

            alignSelf: 'center',

            paddingHorizontal: px,

            paddingTop: isMobile ? 25 : 35,
          }}>
          {/* ═══════════════════════════════ */}
          {/* HEADER */}
          {/* ═══════════════════════════════ */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              marginBottom: 25,
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flexDirection: 'row',

                alignItems: 'center',

                justifyContent: 'space-between',

                gap: 15,
              }}>
              {/* TITLE */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flex: 1,
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',

                    alignItems: 'center',

                    gap: 8,
                  }}>
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      width: 8,
                      height: 8,

                      borderRadius: 4,

                      backgroundColor: C.primary,
                    }}
                  />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: isMobile ? 26 : 32,

                      fontWeight: '900',

                      color: C.dark,

                      letterSpacing: -0.7,
                    }}>
                    New Arrivals
                  </Text>
                </View>

                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    fontSize: 13,

                    color: C.muted,

                    marginTop: 5,
                  }}>
                  Fresh products, just added to MediShield
                </Text>
              </View>

              {/* COUNT */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  backgroundColor: '#ecfdf5',

                  borderRadius: 10,

                  paddingHorizontal: 12,

                  paddingVertical: 8,

                  borderWidth: 1,

                  borderColor: C.primary + '20',
                }}>
                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    fontSize: 12,

                    fontWeight: '800',

                    color: C.primary,
                  }}>
                  {products.length} Products
                </Text>
              </View>
            </View>

            {/* DIVIDER */}

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                height: 1,

                backgroundColor: C.border,

                marginTop: 20,
              }}
            />
          </View>

          {/* ═══════════════════════════════ */}
          {/* EMPTY STATE */}
          {/* ═══════════════════════════════ */}

          {products.length === 0 ? (
            <NoProdcucts search="" setSearch={() => {}} />
          ) : (
            <>
              {/* ═════════════════════════ */}
              {/* PRODUCT GRID */}
              {/* ═════════════════════════ */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  display: 'grid',

                  gridTemplateColumns: isMobile
                    ? 'repeat(2, minmax(0, 1fr))'
                    : isTablet
                      ? 'repeat(3, minmax(0, 1fr))'
                      : isDesktop
                        ? 'repeat(4, minmax(0, 1fr))'
                        : 'repeat(4, minmax(0, 1fr))',

                  gap: 16,
                }}>
                {products.map((item) => (
                  <WebProductCard
                    key={item._id}
                    item={item}
                    cols={1}
                    onBuy={(id) => router.navigate(`/product/${id}`)}
                    onCart={(product) => console.log('ADD TO CART:', product?._id)}
                  />
                ))}
              </View>

              {/* ═════════════════════════ */}
              {/* LOAD MORE */}
              {/* ═════════════════════════ */}

              {hasMore && (
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    alignItems: 'center',

                    marginTop: 30,

                    marginBottom: 20,
                  }}>
                  <Pressable
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                    style={{ fontFamily : 'Poppins_400Regular',
                      minWidth: 155,

                      height: 42,

                      paddingHorizontal: 20,

                      borderRadius: 10,

                      borderWidth: 1.5,

                      borderColor: C.primary,

                      alignItems: 'center',

                      justifyContent: 'center',

                      flexDirection: 'row',

                      gap: 7,

                      opacity: loadingMore ? 0.7 : 1,
                    }}>
                    {loadingMore ? (
                      <ActivityIndicator size="small" color={C.primary} />
                    ) : (
                      <>
                        <Text
                          style={{ fontFamily : 'Poppins_400Regular',
                            fontSize: 12,

                            fontWeight: '800',

                            color: C.primary,
                          }}>
                          Load More
                        </Text>

                        <Ionicons name="arrow-down" size={14} color={C.primary} />
                      </>
                    )}
                  </Pressable>
                </View>
              )}

              {/* ═════════════════════════ */}
              {/* END OF PRODUCTS */}
              {/* ═════════════════════════ */}

              {!hasMore && (
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    alignItems: 'center',

                    paddingVertical: 30,
                  }}>
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      flexDirection: 'row',

                      alignItems: 'center',

                      gap: 8,
                    }}>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        width: 28,

                        height: 1,

                        backgroundColor: C.border,
                      }}
                    />

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: C.muted,

                        fontSize: 11,
                      }}>
                      You've seen everything new
                    </Text>

                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        width: 28,

                        height: 1,

                        backgroundColor: C.border,
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}

export default NewArrivals;
