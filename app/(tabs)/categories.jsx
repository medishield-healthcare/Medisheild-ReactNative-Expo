import API from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import WebHeader from 'components/Header/header.web';
import React, { useState } from 'react';

import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import C from '@/utils/theme';
import Footer from 'components/Footer/Footer';

// ═══════════════════════════════════════════════
// CATEGORY CARD
// ═══════════════════════════════════════════════

function CategoryCard({ category, isMobile, onPress }) {
  const [hovered, setHovered] = useState(false);

  const isWeb = Platform.OS === 'web';

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={isWeb ? () => setHovered(true) : undefined}
      onHoverOut={isWeb ? () => setHovered(false) : undefined}
      style={{
        fontFamily: 'Poppins_400Regular',
        width: '100%',
        backgroundColor: C.white,
        borderRadius: isMobile ? 16 : 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: hovered ? C.primary : C.border,

        ...(isWeb
          ? {
              cursor: 'pointer',
              boxShadow: hovered
                ? '0 16px 40px rgba(15,118,110,0.14)'
                : '0 5px 22px rgba(15,23,42,0.055)',
              transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
              transition: 'all 0.22s ease',
            }
          : {
              shadowColor: C.primaryDark,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 2,
            }),
      }}>
      {/* ═══════════════════════════════════ */}
      {/* ICON AREA */}
      {/* ═══════════════════════════════════ */}

      {/* ═══════════════════════════════════ */}
      {/* INFO */}
      {/* ═══════════════════════════════════ */}

      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          padding: isMobile ? 13 : 17,
        }}>
        {/* CATEGORY LABEL */}

        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 9,
            fontWeight: '800',
            color: C.primary,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 5,
          }}>
          Product Category
        </Text>

        {/* NAME */}

        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: isMobile ? 14 : 16,
            lineHeight: isMobile ? 19 : 21,
            fontWeight: '900',
            color: C.dark,
            marginBottom: 11,
            minHeight: isMobile ? 38 : 42,
          }}>
          {category.name?.trim()}
        </Text>

        {/* BOTTOM */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 10,
                color: C.muted,
                fontWeight: '600',
              }}>
              Explore products
            </Text>

            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginTop: 4,
              }}>
              <Ionicons name="checkmark-circle" size={11} color={C.primary} />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 9,
                  color: C.primary,
                  fontWeight: '700',
                }}>
                Quality products
              </Text>
            </View>
          </View>

          {/* ARROW */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              width: isMobile ? 31 : 36,
              height: isMobile ? 31 : 36,
              borderRadius: isMobile ? 10 : 11,
              backgroundColor: hovered ? C.primary : C.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',

              ...(isWeb
                ? {
                    transform: hovered ? 'translateX(2px)' : 'translateX(0)',
                    transition: 'all 0.2s ease',
                  }
                : {}),
            }}>
            <Ionicons
              name="arrow-forward"
              size={isMobile ? 14 : 16}
              color={hovered ? '#fff' : C.primary}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ═══════════════════════════════════════════════
// CATEGORIES PAGE
// ═══════════════════════════════════════════════

function Categories() {
  const router = useRouter();

  const { width } = useWindowDimensions();

  // ═══════════════════════════════════════════
  // RESPONSIVE
  // ═══════════════════════════════════════════

  const isMobile = width < 640;

  const isTablet = width >= 640 && width < 1024;

  const isDesktop = width >= 1024;

  const pagePadding = isMobile ? 16 : isTablet ? 28 : 40;

  const maxWidth = isMobile ? '100%' : isTablet ? 900 : 1240;

  // ═══════════════════════════════════════════
  // FETCH CATEGORIES
  // ═══════════════════════════════════════════

  async function fetchCategories() {
    try {
      const res = await API.get('/category');

      return res.data?.categories || [];
    } catch (error) {
      console.error('Categories error:', error);

      return [];
    }
  }

  // ═══════════════════════════════════════════
  // REACT QUERY
  // ═══════════════════════════════════════════

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['Categories'],

    queryFn: fetchCategories,

    refetchOnWindowFocus: false,

    staleTime: 1000 * 60 * 5,

    cacheTime: 1000 * 60 * 5,
  });

  // ═══════════════════════════════════════════
  // LOADING
  // ═══════════════════════════════════════════

  if (isLoading) {
    return (
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: C.bg,
        }}>
        <WebHeader />

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 100,
          }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: C.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 17,
            }}>
            <ActivityIndicator size="small" color={C.primary} />
          </View>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 16,
              fontWeight: '900',
              color: C.dark,
            }}>
            Loading categories...
          </Text>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 12,
              color: C.muted,
              marginTop: 5,
            }}>
            Finding products for you
          </Text>
        </View>
      </View>
    );
  }

  // ═══════════════════════════════════════════
  // ERROR
  // ═══════════════════════════════════════════

  if (isError) {
    return (
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: C.bg,
        }}>
        <WebHeader />

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: pagePadding,
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: C.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
            }}>
            <Ionicons name="cloud-offline-outline" size={36} color={C.primary} />
          </View>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 22,
              fontWeight: '900',
              color: C.dark,
            }}>
            Unable to load categories
          </Text>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: C.muted,
              marginTop: 7,
              textAlign: 'center',
            }}>
            Something went wrong while loading the categories.
          </Text>
        </View>
      </View>
    );
  }

  // ═══════════════════════════════════════════
  // GRID CONFIG
  // ═══════════════════════════════════════════

  const columns = isMobile ? 1 : isTablet ? 3 : 4;

  const gap = isMobile ? 12 : isTablet ? 16 : 20;

  // ═══════════════════════════════════════════
  // PAGE
  // ═══════════════════════════════════════════

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        flex: 1,
        minHeight: '100vh',
        backgroundColor: C.bg,
      }}>
      {/* HEADER */}

      <WebHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            maxWidth,
            width: '100%',
            alignSelf: 'center',
            paddingHorizontal: pagePadding,
            paddingTop: isMobile ? 20 : 30,
          }}>
          {/* ═══════════════════════════════ */}
          {/* BREADCRUMB */}
          {/* ═══════════════════════════════ */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginBottom: isMobile ? 18 : 25,
            }}>
            <Pressable onPress={() => router.push('/')}>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 11,
                  fontWeight: '700',
                  color: C.primaryDark,
                }}>
                Home
              </Text>
            </Pressable>

            <Ionicons name="chevron-forward" size={11} color={C.muted} />

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 11,
                fontWeight: '800',
                color: C.primary,
              }}>
              Categories
            </Text>
          </View>

          {/* ═══════════════════════════════ */}
          {/* HERO */}
          {/* ═══════════════════════════════ */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              backgroundColor: C.primaryDark,
              borderRadius: isMobile ? 22 : 28,
              overflow: 'hidden',
              minHeight: isMobile ? 220 : 270,
              paddingHorizontal: isMobile ? 22 : 48,
              paddingVertical: isMobile ? 28 : 42,
              justifyContent: 'center',
              position: 'relative',
              marginBottom: isMobile ? 30 : 42,
            }}>
            {/* DECORATIVE CIRCLE */}

            <View
              style={{
                position: 'absolute',
                width: isMobile ? 230 : 390,
                height: isMobile ? 230 : 390,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.07)',
                right: isMobile ? -100 : -130,
                top: isMobile ? -100 : -160,
              }}
            />

            <View
              style={{
                position: 'absolute',
                width: isMobile ? 120 : 190,
                height: isMobile ? 120 : 190,
                borderRadius: 999,
                backgroundColor: 'rgba(45,212,191,0.08)',
                right: isMobile ? 25 : 150,
                bottom: -75,
              }}
            />

            {/* SMALL LABEL */}

            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingHorizontal: 11,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.09)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                marginBottom: 14,
              }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 6,
                  backgroundColor: '#2dd4bf',
                }}
              />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 9,
                  fontWeight: '900',
                  letterSpacing: 1.3,
                  color: C.white,
                }}>
                EXPLORE PRODUCTS
              </Text>
            </View>

            {/* TITLE */}

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: isMobile ? 29 : 42,
                lineHeight: isMobile ? 36 : 48,
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: -1,
                maxWidth: 650,
              }}>
              Explore Our Categories.
            </Text>

            {/* DESCRIPTION */}

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: isMobile ? 12 : 14,
                lineHeight: isMobile ? 19 : 22,
                color: C.white,
                marginTop: 9,
                maxWidth: 570,
              }}>
              Browse our complete range of dental products organised into professional categories
              for easy discovery.
            </Text>

            {/* HERO BOTTOM */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                marginTop: 18,
              }}>
              <Ionicons name="grid-outline" size={15} color="#ffffff" />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  color: C.white,
                  fontSize: 10,
                  fontWeight: '700',
                }}>
                Professional products · Easy discovery
              </Text>
            </View>
          </View>

          {/* ═══════════════════════════════ */}
          {/* SECTION HEADER */}
          {/* ═══════════════════════════════ */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              justifyContent: 'space-between',
              marginBottom: isMobile ? 18 : 24,
              gap: 12,
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 5,
                }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 7,
                    backgroundColor: '#f28a18',
                  }}
                />

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 9,
                    fontWeight: '900',
                    letterSpacing: 1.3,
                    color: '#f28a18',
                  }}>
                  OUR CATEGORIES
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: isMobile ? 23 : 30,
                  fontWeight: '900',
                  color: C.dark,
                  letterSpacing: -0.6,
                }}>
                Product Categories
              </Text>

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 4,
                }}>
                Explore products by category
              </Text>
            </View>

            {/* COUNT */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: C.white,
                paddingHorizontal: 13,
                paddingVertical: 9,
                borderRadius: 11,
                borderWidth: 1,
                borderColor: C.border,

                ...(Platform.OS === 'web'
                  ? {
                      boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                    }
                  : {}),
              }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="grid-outline" size={14} color={C.primary} />
              </View>

              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 14,
                    fontWeight: '900',
                    color: C.dark,
                  }}>
                  {data.length}
                </Text>

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 9,
                    color: C.muted,
                    fontWeight: '600',
                  }}>
                  Available Categories
                </Text>
              </View>
            </View>
          </View>

          {/* ═══════════════════════════════ */}
          {/* CATEGORY GRID */}
          {/* ═══════════════════════════════ */}

          {data.length === 0 ? (
            <View
              style={{
                backgroundColor: C.white,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: C.border,
                paddingVertical: 75,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                <Ionicons name="grid-outline" size={31} color={C.primary} />
              </View>

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 19,
                  fontWeight: '900',
                  color: C.dark,
                }}>
                No categories found
              </Text>

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 6,
                  textAlign: 'center',
                }}>
                No categories are available right now.
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap,
              }}>
              {data.map((category) => {
                const cardWidth = isMobile
                  ? '100%'
                  : isTablet
                    ? 'calc(33.333% - 11px)'
                    : 'calc(25% - 15px)';

                return (
                  <View
                    key={category._id}
                    style={{
                      width: cardWidth,
                    }}>
                    <CategoryCard
                      category={category}
                      isMobile={isMobile}
                      onPress={() => {
                        router.push(`/shop?category=${encodeURIComponent(category.name?.trim())}`);
                      }}
                    />
                  </View>
                );
              })}
            </View>
          )}

          {/* ═══════════════════════════════ */}
          {/* TRUST STRIP */}
          {/* ═══════════════════════════════ */}

          {data.length > 0 && (
            <View
              style={{
                marginTop: isMobile ? 30 : 46,
                marginBottom: isMobile ? 30 : 46,
                backgroundColor: '#edf8f7',
                borderRadius: isMobile ? 18 : 22,
                padding: isMobile ? 18 : 24,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                gap: isMobile ? 18 : 25,
                borderWidth: 1,
                borderColor: '#d5efeb',
              }}>
              {/* LEFT */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: C.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#d5efeb',
                  }}>
                  <Ionicons name="grid-outline" size={23} color={C.primary} />
                </View>

                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 14,
                      fontWeight: '900',
                      color: C.dark,
                    }}>
                    Easy Product Discovery
                  </Text>

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 11,
                      color: C.muted,
                      marginTop: 3,
                    }}>
                    Find exactly what you need
                  </Text>
                </View>
              </View>

              {/* FEATURES */}

              <View
                style={{
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 10 : 28,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                  }}>
                  <Ionicons name="checkmark-circle" size={17} color={C.primary} />

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 11,
                      fontWeight: '700',
                      color: C.dark,
                    }}>
                    Genuine Products
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                  }}>
                  <Ionicons name="medical-outline" size={17} color={C.primary} />

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 11,
                      fontWeight: '700',
                      color: C.dark,
                    }}>
                    Dental Focused
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                  }}>
                  <Ionicons name="star-outline" size={17} color={C.primary} />

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 11,
                      fontWeight: '700',
                      color: C.dark,
                    }}>
                    Professional Quality
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* FOOTER */}

        <Footer />
      </ScrollView>
    </View>
  );
}

export default Categories;
