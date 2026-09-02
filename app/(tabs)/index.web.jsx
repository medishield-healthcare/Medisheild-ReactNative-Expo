// app/(tabs)/index.web.jsx

import { useEffect, useState } from 'react';

import {
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import FeaturedCategories from 'components/Section/FeaturedCategories';
import API from '@/api/axios';

import WebHeader from 'components/Header/header.web';
import Footer from 'components/Footer/Footer';
import BannerSlider from 'components/Slider/BannerSlider';
import WebProductCard from 'components/Cards/WebProductCard';
import GridSkeleton from 'components/Cards/GridSkeleton';

import C from '@/utils/theme';

import TrustBar from 'components/ui/TrustBar';
import HeroSection from 'components/Section/HeroSection';
import OfferBanner from 'components/Section/OfferBanner';
import SectionHeader from 'components/Section/SectionHeader';
import NoProdcucts from 'components/Section/NoProdcucts';
import HeroSlider from 'components/Section/HeroSlider';
import { Fonts } from '@/utils/font';

// ============================================================================
// FONT WEIGHT -> FONT FAMILY
// ============================================================================
const getFontFamily = (weight) => {
  const weightMap = {
    '400': Fonts.regular || Fonts.normal || Fonts.semiBold,
    '500': Fonts.medium || Fonts.regular || Fonts.normal || Fonts.semiBold,
    '600': Fonts.semiBold,
    '700': Fonts.bold || Fonts.semiBold,
    '800': Fonts.extraBold || Fonts.bold || Fonts.semiBold,
    '900': Fonts.black || Fonts.extraBold || Fonts.bold || Fonts.semiBold,
  };
  return weightMap[String(weight)] || Fonts.semiBold;
};

// ═══════════════════════════════════════════════════════════════
// RESPONSIVE
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// SECTION TITLE
// ═══════════════════════════════════════════════════════════════

function PremiumSectionHeader({
  eyebrow,
  title,
  description,
  onPress,
  buttonText = 'View all',
  isMobile,
}) {
  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        justifyContent: 'space-between',
        gap: 14,
        marginBottom: isMobile ? 18 : 24,
      }}>
      <View
        style={{ fontFamily : 'Poppins_400Regular',
          flex: 1,
        }}>
        {/* EYEBROW */}

        {eyebrow && (
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginBottom: 7,
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                width: 7,
                height: 7,
                borderRadius: 7,
                backgroundColor: C.accent,
              }}
            />

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 12,
                fontWeight: '900',
                fontFamily: getFontFamily(700),
                letterSpacing: 1.4,
                color: C.primary,
              }}>
              {eyebrow}
            </Text>
          </View>
        )}

        {/* TITLE */}

        <Text
          style={{ fontFamily : 'Poppins_400Regular',
            fontSize: isMobile ? 26 : 30,
            lineHeight: isMobile ? 29 : 36,
            fontWeight: '900',
            color: C.dark,
            letterSpacing: -0.7,
            // fontFamily: getFontFamily(900),
          }}>
          {title}
        </Text>

        {/* DESCRIPTION */}

        {description && (
          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 13,
              lineHeight: 18,
              color: C.muted,
              marginTop: 5,
              maxWidth: 500,
              // fontFamily: Fonts.regular,
            }}>
            {description}
          </Text>
        )}
      </View>

      {/* VIEW ALL */}

      {onPress && (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 11,
            backgroundColor: pressed ? C.primaryLight : C.white,
            borderWidth: 1,
            borderColor: C.border,
            opacity: pressed ? 0.85 : 1,
            ...(Platform.OS === 'web'
              ? {
                  cursor: 'pointer',

                  transition: 'all 0.18s ease',
                }
              : {}),
          })}>
          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              fontSize: 11,
              fontWeight: '800',
              // fontFamily: getFontFamily(800),
              color: C.primary,
            }}>
            {buttonText}
          </Text>

          <Ionicons name="arrow-forward" size={13} color={C.primary} />
        </Pressable>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// BRAND CARD
// ═══════════════════════════════════════════════════════════════

function BrandMiniCard({ brand, isMobile, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: isMobile ? 125 : 145,
        height: isMobile ? 112 : 124,
        backgroundColor: C.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        // borderColor: pressed ? C.primary : C.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: pressed ? 0.88 : 1,
        transform: [
          {
            scale: pressed ? 0.97 : 1,
          },
        ],

        ...(Platform.OS === 'web'
          ? {
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(15,77,77,0.055)',
              transition: 'all 0.2s ease',
            }
          : {
              shadowColor: C.primaryDark,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }),
      })}>
      {/* TOP LINE */}

      {/* <View
        style={{ fontFamily : 'Poppins_400Regular',
          position: 'absolute',

          top: 0,

          left: 0,

          right: 0,

          height: 3,

          backgroundColor: C.primary,
        }}
      /> */}

      {/* LOGO */}

      {brand.logo ? (
        <Image
          source={{
            uri: brand.logo,
          }}
          style={{ fontFamily : 'Poppins_400Regular',
            width: isMobile ? 88 : 105,
            height: isMobile ? 45 : 52,
            resizeMode: 'contain',
            marginBottom: 8,
          }}
        />
      ) : (
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: 45,
            height: 45,
            borderRadius: 14,
            backgroundColor: C.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
          }}>
          <Ionicons name="business-outline" size={22} color={C.primary} />
        </View>
      )}

      <Text
        numberOfLines={1}
        style={{ fontFamily : 'Poppins_400Regular',
          maxWidth: 105,

          fontSize: 10,

          fontWeight: '800',

          // fontFamily: getFontFamily(800),

          color: C.dark,

          textAlign: 'center',
        }}>
        {brand.name}
      </Text>
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════
// TRUST FEATURE
// ═══════════════════════════════════════════════════════════════

function TrustFeature({ icon, title, text, isMobile }) {
  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        flexDirection: 'row',

        alignItems: 'center',

        gap: 10,

        flex: isMobile ? undefined : 1,

        minWidth: isMobile ? 145 : undefined,
      }}>
      <View
        style={{ fontFamily : 'Poppins_400Regular',
          width: 39,

          height: 39,

          borderRadius: 12,

          backgroundColor: C.white,

          alignItems: 'center',

          justifyContent: 'center',

          borderWidth: 1,

          borderColor: C.border,
        }}>
        <Ionicons name={icon} size={22} color={C.primary} />
      </View>

      <View>
        <Text
          style={{ fontFamily : 'Poppins_400Regular',
            fontSize: 14,

            fontWeight: '900',
            // fontFamily : getFontFamily(600),
            color: C.dark,
          }}>
          {title}
        </Text>

        <Text
          style={{ fontFamily : 'Poppins_400Regular',
            fontSize: 12,

            color: C.muted,

            marginTop: 2,
            // fontFamily : getFontFamily(400),
          }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function HomeWeb() {
  const router = useRouter();

  const { cols, px, isMobile, isTablet, isDesktop } = useBreakpoint();

  // ═══════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════

  const [categories, setCategories] = useState([]);

  const [loadingC, setLoadingC] = useState(true);

  const [search, setSearch] = useState('');

  const [activeCategory, setCategory] = useState('all');

  const [cartCount] = useState(0);

  const [brands, setBrands] = useState([]);

  // ═══════════════════════════════════════════
  // PRODUCTS
  // ═══════════════════════════════════════════

  async function fetchProducts() {
    try {
      const res = await API.get('/product', {
        params: {
          featured: true,
        },
      });

      return res.data.data || [];
    } catch (e) {
      console.error('Products error:', e);
    }
  }

  const { data: products, isLoading: loadingP } = useQuery({
    queryKey: ['products'],

    queryFn: fetchProducts,

    refetchOnWindowFocus: false,

    staleTime: 1000 * 60 * 5,

    cacheTime: 1000 * 60 * 5,
  });

  const fetchOfferProducts = async () => {
    try {
      const res = await API.get('/product', {
        params: {
          page: 1,
          limit: 12,
          sort: '-createdAt',
          category: 'Offers',
        },
      });

      console.log('OFFER PRODUCTS:', res.data);

      return res.data.data || [];
    } catch (error) {
      console.error('Offers API Error:', error?.response?.data || error?.message);

      return [];
    }
  };

  const { data: offerProducts = [], isLoading: loadingOffers } = useQuery({
    queryKey: ['offer-products'],
    queryFn: fetchOfferProducts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const fetchNewArrivals = async () => {
    try {
      const res = await API.get('/product', {
        params: {
          page: 1,
          limit: 12,
          sort: '-createdAt',
        },
      });

      console.log('OFFER PRODUCTS:', res.data);

      return res.data.data || [];
    } catch (error) {
      console.error('Offers API Error:', error?.response?.data || error?.message);

      return [];
    }
  };

  const { data: newArrivals = [], isLoading: loadingNewArrivals } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // ═══════════════════════════════════════════
  // BRANDS
  // ═══════════════════════════════════════════

  async function fetchBrands() {
    try {
      const { data } = await API.get('/brand');

      setBrands(data.data || []);
    } catch (e) {
      console.error('Brands fetch error:', e);
    }
  }

  // ═══════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════

  async function fetchCategories() {
    try {
      const { data } = await API.get('/category');

      setCategories(data.data || data.categories || data || []);
    } catch (e) {
      console.error('Categories error:', e);
    } finally {
      setLoadingC(false);
    }
  }

  // ═══════════════════════════════════════════
  // INITIAL FETCH
  // ═══════════════════════════════════════════

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // ═══════════════════════════════════════════
  // FILTER PRODUCTS
  // ═══════════════════════════════════════════

  const filtered =
    products &&
    products.filter((p) => {
      const matchSearch = search.trim()
        ? p.name?.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchCat =
        activeCategory === 'all'
          ? true
          : p.category?._id === activeCategory ||
            p.category?.toLowerCase() === activeCategory.toLowerCase() ||
            p.category === activeCategory;

      return matchSearch && matchCat;
    });

  // ═══════════════════════════════════════════
  // PAGE
  // ═══════════════════════════════════════════

  return (
    <SafeAreaView
      style={{ fontFamily : 'Poppins_400Regular',
        flex: 1,

        backgroundColor: C.bg,
      }}>
      {/* ════════════════════════════════════ */}
      {/* HEADER */}
      {/* ════════════════════════════════════ */}

      <WebHeader
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        categories={loadingC ? [] : categories}
        activeCategory={activeCategory}
        setCategory={setCategory}
      />

      {/* ════════════════════════════════════ */}
      {/* PAGE */}
      {/* ════════════════════════════════════ */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerstyle={{ fontFamily : 'Poppins_400Regular',
          paddingBottom: 0,
        }}>
        {/* ═════════════════════════════════ */}
        {/* HERO */}
        {/* ═════════════════════════════════ */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',

            backgroundColor: C.bg,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              maxWidth: 1320,

              width: '100%',

              alignSelf: 'center',

              paddingHorizontal: px,

              paddingTop: isMobile ? 16 : 24,
            }}>
            {/* <HeroSection /> */}
            <HeroSlider />
          </View>
        </View>

        {/* ═════════════════════════════════ */}
        {/* TRUST STRIP */}
        {/* ═════════════════════════════════ */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            maxWidth: 1320,

            width: '100%',

            alignSelf: 'center',

            paddingHorizontal: px,

            marginTop: isMobile ? 14 : 22,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: C.white,

              borderRadius: 18,

              borderWidth: 1,

              borderColor: C.border,

              padding: isMobile ? 14 : 18,

              flexDirection: isMobile ? 'row' : 'row',

              flexWrap: isMobile ? 'wrap' : 'nowrap',

              gap: isMobile ? 16 : 10,

              ...(Platform.OS === 'web'
                ? {
                    boxShadow: '0 5px 22px rgba(15,77,77,0.045)',
                  }
                : {}),
            }}>
            <TrustFeature
              icon="shield-checkmark-outline"
              title="Genuine Products"
              text="100% authentic"
              isMobile={isMobile}
            />

            <TrustFeature
              icon="rocket-outline"
              title="Fast Delivery"
              text="Quick & reliable"
              isMobile={isMobile}
            />

            <TrustFeature
              icon="refresh-outline"
              title="Easy Returns"
              text="Hassle-free support"
              isMobile={isMobile}
            />

            <TrustFeature
              icon="headset-outline"
              title="Expert Support"
              text="We're here for you"
              isMobile={isMobile}
            />
          </View>
        </View>

        {/* ═════════════════════════════════ */}
        {/* MAIN CONTENT */}
        {/* ═════════════════════════════════ */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            maxWidth: 1320,

            width: '100%',

            alignSelf: 'center',

            paddingHorizontal: px,

            paddingTop: isMobile ? 36 : 55,

            gap: isMobile ? 38 : 58,
          }}>
          {/* ═══════════════════════════════ */}
          {/* TOP BRANDS */}
          {/* ═══════════════════════════════ */}

          <View>
            <PremiumSectionHeader
              eyebrow="TRUSTED BRANDS"
              title="Shop Your Favourite Brands"
              description="Discover quality dental products from trusted manufacturers."
              buttonText="View all brands"
              onPress={() => router.push('/brands')}
              isMobile={isMobile}
            />

            {/* BRAND LIST */}

            {brands.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ 
                  gap: isMobile ? 12 : 16,
                  paddingVertical: 4,
                  paddingRight: 10,
                }}>
                {brands.slice(0, 10).map((brand) => (
                  <BrandMiniCard
                    key={brand._id}
                    brand={brand}
                    isMobile={isMobile}
                    onPress={() => router.push(`/shop?brand=${encodeURIComponent(brand.name)}`)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View
                style={{ 
                  height: 110,

                  borderRadius: 16,

                  backgroundColor: C.white,

                  borderWidth: 1,

                  borderColor: C.border,

                  alignItems: 'center',

                  justifyContent: 'center',
                }}>
                <Ionicons name="business-outline" size={24} color={C.border} />

                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    fontSize: 11,

                    color: C.muted,

                    marginTop: 5,
                  }}>
                  Brands will appear here
                </Text>
              </View>
            )}
          </View>

          {/* ═══════════════════════════════ */}
          {/* FEATURED PRODUCTS */}
          {/* ═══════════════════════════════ */}

          <View>
            <PremiumSectionHeader
              eyebrow="FEATURED COLLECTION"
              title="Made for Professionals"
              description="Handpicked dental products selected for quality and everyday clinical needs."
              buttonText="Shop all products"
              onPress={() => router.push('/shop')}
              isMobile={isMobile}
            />

            {/* PRODUCT AREA */}

            {loadingP ? (
              <GridSkeleton cols={cols} />
            ) : !filtered || filtered.length === 0 ? (
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  backgroundColor: C.white,

                  borderRadius: 18,

                  borderWidth: 1,

                  borderColor: C.border,

                  paddingVertical: 50,

                  alignItems: 'center',
                }}>
                <NoProdcucts search={search} setSearch={setSearch} />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ fontFamily : 'Poppins_400Regular',
                  gap: isMobile ? 12 : 16,

                  paddingVertical: 5,

                  paddingRight: 10,
                }}>
                {filtered.slice(0, isDesktop ? 8 : 6).map((item) => (
                  <View
                    key={item._id}
                    style={{ fontFamily : 'Poppins_400Regular',
                      width: isMobile ? 210 : isTablet ? 225 : 255,
                    }}>
                    <WebProductCard
                      item={item}
                      cols={1}
                      onBuy={(id) => router.navigate(`/product/${id}`)}
                      onCart={(item) => console.log('Add to cart', item._id)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* ═══════════════════════════════ */}
          {/* OFFER BANNER */}
          {/* ═══════════════════════════════ */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              marginTop: -5,
            }}>
            <OfferBanner />
          </View>

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: '100%',
              minHeight: 520,
            }}>
            <FeaturedCategories />
          </View>

          <View style={{ fontFamily : 'Poppins_400Regular', marginTop: 50 }}>
            <PremiumSectionHeader
              eyebrow="SPECIAL OFFERS"
              title="Offers You Don't Want to Miss"
              description="Explore exclusive deals and special prices on selected dental products."
              buttonText="View all offers"
              onPress={() => router.push('/shop?category=Offers')}
              isMobile={isMobile}
            />

            {loadingOffers ? (
              <GridSkeleton cols={cols} />
            ) : offerProducts.length === 0 ? (
              <NoProdcucts search="" setSearch={() => {}} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ fontFamily : 'Poppins_400Regular',
                  gap: isMobile ? 12 : 16,
                  paddingVertical: 5,
                }}>
                {offerProducts.slice(0, isDesktop ? 8 : 6).map((item) => (
                  <View
                    key={item._id}
                    style={{ fontFamily : 'Poppins_400Regular',
                      width: isMobile ? 210 : isTablet ? 225 : 255,
                    }}>
                    <WebProductCard
                      item={item}
                      cols={1}
                      onBuy={(id) => router.navigate(`/product/${id}`)}
                      onCart={(item) => console.log('Add to cart', item._id)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
          {/* ═══════════════════════════════ */}
          {/* BANNER SLIDER */}
          {/* ═══════════════════════════════ */}

          {/* <View
            style={{ fontFamily : 'Poppins_400Regular',
              marginTop: 12,
            }}>
            <BannerSlider />
          </View> */}
          {/* ═══════════════════════════════ */}
          {/* FINAL CTA */}
          {/* ═══════════════════════════════ */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: C.primaryDark,

              borderRadius: isMobile ? 20 : 26,

              overflow: 'hidden',

              paddingHorizontal: isMobile ? 20 : 42,

              paddingVertical: isMobile ? 26 : 34,

              position: 'relative',

              marginBottom: isMobile ? 20 : 10,
            }}>
            {/* DECORATION */}

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                position: 'absolute',

                width: isMobile ? 180 : 300,

                height: isMobile ? 180 : 300,

                borderRadius: 999,

                borderWidth: 1,

                borderColor: 'rgba(255,255,255,0.06)',

                right: -80,

                top: -100,
              }}
            />

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                position: 'absolute',

                width: 100,

                height: 100,

                borderRadius: 100,

                backgroundColor: 'rgba(45,212,191,0.08)',

                right: 90,

                bottom: -60,
              }}
            />

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flexDirection: isMobile ? 'column' : 'row',

                alignItems: isMobile ? 'flex-start' : 'center',

                justifyContent: 'space-between',

                gap: 20,

                zIndex: 2,
              }}>
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flex: 1,
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',

                    alignItems: 'center',

                    gap: 7,

                    marginBottom: 9,
                  }}>
                  <Ionicons name="medical-outline" size={14} color="#ffffff" />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: 9,

                      fontWeight: '900',
                      // fontFamily: getFontFamily(900),

                      letterSpacing: 1.3,

                      color: C.white,
                    }}>
                    YOUR DENTAL PARTNER
                  </Text>
                </View>

                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    fontSize: isMobile ? 23 : 30,
                    lineHeight: isMobile ? 29 : 36,
                    fontWeight: '900',
                    // fontFamily: getFontFamily(900),
                    color: C.white,
                    letterSpacing: -0.5,
                  }}>
                  Everything You Need. One Trusted Store.
                </Text>

                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    fontSize: 12,
                    lineHeight: 19,
                    color: C.white,
                    marginTop: 7,
                    maxWidth: 560,
                  }}>
                  Explore dental products, trusted brands and professional essentials — all in one
                  place.
                </Text>
              </View>

              {/* CTA */}

              <Pressable
                onPress={() => router.push('/shop')}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  backgroundColor: '#fff',
                  paddingHorizontal: 18,
                  paddingVertical: 11,
                  borderRadius: 11,
                  opacity: pressed ? 0.85 : 1,
                  ...(Platform.OS === 'web'
                    ? {
                        cursor: 'pointer',

                        transition: 'all 0.18s ease',
                      }
                    : {}),
                })}>
                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    fontSize: 12,
                    fontWeight: '900',
                    // fontFamily: getFontFamily(900),
                    color: C.primaryDark,
                  }}>
                  Explore Products
                </Text>

                <Ionicons name="arrow-forward" size={14} color={C.primaryDark} />
              </Pressable>
            </View>
          </View>

          <View>
            <PremiumSectionHeader
              eyebrow="NEW ARRIVALS"
              title="Fresh Arrivals for Your Practice"
              description="Discover the latest dental products, equipment and essentials newly added to MediShield."
              buttonText="Explore new arrivals"
              onPress={() => router.push('/shop')}
              isMobile={isMobile}
            />

            {loadingNewArrivals ? (
              <GridSkeleton cols={cols} />
            ) : newArrivals.length === 0 ? (
              <NoProdcucts search="" setSearch={() => {}} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ fontFamily : 'Poppins_400Regular',
                  gap: isMobile ? 12 : 16,
                  paddingVertical: 5,
                }}>
                {newArrivals.slice(0, isDesktop ? 8 : 6).map((item) => (
                  <View
                    key={item._id}
                    style={{ fontFamily : 'Poppins_400Regular',
                      width: isMobile ? 210 : isTablet ? 225 : 255,
                    }}>
                    <WebProductCard
                      item={item}
                      cols={1}
                      onBuy={(id) => router.navigate(`/product/${id}`)}
                      onCart={(item) => console.log('Add to cart', item._id)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* ═════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═════════════════════════════════ */}

        {/* ============================================================
    FINAL CTA STRIP
============================================================ */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            backgroundColor: C.primaryDark,

            paddingHorizontal: px,

            paddingVertical: isMobile ? 30 : 34,

            position: 'relative',
            overflow: 'hidden',
          }}>
          {/* Decorative background circles */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              position: 'absolute',

              width: isMobile ? 180 : 320,
              height: isMobile ? 180 : 320,

              borderRadius: 999,

              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',

              right: isMobile ? -100 : -80,
              top: isMobile ? -90 : -150,
            }}
          />

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              position: 'absolute',

              width: isMobile ? 100 : 170,
              height: isMobile ? 100 : 170,

              borderRadius: 999,

              backgroundColor: C.primary,

              opacity: 0.12,

              left: isMobile ? -50 : -70,
              bottom: isMobile ? -60 : -100,
            }}
          />

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: '100%',
              maxWidth: 1200,
              alignSelf: 'center',

              flexDirection: isMobile ? 'column' : 'row',

              alignItems: isMobile ? 'flex-start' : 'center',

              justifyContent: 'space-between',

              gap: isMobile ? 22 : 35,

              zIndex: 2,
            }}>
            {/* ========================================================
        LEFT CONTENT
    ========================================================= */}

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,
                maxWidth: 600,
              }}>
              {/* Small label */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',

                  gap: 7,

                  marginBottom: 8,
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    width: 6,
                    height: 6,

                    borderRadius: 3,

                    backgroundColor: '#5eead4',
                  }}
                />

                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    color: C.white,

                    fontSize: 10,

                    fontWeight: '900',

                    // fontFamily: getFontFamily(900),

                    letterSpacing: 1.5,
                  }}>
                  BUILT FOR BETTER DENTISTRY
                </Text>
              </View>

              {/* Heading */}

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#fff',

                  fontSize: isMobile ? 22 : isTablet ? 25 : 28,

                  lineHeight: isMobile ? 29 : 35,

                  fontWeight: '900',

                  // fontFamily: getFontFamily(900),

                  letterSpacing: -0.7,

                  marginBottom: 7,
                }}>
                Everything your practice needs,{' '}
                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    color: C.white,
                  }}>
                  in one place.
                </Text>
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: C.white,

                  fontSize: 12,

                  lineHeight: 19,

                  maxWidth: 500,
                }}>
                Discover trusted dental products, essential supplies and solutions designed for
                modern dental practices.
              </Text>
            </View>

            {/* ========================================================
        VALUE POINTS
    ========================================================= */}

            {!isMobile && (
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',

                  alignItems: 'center',

                  gap: 22,

                  paddingHorizontal: 20,
                }}>
                {[
                  {
                    icon: 'shield-checkmark-outline',
                    title: 'Trusted',
                    text: 'Quality products',
                  },
                  {
                    icon: 'cube-outline',
                    title: 'Wide Range',
                    text: 'Dental essentials',
                  },
                  {
                    icon: 'headset-outline',
                    title: 'Support',
                    text: 'We are here to help',
                  },
                ].map((item) => (
                  <View
                    key={item.title}
                    style={{ fontFamily : 'Poppins_400Regular',
                      flexDirection: 'row',

                      alignItems: 'center',

                      gap: 9,
                    }}>
                    <Ionicons name={item.icon} size={20} color={C.white} />

                    <View>
                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          color: '#fff',

                          fontSize: 11,

                          fontWeight: '800',
                          // fontFamily: getFontFamily(800),

                          marginBottom: 2,
                        }}>
                        {item.title}
                      </Text>

                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          color: C.white,

                          fontSize: 9,
                        }}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* ========================================================
        CTA
    ========================================================= */}

            <Pressable
              onPress={() => router.push('/shop')}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#e2fffb' : '#ffffff',

                minHeight: 44,

                paddingHorizontal: isMobile ? 18 : 21,

                borderRadius: 9,

                flexDirection: 'row',

                alignItems: 'center',

                justifyContent: 'center',

                gap: 9,

                opacity: pressed ? 0.9 : 1,
              })}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: C.primaryDark,

                  fontSize: 12,

                  fontWeight: '900',
                  // fontFamily: getFontFamily(400),
                }}>
                Explore Products
              </Text>

              <Ionicons name="arrow-forward" size={15} color={C.primaryDark} />
            </Pressable>
          </View>
        </View>

        {/* ============================================================
    FOOTER
============================================================ */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            marginTop: 0,
          }}>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
