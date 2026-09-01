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
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        justifyContent: 'space-between',
        gap: 14,
        marginBottom: isMobile ? 18 : 24,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        {/* EYEBROW */}

        {eyebrow && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginBottom: 7,
            }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 7,
                backgroundColor: C.accent,
              }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: '900',
                letterSpacing: 1.4,
                color: C.primary,
              }}>
              {eyebrow}
            </Text>
          </View>
        )}

        {/* TITLE */}

        <Text
          style={{
            fontSize: isMobile ? 26 : 30,
            lineHeight: isMobile ? 29 : 36,
            fontWeight: '900',
            color: C.dark,
            letterSpacing: -0.7,
          }}>
          {title}
        </Text>

        {/* DESCRIPTION */}

        {description && (
          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: C.muted,
              marginTop: 5,
              maxWidth: 500,
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
            style={{
              fontSize: 11,
              fontWeight: '800',
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
        borderColor: pressed ? C.primary : C.border,
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

      <View
        style={{
          position: 'absolute',

          top: 0,

          left: 0,

          right: 0,

          height: 3,

          backgroundColor: C.primary,
        }}
      />

      {/* LOGO */}

      {brand.logo ? (
        <Image
          source={{
            uri: brand.logo,
          }}
          style={{
            width: isMobile ? 88 : 105,

            height: isMobile ? 45 : 52,

            resizeMode: 'contain',

            marginBottom: 8,
          }}
        />
      ) : (
        <View
          style={{
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
        style={{
          maxWidth: 105,

          fontSize: 10,

          fontWeight: '800',

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
      style={{
        flexDirection: 'row',

        alignItems: 'center',

        gap: 10,

        flex: isMobile ? undefined : 1,

        minWidth: isMobile ? 145 : undefined,
      }}>
      <View
        style={{
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
          style={{
            fontSize: 14,

            fontWeight: '900',

            color: C.dark,
          }}>
          {title}
        </Text>

        <Text
          style={{
            fontSize: 12,

            color: C.muted,

            marginTop: 2,
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
      style={{
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
        contentContainerStyle={{
          paddingBottom: 0,
        }}>
        {/* ═════════════════════════════════ */}
        {/* HERO */}
        {/* ═════════════════════════════════ */}

        <View
          style={{
            width: '100%',

            backgroundColor: C.bg,
          }}>
          <View
            style={{
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
          style={{
            maxWidth: 1320,

            width: '100%',

            alignSelf: 'center',

            paddingHorizontal: px,

            marginTop: isMobile ? 14 : 22,
          }}>
          <View
            style={{
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
          style={{
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
                  style={{
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
                style={{
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
                contentContainerStyle={{
                  gap: isMobile ? 12 : 16,

                  paddingVertical: 5,

                  paddingRight: 10,
                }}>
                {filtered.slice(0, isDesktop ? 8 : 6).map((item) => (
                  <View
                    key={item._id}
                    style={{
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
            style={{
              marginTop: -5,
            }}>
            <OfferBanner />
          </View>

          <View
            style={{
              width: '100%',
              minHeight: 520,
            }}>
            <FeaturedCategories />
          </View>

          <View style={{ marginTop: 50 }}>
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
                contentContainerStyle={{
                  gap: isMobile ? 12 : 16,
                  paddingVertical: 5,
                }}>
                {offerProducts.slice(0, isDesktop ? 8 : 6).map((item) => (
                  <View
                    key={item._id}
                    style={{
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
            style={{
              marginTop: 12,
            }}>
            <BannerSlider />
          </View> */}
          {/* ═══════════════════════════════ */}
          {/* FINAL CTA */}
          {/* ═══════════════════════════════ */}

          <View
            style={{
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
              style={{
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
              style={{
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
              style={{
                flexDirection: isMobile ? 'column' : 'row',

                alignItems: isMobile ? 'flex-start' : 'center',

                justifyContent: 'space-between',

                gap: 20,

                zIndex: 2,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',

                    gap: 7,

                    marginBottom: 9,
                  }}>
                  <Ionicons name="medical-outline" size={14} color="#ffffff" />

                  <Text
                    style={{
                      fontSize: 9,

                      fontWeight: '900',

                      letterSpacing: 1.3,

                      color: '#7ddbd2',
                    }}>
                    YOUR DENTAL PARTNER
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: isMobile ? 23 : 30,
                    lineHeight: isMobile ? 29 : 36,
                    fontWeight: '900',
                    color: '#fff',
                    letterSpacing: -0.5,
                  }}>
                  Everything You Need. One Trusted Store.
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 19,
                    color: '#a9d8d5',
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
                  style={{
                    fontSize: 12,
                    fontWeight: '900',
                    color: C.primaryDark,
                  }}>
                  Explore Products
                </Text>

                <Ionicons name="arrow-forward" size={14} color={C.primaryDark} />
              </Pressable>
            </View>
          </View>

          <View >
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
                contentContainerStyle={{
                  gap: isMobile ? 12 : 16,
                  paddingVertical: 5,
                }}>
                {newArrivals.slice(0, isDesktop ? 8 : 6).map((item) => (
                  <View
                    key={item._id}
                    style={{
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

        <View
          style={{
            marginTop: isMobile ? 40 : 65,
          }}>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
