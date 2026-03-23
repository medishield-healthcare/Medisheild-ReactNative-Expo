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

const C = {
  primary: '#0f766e',
  primaryDark: '#0f4f4f',
  primaryLight: '#ccfbf1',
  accent: '#f59e0b',
  accentLight: '#fef3c7',
  bg: '#f0fafa',
  white: '#ffffff',
  dark: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  card: '#ffffff',
};

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
          source={{ uri: item.thumbnail_url }}
          style={{ width: '100%', height: 160, backgroundColor: C.bg }}
          resizeMode="cover"
        />
        {/* Featured badge */}
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
            <Text style={{ color: C.white, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>
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
      <View style={{ padding: 12 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: C.dark,
            lineHeight: 18,
            marginBottom: 4,
          }}>
          {item.name}
        </Text>

        {/* Price */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <FontAwesome name="rupee" size={12} color={C.primary} />
          <Text style={{ fontSize: 15, fontWeight: '800', color: C.primary }}>
            {item.price?.regularPrice}
          </Text>
          {item.price?.salePrice && item.price.salePrice < item.price.regularPrice && (
            <Text style={{ fontSize: 11, color: C.muted, textDecorationLine: 'line-through' }}>
              ₹{item.price.salePrice}
            </Text>
          )}
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Pressable
            onPress={() => onCart(item)}
            style={{
              flex: 1,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: C.primary,
              paddingVertical: 7,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.primary }}>Cart</Text>
          </Pressable>
          <Pressable
            onPress={() => onBuy(item._id)}
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: C.primary,
              paddingVertical: 7,
              alignItems: 'center',
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 3,
            }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.white }}>Buy</Text>
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
      <Text style={{ fontSize: 17, fontWeight: '800', color: C.dark }}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>See all</Text>
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

  // ── Filter logic ──
  const filtered = products.filter((p) => {
    const matchSearch = search.trim() ? p.name?.toLowerCase().includes(search.toLowerCase()) : true;
    const matchCat =
      activeCategory === 'all'
        ? true
        : p.category?.toLowerCase() === activeCategory.toLowerCase() ||
          p.category?._id === activeCategory ||
          p.category === activeCategory;
    return matchSearch && matchCat;
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

        {/* ── SEARCH BAR ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: C.white,
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1.5,
              borderColor: C.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
              gap: 10,
            }}>
            <Ionicons name="search-outline" size={18} color={C.muted} />
            <TextInput
              placeholder="Search dental products..."
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, fontSize: 14, color: C.dark, fontWeight: '500' }}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={C.muted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── HERO BANNER ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
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
                  style={{ color: '#5eead4', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 }}>
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
              <Text style={{ fontSize: 13, color: '#94d8d4', marginTop: 6, marginBottom: 16 }}>
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
        </View>

        {/* ── CATEGORIES (dynamic from API) ── */}
        <View style={{ marginBottom: 28 }}>
          <SectionHeader title="Categories" onSeeAll={() => router.push('/shop')} />

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
                onPress={() => setCategory('all')}
              />

              {/* Dynamic categories from API */}
              {categories.map((cat) => (
                <CategoryPill
                  key={cat._id || cat.name}
                  category={cat}
                  active={activeCategory === (cat._id || cat.name)}
                  onPress={() => setCategory(cat._id || cat.name)}
                />
              ))}
            </ScrollView>
          )}
        </View>

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

        {/* Brands  */}

        <View style={{ paddingHorizontal: 0, marginBottom: 32 }}>
          <SectionHeader title="Top Brands" onSeeAll={() => router.push('/shop')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {brands.map((brand) => (
              <View
                key={brand._id}
                style={{
                  width: 100,
                  height: 80,
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
                }}>
                <Image
                  source={{ uri: brand.logo }}
                  style={{ width: 80, height: 40, resizeMode: 'contain' }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── OFFER BANNER ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: C.accentLight,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#fde68a',
            }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: C.accent,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  marginBottom: 8,
                }}>
                <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>
                  LIMITED TIME
                </Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: '900', color: C.dark }}>Flat 20% OFF</Text>
              <Text style={{ fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 14 }}>
                On all dental materials this week
              </Text>
              <Pressable
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: C.dark,
                  borderRadius: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <Text style={{ color: C.white, fontSize: 13, fontWeight: '700' }}>Claim Offer</Text>
                <Ionicons name="arrow-forward" size={13} color="white" />
              </Pressable>
            </View>
            <Text style={{ fontSize: 56, fontWeight: '900', color: C.accent, opacity: 0.4 }}>
              20%
            </Text>
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}
