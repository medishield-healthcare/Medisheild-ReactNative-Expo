// app/(tabs)/index.native.jsx

import { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import API from '@/api/axios';
import HeroSlider from 'components/Section/HeroSlider';
import OfferBanner from 'components/Section/OfferBanner';
import { useQuery } from '@tanstack/react-query';
import FeaturedCategories from 'components/Section/FeaturedCategories';
import CircularVideoSection from 'components/Section/CircularVideoSection';
import FeaturedCategoriesNative from 'components/Section/FeaturedCategoriesNative';
import CircularVideoSectionNative from 'components/Section/CircularVideoSectionNative';
import C from '@/utils/theme';
// const C = {
//   primary: '#CD0F0F',
//   primaryDark: '#CD0F0F',
//   primaryLight: '#ccfbf1',
//   accent: '#f59e0b',
//   accentLight: '#fef3c7',
//   bg: '#f0fafa',
//   white: '#ffffff',
//   dark: '#0f172a',
//   muted: '#64748b',
//   border: '#e2e8f0',
//   card: '#ffffff',
// };

// ── Category Pill ─────────────────────────────────────────────────────────────
function CategoryPill({ category, active, onPress }) {
  // Map category name to icon (fallback to grid)
  const iconMap = {
    instruments: 'build-outline',
    materials: 'flask-outline',
    equipment: 'hardware-chip-outline',
    consumables: 'medical-outline',
    hygiene: 'shield-checkmark-outline',
    all: 'grid-outline',
  };
  const icon = iconMap[(category.name || category.label || '').toLowerCase()] || 'grid-outline';

  return (
    <Pressable
      onPress={onPress}
      style={{
        marginRight: 10,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: active ? C.primary : C.white,
        borderWidth: 1.5,
        borderColor: active ? C.primary : C.border,
        shadowColor: active ? C.primary : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: active ? 0.2 : 0.04,
        shadowRadius: 6,
        elevation: active ? 4 : 1,
      }}>
      <Ionicons name={icon} size={15} color={active ? C.white : C.muted} />
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? C.white : C.dark }}>
        {category.name || category.label}
      </Text>
    </Pressable>
  );
}

// ── Horizontal Product Card ───────────────────────────────────────────────────
function ProductCardH({ item, onBuy, onCart }) {
  const regularPrice = Number(item.price?.regularPrice || 0);
  const salePrice = Number(item.price?.salePrice || 0);

  const hasDiscount = salePrice > 0 && regularPrice > 0 && salePrice < regularPrice;

  const finalPrice = hasDiscount ? salePrice : regularPrice;

  return (
    <View
      style={{
        width: 175,
        marginRight: 14,
        backgroundColor: C.card,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: C.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}>
      {/* Image */}
      <View>
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
            width: '100%',
            height: 160,
            backgroundColor: C.bg,
          }}
          resizeMode="cover"
        />

        {/* Featured Badge */}
        {item.featured && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: C.accent,
              borderRadius: 6,
              paddingHorizontal: 7,
              paddingVertical: 3,
            }}>
            <Text
              style={{
                color: C.white,
                fontSize: 9,
                fontWeight: '800',
                letterSpacing: 0.5,
              }}>
              FEATURED
            </Text>
          </View>
        )}

        {/* Wishlist */}
        <Pressable
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 20,
            padding: 5,
          }}>
          <Ionicons name="heart-outline" size={15} color={C.muted} />
        </Pressable>
      </View>

      {/* Info */}
      <View
        style={{
          padding: 12,
          flex: 1,
        }}>
        {/* Product Name */}
        <View
          style={{
            height: 36,
            justifyContent: 'flex-start',
            marginBottom: 4,
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: C.dark,
              lineHeight: 18,
            }}>
            {item.name}
          </Text>
        </View>

        {/* Description */}
        <View
          style={{
            height: 30,
            justifyContent: 'flex-start',
            marginBottom: 6,
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 11,
              color: C.muted,
              lineHeight: 15,
            }}>
            {item.short_description || ' '}
          </Text>
        </View>

        {/* Price */}
        <View
          style={{
            height: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 10,
          }}>
          <FontAwesome name="rupee" size={12} color={C.primary} />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '800',
              color: C.primary,
            }}>
            {finalPrice}
          </Text>

          {hasDiscount && (
            <Text
              style={{
                fontSize: 11,
                color: C.muted,
                textDecorationLine: 'line-through',
              }}>
              ₹{regularPrice}
            </Text>
          )}
        </View>

        {/* Button */}
        <View
          style={{
            height: 34,
          }}>
          <Pressable
            onPress={() => onBuy(item._id)}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: C.primary,
              paddingVertical: 7,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: C.primary,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 3,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: C.white,
              }}>
              Buy
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, onSeeAll }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 14,
      }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: C.dark }}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Trust Badge ───────────────────────────────────────────────────────────────
function TrustBadge({ icon, title, subtitle }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: C.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon} size={20} color={C.primary} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: C.dark, textAlign: 'center' }}>
        {title}
      </Text>
      <Text style={{ fontSize: 10, color: C.muted, textAlign: 'center' }}>{subtitle}</Text>
    </View>
  );
}

// ── Skeleton loader for horizontal scroll ────────────────────────────────────
function ProductSkeleton() {
  return (
    <View style={{ flexDirection: 'row', paddingLeft: 20, gap: 14 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: 175,
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
          }}>
          <View style={{ height: 160, backgroundColor: '#e2e8f0' }} />
          <View style={{ padding: 12, gap: 8 }}>
            <View
              style={{ height: 12, backgroundColor: '#e2e8f0', borderRadius: 6, width: '80%' }}
            />
            <View
              style={{ height: 12, backgroundColor: '#e2e8f0', borderRadius: 6, width: '50%' }}
            />
            <View
              style={{ height: 32, backgroundColor: '#e2e8f0', borderRadius: 10, marginTop: 4 }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomeNative() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingP] = useState(true);
  const [loadingCats, setLoadingC] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setCategory] = useState('all'); // 'all' = no filter
  const [brands, setBrands] = useState([]);

  const router = useRouter();

  // ── Fetch featured products ──
  async function fetchProducts() {
    try {
      const { data } = await API.get('/product', { params: { featured: true } });
      setProducts(data.data || []);
    } catch (e) {
      console.error('Products fetch error:', e);
    } finally {
      setLoadingP(false);
    }
  }

  async function fetchBrands() {
    try {
      const { data } = await API.get('/brand');
      console.log('Brands fetched:', data);
      setBrands(data.data || []);
    } catch (e) {
      console.error('Brands fetch error:', e);
    }
  }

  // ── Fetch categories from /category ──
  async function fetchCategories() {
    try {
      const { data } = await API.get('/category');
      // API response could be: data.data / data.categories / data — handle all
      const cats = data.data || data.categories || data || [];
      setCategories(cats);
    } catch (e) {
      console.error('Categories fetch error:', e);
    } finally {
      setLoadingC(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

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
  const fetchEquipments = async () => {
    try {
      const res = await API.get('/product', {
        params: {
          page: 1,
          limit: 12,
          sort: '-createdAt',
          category: 'Equipments',
        },
      });
      // console.log('OFFER PRODUCTS:', res.data);
      return res.data.data || [];
    } catch (error) {
      console.error('Offers API Error:', error?.response?.data || error?.message);
      return [];
    }
  };

  const { data: equipments = [], isLoading: loadingEquipments } = useQuery({
    queryKey: ['equipments'],
    queryFn: fetchEquipments,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
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

  // ── Backend product search for search dropdown ──
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchProducts = async (query) => {
    const value = query.trim();

    if (!value) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      const { data } = await API.get('/product', {
        params: {
          search: value,
          limit: 8,
          page: 1,
        },
      });

      setSearchResults(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search API Error:', error?.response?.data || error?.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const value = search.trim();

    if (!value) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(() => {
      searchProducts(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Homepage products remain independent from search.
  // Category selection still only controls the homepage Featured Products section.
  const filtered = products.filter((p) => {
    const matchCat =
      activeCategory === 'all'
        ? true
        : p.category?.toLowerCase() === activeCategory.toLowerCase() ||
          p.category?._id === activeCategory ||
          p.category === activeCategory;

    return matchCat;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── TOP BAR ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 8,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 120, height: 42, resizeMode: 'contain' }}
            />
            {/* <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: C.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="medical" size={18} color="white" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '900',
                  color: C.primaryDark,
                  letterSpacing: -0.3,
                }}>
                MediShield
              </Text>
              <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted, letterSpacing: 1.5 }}>
                DENTAL CARE
              </Text>
            </View> */}
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: C.white,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: C.border,
              }}>
              <Ionicons name="notifications-outline" size={18} color={C.dark} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/cart')}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: C.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="bag-outline" size={18} color="white" />
            </Pressable>
          </View>
        </View>

        {/* ── SEARCH BAR + BACKEND SEARCH DROPDOWN ── */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
            zIndex: 1000,
            elevation: 1000,
          }}>
          <View
            style={{
              position: 'relative',
              zIndex: 1000,
              elevation: 1000,
            }}>
            {/* Search input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.white,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderWidth: 1.5,
                borderColor: search.length > 0 ? C.primary : C.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 4,
                gap: 10,
              }}>
              <Ionicons name="search-outline" size={18} color={C.muted} />

              <TextInput
                placeholder="Search dental products..."
                placeholderTextColor={C.muted}
                value={search}
                onChangeText={setSearch}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSearchResults(true);
                  }
                }}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: C.dark,
                  fontWeight: '500',
                }}
              />

              {search.length > 0 && (
                <Pressable
                  onPress={() => {
                    setSearch('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={C.muted} />
                </Pressable>
              )}
            </View>

            {/* Search results dropdown */}
            {showSearchResults && search.trim().length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 60,
                  left: 0,
                  right: 0,
                  backgroundColor: C.white,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: C.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.14,
                  shadowRadius: 14,
                  elevation: 12,
                  zIndex: 2000,
                  overflow: 'hidden',
                }}>
                {searchLoading ? (
                  <View
                    style={{
                      minHeight: 86,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 16,
                    }}>
                    <ActivityIndicator size="small" color={C.primary} />
                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: C.muted,
                        fontWeight: '600',
                      }}>
                      Searching products...
                    </Text>
                  </View>
                ) : searchResults.length === 0 ? (
                  <View
                    style={{
                      minHeight: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                    }}>
                    <Ionicons name="search-outline" size={24} color={C.muted} />
                    <Text
                      style={{
                        marginTop: 7,
                        fontSize: 13,
                        fontWeight: '800',
                        color: C.dark,
                      }}>
                      No products found
                    </Text>
                    <Text
                      style={{
                        marginTop: 3,
                        fontSize: 11,
                        color: C.muted,
                      }}>
                      Try another product name
                    </Text>
                  </View>
                ) : (
                  <>
                    {searchResults.map((item, index) => {
                      const productId = item?._id || item?.id;
                      const imageUri =
                        item?.thumbnail_url || item?.thumbnail || item?.image || item?.images?.[0];

                      return (
                        <Pressable
                          key={productId || `search-product-${index}`}
                          onPress={() => {
                            setShowSearchResults(false);
                            setSearch('');
                            if (productId) {
                              router.push(`/product/${productId}`);
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            minHeight: 68,
                            borderBottomWidth: index === searchResults.length - 1 ? 0 : 1,
                            borderBottomColor: '#f1f5f9',
                          }}>
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 10,
                              backgroundColor: C.bg,
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                            }}>
                            <Image
                              source={
                                imageUri
                                  ? { uri: imageUri }
                                  : require('../../assets/Image-not-found.png')
                              }
                              style={{
                                width: 46,
                                height: 46,
                              }}
                              resizeMode="contain"
                            />
                          </View>

                          <View
                            style={{
                              flex: 1,
                              marginLeft: 10,
                              marginRight: 8,
                            }}>
                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 13,
                                lineHeight: 17,
                                fontWeight: '700',
                                color: C.dark,
                              }}>
                              {item?.name || 'Unnamed product'}
                            </Text>

                            {(item?.price?.salePrice || item?.price?.regularPrice) && (
                              <Text
                                style={{
                                  marginTop: 3,
                                  fontSize: 11,
                                  fontWeight: '800',
                                  color: C.primary,
                                }}>
                                ₹{Number(item?.price?.salePrice || item?.price?.regularPrice || 0)}
                              </Text>
                            )}
                          </View>

                          <Ionicons name="chevron-forward" size={17} color={C.muted} />
                        </Pressable>
                      );
                    })}

                    {searchResults.length >= 8 && (
                      <Pressable
                        onPress={() => {
                          const value = search.trim();
                          setShowSearchResults(false);
                          router.push(`/shop?search=${encodeURIComponent(value)}`);
                        }}
                        style={{
                          paddingVertical: 12,
                          alignItems: 'center',
                          backgroundColor: C.primaryLight,
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '800',
                            color: C.primary,
                          }}>
                          View all search results →
                        </Text>
                      </Pressable>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        {/* ── HERO BANNER ── */}
        {/* <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              backgroundColor: C.primaryDark,
              padding: 24,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: C.primaryDark,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 8,
            }}>
            <View
              style={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: 'rgba(255,255,255,0.05)',
                top: -60,
                right: -40,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(45,212,191,0.15)',
                bottom: -30,
                right: 60,
              }}
            />

            <View style={{ flex: 1 }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <View
                  style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2dd4bf' }}
                />
                <Text
                  style={{ color: '#ffffff', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 }}>
                  PREMIUM STORE
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: '#fff',
                  letterSpacing: -0.5,
                  lineHeight: 28,
                }}>
                India's Best{'\n'}
                <Text style={{ color: '#2dd4bf' }}>Dental Store</Text>
              </Text>
              <Text style={{ fontSize: 13, color: '#ffffff', marginTop: 6, marginBottom: 16 }}>
                Tools, Materials & Equipment
              </Text>

              <Pressable
                onPress={() => router.push('/shop')}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: C.white,
                  borderRadius: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: C.primary }}>Shop Now</Text>
                <Ionicons name="arrow-forward" size={14} color={C.primary} />
              </Pressable>
            </View>

            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png' }}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>
        </View> */}

        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <HeroSlider />
        </View>

        {/* ── CATEGORIES (dynamic from API) ── */}
        <View style={{ marginBottom: 28 }}>
          <SectionHeader title="Categories" onSeeAll={() => router.push('/categories')} />

          {loadingCats ? (
            // Skeleton pills
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10 }}>
              {[80, 100, 90, 110].map((w, i) => (
                <View
                  key={i}
                  style={{
                    width: w,
                    height: 40,
                    borderRadius: 16,
                    backgroundColor: '#e2e8f0',
                  }}
                />
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}>
              {/* "All" pill always first */}
              <CategoryPill
                category={{ name: 'All', _id: 'all' }}
                active={activeCategory === 'all'}
                onPress={() => router.push('/shop')}
              />

              {/* Dynamic categories from API */}
              {categories.map((cat) => (
                <CategoryPill
                  key={cat._id || cat.name}
                  category={cat}
                  active={activeCategory === (cat._id || cat.name)}
                  onPress={() => {
                    router.push(`/shop?category=${encodeURIComponent(cat.name)}`);
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* ── DENTAL CARE ESSENTIALS ── */}
        <View
          style={{
            marginBottom: 30,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              marginBottom: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: C.dark,
                }}>
                Dental Care Essentials
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 5,
                }}>
                Explore products made for everyday practice
              </Text>
            </View>

            <Ionicons name="medical-outline" size={25} color={C.primary} />
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            {/* CARD 1 */}

            <Pressable
              onPress={() => router.push('/shop?category=Instruments')}
              style={{
                flex: 1,
                height: 175,
                marginRight: 8,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: '#dff7f4',
                padding: 16,
                justifyContent: 'space-between',
              }}>
              <View>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: C.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                  <Ionicons name="construct-outline" size={20} color={C.primary} />
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: C.dark,
                  }}>
                  Dental
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: C.primary,
                  }}>
                  Instruments
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: C.primary,
                    marginRight: 5,
                  }}>
                  Explore
                </Text>

                <Ionicons name="arrow-forward" size={13} color={C.primary} />
              </View>
            </Pressable>

            {/* CARD 2 */}

            <Pressable
              onPress={() => router.push('/shop?category=Materials')}
              style={{
                flex: 1,
                height: 175,
                marginLeft: 8,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: '#fff4dc',
                padding: 16,
                justifyContent: 'space-between',
              }}>
              <View>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: C.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                  <Ionicons name="flask-outline" size={20} color={C.accent} />
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: C.dark,
                  }}>
                  Dental
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: C.accent,
                  }}>
                  Materials
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: '#b45309',
                    marginRight: 5,
                  }}>
                  Explore
                </Text>

                <Ionicons name="arrow-forward" size={13} color="#b45309" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* <FeaturedCategories/> */}
        {/* ── FEATURED PRODUCTS (horizontal scroll like categories) ── */}
        <View style={{ marginBottom: 28 }}>
          <SectionHeader title="Featured Products" onSeeAll={() => router.push('/shop')} />

          {loadingProducts ? (
            <ProductSkeleton />
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: 'center', paddingHorizontal: 20 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                <Ionicons name="search-outline" size={28} color={C.muted} />
              </View>
              <Text style={{ color: C.dark, fontWeight: '700', fontSize: 15 }}>
                No products found
              </Text>
              <Text style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
                Try a different search or category
              </Text>
              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: C.primaryLight,
                    borderRadius: 10,
                  }}>
                  <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>
                    Clear search
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
              decelerationRate="fast"
              snapToInterval={189} // card width (175) + gap (14)
              snapToAlignment="start">
              {filtered.map((item) => (
                <ProductCardH
                  key={item._id}
                  item={item}
                  onBuy={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Add to cart', item._id)}
                />
              ))}

              {/* "View all" card at end */}
              <Pressable
                onPress={() => router.push('/shop')}
                style={{
                  width: 120,
                  marginRight: 20,
                  backgroundColor: C.primaryLight,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: C.primary,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: C.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: C.primary,
                    textAlign: 'center',
                  }}>
                  View All
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>

        {/* ── TRUST BADGES ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: C.white,
              borderRadius: 20,
              padding: 20,
              gap: 8,
              borderWidth: 1,
              borderColor: C.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <TrustBadge icon="rocket-outline" title="Fast Delivery" subtitle="2-5 business days" />
            <View style={{ width: 1, backgroundColor: C.border }} />
            <TrustBadge
              icon="shield-checkmark-outline"
              title="100% Authentic"
              subtitle="Certified products"
            />
            <View style={{ width: 1, backgroundColor: C.border }} />
            <TrustBadge icon="pricetag-outline" title="Best Price" subtitle="Lowest guaranteed" />
          </View>
        </View>

        <FeaturedCategoriesNative />

        <View style={{ paddingHorizontal: 0, marginBottom: 32 }}>
          <SectionHeader title="Top Brands" onSeeAll={() => router.push('/brands')} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 9,
            }}>
            {brands.map((brand) => (
              <Pressable
                key={brand._id}
                onPress={() => {
                  router.push(`/shop?brand=${encodeURIComponent(brand.name)}`);
                }}
                style={({ pressed }) => ({
                  // width: 100,
                  // height: 0,
                  backgroundColor: C.white,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: C.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  opacity: pressed ? 0.7 : 1,
                  // padding: 8,
                })}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: C.white,
                    padding: 10,
                    borderRadius: 12,
                    height: 90
                  }}>
                  <Image
                    source={{ uri: brand.logo }}
                    style={{
                      width: 80,
                      height: 40,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        {/* New Arrivals */}
        <View style={{ marginBottom: 28 }}>
          <SectionHeader
            title="Fresh Arrivals for Your Practice"
            onSeeAll={() => router.push('/new-arrivals')}
          />

          {loadingNewArrivals ? (
            <ProductSkeleton />
          ) : newArrivals.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: 'center', paddingHorizontal: 20 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                <Ionicons name="search-outline" size={28} color={C.muted} />
              </View>
              <Text style={{ color: C.dark, fontWeight: '700', fontSize: 15 }}>
                No products found
              </Text>
              <Text style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
                Try a different search or category
              </Text>
              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: C.primaryLight,
                    borderRadius: 10,
                  }}>
                  <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>
                    Clear search
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
              decelerationRate="fast"
              snapToInterval={189} // card width (175) + gap (14)
              snapToAlignment="start">
              {newArrivals.map((item) => (
                <ProductCardH
                  key={item._id}
                  item={item}
                  onBuy={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Add to cart', item._id)}
                />
              ))}

              {/* "View all" card at end */}
              <Pressable
                onPress={() => router.push('/shop')}
                style={{
                  width: 120,
                  marginRight: 20,
                  backgroundColor: C.primaryLight,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: C.primary,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: C.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: C.primary,
                    textAlign: 'center',
                  }}>
                  View All
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <OfferBanner />
        </View>
        <View style={{ marginBottom: 28, marginTop: 28 }}>
          <SectionHeader
            title="Offers You Don't Want to Miss"
            onSeeAll={() => router.push('/offers')}
          />

          {loadingOffers ? (
            <ProductSkeleton />
          ) : offerProducts.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: 'center', paddingHorizontal: 20 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                <Ionicons name="search-outline" size={28} color={C.muted} />
              </View>
              <Text style={{ color: C.dark, fontWeight: '700', fontSize: 15 }}>
                No products found
              </Text>
              <Text style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
                Try a different search or category
              </Text>
              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: C.primaryLight,
                    borderRadius: 10,
                  }}>
                  <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>
                    Clear search
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
              decelerationRate="fast"
              snapToInterval={189} // card width (175) + gap (14)
              snapToAlignment="start">
              {offerProducts.map((item) => (
                <ProductCardH
                  key={item._id}
                  item={item}
                  onBuy={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Add to cart', item._id)}
                />
              ))}

              {/* "View all" card at end */}
              <Pressable
                onPress={() => router.push('/shop')}
                style={{
                  width: 120,
                  marginRight: 20,
                  backgroundColor: C.primaryLight,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: C.primary,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: C.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: C.primary,
                    textAlign: 'center',
                  }}>
                  View All
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
        {/* ── PRACTICE ESSENTIALS ── */}
        <View
          style={{
            marginBottom: 32,
            paddingHorizontal: 20,
          }}>
          {/* HEADER */}
          <View
            style={{
              marginBottom: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: '900',
                  color: C.dark,
                  letterSpacing: -0.4,
                }}>
                Practice Essentials
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 5,
                }}>
                Everything your dental practice needs
              </Text>
            </View>

            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: C.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="medical-outline" size={20} color={C.primary} />
            </View>
          </View>

          {/* MAIN FEATURE CARD */}
          <View
            style={{
              backgroundColor: C.primaryDark,
              borderRadius: 22,
              padding: 18,
              overflow: 'hidden',
              marginBottom: 12,
            }}>
            {/* Decorative Circle */}
            <View
              style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: 75,
                right: -55,
                top: -65,
                backgroundColor: 'rgba(255,255,255,0.06)',
              }}
            />

            <View
              style={{
                position: 'absolute',
                width: 90,
                height: 90,
                borderRadius: 45,
                right: 35,
                bottom: -55,
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 13,
                }}>
                <Ionicons name="business-outline" size={23} color="#ffffff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '900',
                  }}>
                  Equip Your Practice
                </Text>

                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    lineHeight: 15,
                    marginTop: 3,
                  }}>
                  Quality products selected for modern dental professionals.
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 18,
              }}>
              <Pressable
                onPress={() => router.push('/shop?category=Equipment')}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 11,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: C.primaryDark,
                    fontSize: 11,
                    fontWeight: '900',
                  }}>
                  Explore Equipment
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={13}
                  color={C.primaryDark}
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            </View>
          </View>

          {/* SMALL CATEGORY CARDS */}
          <View
            style={{
              flexDirection: 'row',
            }}>
            {/* MATERIALS */}
            <Pressable
              onPress={() => router.push('/shop?category=Materials')}
              style={{
                flex: 1,
                minHeight: 125,
                backgroundColor: '#ffffff',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: C.border,
                padding: 14,
                marginRight: 6,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#ecfeff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="flask-outline" size={20} color="#0891b2" />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '900',
                    color: C.dark,
                  }}>
                  Materials
                </Text>

                <Text
                  style={{
                    fontSize: 9,
                    color: C.muted,
                    marginTop: 3,
                  }}>
                  Everyday essentials
                </Text>
              </View>
            </Pressable>

            {/* INSTRUMENTS */}
            <Pressable
              onPress={() => router.push('/shop?category=Instruments')}
              style={{
                flex: 1,
                minHeight: 125,
                backgroundColor: '#ffffff',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: C.border,
                padding: 14,
                marginLeft: 6,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#f0fdf4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="construct-outline" size={20} color="#16a34a" />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '900',
                    color: C.dark,
                  }}>
                  Instruments
                </Text>

                <Text
                  style={{
                    fontSize: 9,
                    color: C.muted,
                    marginTop: 3,
                  }}>
                  Professional tools
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <CircularVideoSectionNative />

        <View style={{ marginBottom: 28 }}>
          <SectionHeader
            title="Equipments"
            onSeeAll={() => router.push('/shop?category=Equipment')}
          />

          {loadingEquipments ? (
            <ProductSkeleton />
          ) : equipments.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: 'center', paddingHorizontal: 20 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                <Ionicons name="search-outline" size={28} color={C.muted} />
              </View>
              <Text style={{ color: C.dark, fontWeight: '700', fontSize: 15 }}>
                No products found
              </Text>
              <Text style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
                Try a different search or category
              </Text>
              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: C.primaryLight,
                    borderRadius: 10,
                  }}>
                  <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13 }}>
                    Clear search
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
              decelerationRate="fast"
              snapToInterval={189} // card width (175) + gap (14)
              snapToAlignment="start">
              {equipments.map((item) => (
                <ProductCardH
                  key={item._id}
                  item={item}
                  onBuy={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Add to cart', item._id)}
                />
              ))}

              {/* "View all" card at end */}
              <Pressable
                onPress={() => router.push('/shop')}
                style={{
                  width: 120,
                  marginRight: 20,
                  backgroundColor: C.primaryLight,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: C.primary,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: C.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: C.primary,
                    textAlign: 'center',
                  }}>
                  View All
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
