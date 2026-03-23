// app/(tabs)/index.web.jsx
//
// Responsive breakpoints:
//   xs  < 480px  → mobile (single col)
//   sm  < 768px  → tablet portrait (2 col)
//   md  < 1024px → tablet landscape (3 col)
//   lg  ≥ 1024px → desktop (4 col)

import { useContext, useEffect, useState } from 'react';
import {
  Text, View, Image, ScrollView, TextInput,
  Pressable, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axios';
import Footer from 'components/Footer/Footer';
import BannerSlider from 'components/Slider/BannerSlider';

// ── Colour tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:      '#0f766e',
  primaryDark:  '#0f4f4f',
  primaryLight: '#ccfbf1',
  accent:       '#f59e0b',
  accentLight:  '#fef3c7',
  bg:           '#f8fffe',
  white:        '#ffffff',
  dark:         '#0f172a',
  muted:        '#64748b',
  border:       '#e2e8f0',
  card:         '#ffffff',
};

// ── Responsive helpers ────────────────────────────────────────────────────────
function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    // product grid columns
    cols: width < 480 ? 1 : width < 768 ? 2 : width < 1024 ? 4 : 5,
    px: width < 640 ? 16 : width < 1024 ? 24 : 40,
  };
}

// ── Icon map for categories ───────────────────────────────────────────────────
const ICON_MAP = {
  instruments:  'build-outline',
  materials:    'flask-outline',
  equipment:    'hardware-chip-outline',
  consumables:  'medical-outline',
  hygiene:      'shield-checkmark-outline',
  all:          'grid-outline',
};
function catIcon(name = '') {
  return ICON_MAP[name.toLowerCase()] || 'grid-outline';
}

// ── Web Header ────────────────────────────────────────────────────────────────
function WebHeader({ search, setSearch, cartCount, categories, activeCategory, setCategory }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isMobile, isTablet, px } = useBreakpoint();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{
      backgroundColor: C.white,
      borderBottomWidth: 1, borderBottomColor: C.border,
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      {/* ── Announcement bar (desktop only) ── */}
      {!isMobile && (
        <View style={{
          backgroundColor: C.primaryDark,
          paddingVertical: 7, paddingHorizontal: px,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Text style={{ color: '#5eead4', fontSize: 12, fontWeight: '600' }}>
            🚚 Free shipping on orders above ₹999
          </Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            {['About', 'Contact', 'Track Order'].map(l => (
              <Pressable key={l}>
                <Text style={{ color: '#94d8d4', fontSize: 12 }}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* ── Main header row ── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: px, paddingVertical: isMobile ? 12 : 14, gap: isMobile ? 12 : 24,
      }}>
        {/* Logo */}
        <Pressable
          onPress={() => router.push('/')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <Image 
  source={require('../../assets/logo.png')} 
  style={{ 
    width: isMobile ? 24 : 120, 
    height: isMobile ? 24 : 40,
    resizeMode: 'contain',
    mixBlendMode: 'difference',
  }}
/>
          {/* <View style={{
            width: isMobile ? 34 : 40, height: isMobile ? 34 : 40,
            borderRadius: isMobile ? 10 : 12,
            backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="medical" size={isMobile ? 17 : 20} color="white" />
          </View>
          <View>
            <Text style={{ fontSize: isMobile ? 16 : 20, fontWeight: '900', color: C.primaryDark, letterSpacing: -0.3 }}>
              MediShield
            </Text>
            {!isMobile && (
              <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted, letterSpacing: 2 }}>
                DENTAL CARE
              </Text>
            )}
          </View> */}
        </Pressable>

        {/* Nav links — desktop only */}
        {isTablet || isMobile ? null : (
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {['Home', 'Products', 'Categories', 'Offers'].map((nav) => (
              <Pressable key={nav} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.dark }}>{nav}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Search bar */}
        <View style={{
          flex: 1, maxWidth: isMobile ? 999 : 360,
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: C.bg, borderRadius: 14,
          borderWidth: 1.5, borderColor: C.border,
          paddingHorizontal: 12, paddingVertical: isMobile ? 9 : 10, gap: 8,
        }}>
          <Ionicons name="search-outline" size={16} color={C.muted} />
          <TextInput
            placeholder="Search dental products..."
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, fontSize: 14, color: C.dark, outlineStyle: 'none' }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={C.muted} />
            </Pressable>
          )}
        </View>

        {/* Right actions */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {/* Coins — hide on mobile */}
          {!isMobile && (
            <Pressable style={{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              backgroundColor: C.accentLight, borderRadius: 10,
              paddingHorizontal: 10, paddingVertical: 7,
            }}>
              <Ionicons name="logo-bitcoin" size={15} color={C.accent} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400e' }}>50</Text>
            </Pressable>
          )}

          {/* Cart */}
          <Pressable
            onPress={() => router.push('/cart')}
            style={{
              width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
              borderRadius: 12, backgroundColor: C.primary,
              alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}
          >
            <Ionicons name="bag-outline" size={isMobile ? 18 : 20} color="white" />
            {cartCount > 0 && (
              <View style={{
                position: 'absolute', top: -4, right: -4,
                backgroundColor: C.accent, borderRadius: 10,
                width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: 'white', fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Account */}
          {user ? (
            <Pressable
              onPress={() => router.push('/profile')}
              style={{
                width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
                borderRadius: 12, backgroundColor: C.primaryLight,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={isMobile ? 18 : 20} color={C.primary} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/auth/login')}
              style={{
                backgroundColor: C.primary, borderRadius: 12,
                paddingHorizontal: isMobile ? 12 : 16,
                paddingVertical: isMobile ? 8 : 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: isMobile ? 12 : 13, fontWeight: '700' }}>
                {isMobile ? 'Login' : 'Sign In'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Category strip (dynamic) ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: px, paddingBottom: 12,
          borderTopWidth: 1, borderTopColor: C.border,
          paddingTop: 10, gap: 6, flexDirection: 'row',
        }}
      >
        {/* All pill */}
        {[{ _id: 'all', name: 'All' }, ...categories].map((cat) => {
          const isActive = activeCategory === (cat._id || cat.name);
          return (
            <Pressable
              key={cat._id || cat.name}
              onPress={() => setCategory(cat._id || cat.name)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
                backgroundColor: isActive ? C.primary : C.bg,
                borderWidth: 1, borderColor: isActive ? C.primary : C.border,
              }}
            >
              <Ionicons
                name={catIcon(cat.name)}
                size={14}
                color={isActive ? 'white' : C.muted}
              />
              <Text style={{
                fontSize: 13, fontWeight: '600',
                color: isActive ? 'white' : C.dark,
                whiteSpace: 'nowrap',
              }}>{cat.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ── Product Card (web) ────────────────────────────────────────────────────────
function WebProductCard({ item, onBuy, onCart, cols }) {
  const [hovered, setHovered] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  // Calculate card width based on cols and gaps
  const gapTotal = (cols - 1) * 16;
  const cardPct = `${(100 / cols).toFixed(2)}%`;

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width: cardPct,
        marginBottom: 20,
        backgroundColor: C.card, borderRadius: 20, overflow: 'hidden',
        borderWidth: 1, borderColor: hovered ? C.primary : C.border,
        transform: [{ translateY: hovered ? -4 : 0 }],
        boxShadow: hovered
          ? '0 12px 40px rgba(15,118,110,0.15)'
          : '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Image */}
      <View style={{ position: 'relative', backgroundColor: C.bg }}>
        <Image
          source={{ uri: item.thumbnail_url }}
          style={{ width: '100%', height: isMobile ? 160 : 200 }}
          resizeMode="cover"
        />
        {item.featured && (
          <View style={{
            position: 'absolute', top: 10, left: 10,
            backgroundColor: C.accent, borderRadius: 6,
            paddingHorizontal: 8, paddingVertical: 4,
          }}>
            <Text style={{ color: 'white', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>
              FEATURED
            </Text>
          </View>
        )}
        <Pressable style={{
          position: 'absolute', top: 10, right: 10,
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 20, padding: 6,
        }}>
          <Ionicons name="heart-outline" size={16} color={C.muted} />
        </Pressable>

        {/* Hover overlay */}
        {hovered && (
          <Pressable
            onPress={() => onCart(item)}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              backgroundColor: 'rgba(15,77,77,0.88)',
              padding: 10, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 6,
            }}
          >
            <Ionicons name="bag-add-outline" size={16} color="white" />
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>Quick Add</Text>
          </Pressable>
        )}
      </View>

      {/* Info */}
      <View style={{ padding: isMobile ? 12 : 14 }}>
        <Text numberOfLines={2} style={{
          fontSize: isMobile ? 13 : 14, fontWeight: '700', color: C.dark,
          lineHeight: 20, marginBottom: 6,
        }}>
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Text style={{ fontSize: isMobile ? 15 : 17, fontWeight: '900', color: C.primary }}>
            ₹{item.price?.regularPrice}
          </Text>
          {item.price?.salePrice && item.price.salePrice < item.price.regularPrice && (
            <Text style={{ fontSize: 12, color: C.muted, textDecorationLine: 'line-through' }}>
              ₹{item.price.salePrice}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => onCart(item)}
            style={{
              flex: 1, borderRadius: 10, borderWidth: 1.5,
              borderColor: C.primary, paddingVertical: 8, alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.primary }}>Add to Cart</Text>
          </Pressable>
          <Pressable
            onPress={() => onBuy(item._id)}
            style={{
              flex: 1, borderRadius: 10, backgroundColor: C.primary,
              paddingVertical: 8, alignItems: 'center',
              boxShadow: '0 4px 14px rgba(15,118,110,0.3)',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: 'white' }}>Buy Now</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// ── Product Grid Skeleton ─────────────────────────────────────────────────────
function GridSkeleton({ cols }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {Array(cols * 2).fill(0).map((_, i) => (
        <View key={i} style={{
          width: `${(100 / cols).toFixed(2)}%`,
          borderRadius: 20, overflow: 'hidden',
          backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
        }}>
          <View style={{ height: 200, backgroundColor: '#e2e8f0' }} />
          <View style={{ padding: 14, gap: 8 }}>
            <View style={{ height: 14, backgroundColor: '#e2e8f0', borderRadius: 6, width: '80%' }} />
            <View style={{ height: 14, backgroundColor: '#e2e8f0', borderRadius: 6, width: '50%' }} />
            <View style={{ height: 36, backgroundColor: '#e2e8f0', borderRadius: 10, marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomeWeb() {
  const [products,    setProducts]   = useState([]);
  const [categories,  setCategories] = useState([]);
  const [loadingP,    setLoadingP]   = useState(true);
  const [loadingC,    setLoadingC]   = useState(true);
  const [search,      setSearch]     = useState('');
  const [activeCategory, setCategory] = useState('all');
  const [cartCount] = useState(0);

  const router = useRouter();
  const { cols, px, isMobile, isTablet } = useBreakpoint();

  // ── Fetch products ──
  async function fetchProducts() {
    try {
      const res = await API.get('/product', { params: { featured: true } });
      setProducts(res.data.data || []);
    } catch (e) {
      console.error('Products error:', e);
    } finally {
      setLoadingP(false);
    }
  }

  // ── Fetch categories ──
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ── Filter ──
  const filtered = products.filter((p) => {
    const matchSearch = search.trim()
      ? p.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchCat = activeCategory === 'all'
      ? true
      : p.category?._id === activeCategory ||
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>

      {/* ── Sticky Header ── */}
      <WebHeader
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        categories={loadingC ? [] : categories}
        activeCategory={activeCategory}
        setCategory={setCategory}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
      
      

        {/* ── HERO ── */}
        <View style={{ paddingHorizontal: px, paddingTop: isMobile ? 20 : 32, paddingBottom: isMobile ? 24 : 40 }}>
          <View style={{
            borderRadius: isMobile ? 20 : 28, overflow: 'hidden',
            backgroundColor: C.primaryDark,
            padding: isMobile ? 24 : isTablet ? 40 : 60,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            boxShadow: '0 20px 60px rgba(15,77,77,0.25)',
            gap: isMobile ? 20 : 0,
          }}>
            {/* Decorative circles */}
            <View style={{ position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.04)', top: -120, right: -80 }} />
            <View style={{ position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(45,212,191,0.1)', bottom: -60, right: 160 }} />
            <View style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)',
              backgroundSize: '30px 30px',
            }} />

            {/* Copy */}
            <View style={{ flex: 1 }}>
              <View style={{
                alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 30, paddingHorizontal: 12, paddingVertical: 5,
                flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16,
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2dd4bf' }} />
                <Text style={{ color: '#5eead4', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
                  INDIA'S TRUSTED DENTAL STORE
                </Text>
              </View>

              <Text style={{
                fontSize: isMobile ? 32 : isTablet ? 40 : 52,
                fontWeight: '900', color: '#fff',
                letterSpacing: -1, lineHeight: isMobile ? 38 : isTablet ? 48 : 60,
                marginBottom: 14,
              }}>
                Your Smile,{'\n'}
                <Text style={{ color: '#2dd4bf' }}>Our Priority.</Text>
              </Text>

              <Text style={{
                color: '#94d8d4', fontSize: isMobile ? 14 : 16,
                lineHeight: 24, maxWidth: 440, marginBottom: isMobile ? 20 : 32,
              }}>
                Shop clinically approved dental tools, materials and equipment trusted
                by dentists and patients across India.
              </Text>

              <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                <Pressable style={{
                  backgroundColor: C.white, borderRadius: 14,
                  paddingHorizontal: isMobile ? 20 : 28,
                  paddingVertical: isMobile ? 12 : 14,
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                }}>
                  <Text style={{ fontSize: isMobile ? 14 : 15, fontWeight: '800', color: C.primary }}>Shop Now</Text>
                  <Ionicons name="arrow-forward" size={16} color={C.primary} />
                </Pressable>

                {!isMobile && (
                  <Pressable style={{
                    borderRadius: 14, borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.25)',
                    paddingHorizontal: 28, paddingVertical: 14,
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>
                      View Catalogue
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Stats */}
              <View style={{ flexDirection: 'row', gap: isMobile ? 20 : 40, marginTop: isMobile ? 24 : 40, flexWrap: 'wrap' }}>
                {[
                  { val: '50K+', label: 'Customers' },
                  { val: '200+', label: 'Products' },
                  { val: '4.9★', label: 'Rating' },
                  { val: '2-5d', label: 'Delivery' },
                ].map(s => (
                  <View key={s.label}>
                    <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: '900', color: '#fff' }}>{s.val}</Text>
                    <Text style={{ fontSize: 12, color: '#5eead4', fontWeight: '600' }}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Hero image — hidden on mobile */}
            {!isMobile && (
              <View style={{ width: isTablet ? 180 : 260, alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png' }}
                  style={{ width: isTablet ? 160 : 220, height: isTablet ? 160 : 220, opacity: 0.9 }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </View>

        {/* ── TRUST BAR ── */}
        <View style={{ paddingHorizontal: px, marginBottom: isMobile ? 24 : 40 }}>
          <View style={{
            flexDirection: isMobile ? 'column' : 'row',
            backgroundColor: C.white, borderRadius: 16,
            padding: isMobile ? 16 : 20,
            borderWidth: 1, borderColor: C.border,
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            gap: isMobile ? 12 : 0,
          }}>
            {[
              { icon: 'rocket-outline',           title: 'Fast Delivery',  sub: '2-5 business days' },
              { icon: 'shield-checkmark-outline', title: '100% Authentic', sub: 'Clinically certified' },
              { icon: 'pricetag-outline',         title: 'Best Price',     sub: 'Lowest guaranteed' },
              { icon: 'headset-outline',          title: '24/7 Support',   sub: 'Always here to help' },
            ].map((b, i, arr) => (
              <View key={b.title} style={{
                flex: isMobile ? undefined : 1,
                flexDirection: 'row', alignItems: 'center', gap: 12,
                borderRightWidth: !isMobile && i < arr.length - 1 ? 1 : 0,
                borderRightColor: C.border,
                borderBottomWidth: isMobile && i < arr.length - 1 ? 1 : 0,
                borderBottomColor: C.border,
                paddingRight: !isMobile && i < arr.length - 1 ? 20 : 0,
                paddingLeft: !isMobile && i > 0 ? 20 : 0,
                paddingBottom: isMobile && i < arr.length - 1 ? 12 : 0,
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 13,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ionicons name={b.icon} size={20} color={C.primary} />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.dark }}>{b.title}</Text>
                  <Text style={{ fontSize: 12, color: C.muted }}>{b.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── FEATURED PRODUCTS ── */}
        <View style={{ paddingHorizontal: px, marginBottom: isMobile ? 24 : 40 }}>
          {/* Section header */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 20,
          }}>
            <View>
              <Text style={{
                fontSize: isMobile ? 22 : 28, fontWeight: '900',
                color: C.dark, letterSpacing: -0.5,
              }}>
                Featured Products
              </Text>
              <Text style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
                Handpicked by our dental experts
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/shop')}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                borderWidth: 1.5, borderColor: C.primary, borderRadius: 12,
                paddingHorizontal: 14, paddingVertical: 8,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color={C.primary} />
            </Pressable>
          </View>

          {/* Products */}
          {loadingP ? (
            <GridSkeleton cols={cols} />
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <View style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Ionicons name="search-outline" size={32} color={C.muted} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.dark }}>No products found</Text>
              <Text style={{ color: C.muted, marginTop: 6, fontSize: 14 }}>Try a different search or category</Text>
              {search.length > 0 && (
                <Pressable
                  onPress={() => setSearch('')}
                  style={{ marginTop: 14, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: C.primaryLight, borderRadius: 12 }}
                >
                  <Text style={{ color: C.primary, fontWeight: '700' }}>Clear search</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {filtered.map((item) => (
                <WebProductCard
                  key={item._id}
                  item={item}
                  cols={cols}
                  onBuy={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Add to cart', item._id)}
                />
              ))}
            </View>
          )}
        </View>

        <BannerSlider/>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: px, gap: 16, marginBottom: isMobile ? 24 : 40 }}>
          {products.map(product => (
            <WebProductCard
              key={product._id}
              item={product}
              onBuy={(id) => router.navigate(`/product/${id}`)}
                  onCart={(item) => console.log('Add to cart', item._id)}
              />
          ))}
        </ScrollView>

        {/* ── OFFER BANNER ── */}
        <View style={{ paddingHorizontal: px, marginBottom: isMobile ? 32 : 50 }}>
          <View style={{
            borderRadius: isMobile ? 20 : 24,
            backgroundColor: C.accentLight,
            padding: isMobile ? 24 : 40,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            borderWidth: 1, borderColor: '#fde68a', overflow: 'hidden',
          }}>
            <View style={{ position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#fde68a', opacity: 0.25, right: -60, top: -80 }} />
            <View>
              <View style={{ alignSelf: 'flex-start', backgroundColor: C.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: '800' }}>LIMITED TIME OFFER</Text>
              </View>
              <Text style={{ fontSize: isMobile ? 28 : 38, fontWeight: '900', color: C.dark, letterSpacing: -0.5 }}>Flat 20% OFF</Text>
              <Text style={{ fontSize: isMobile ? 13 : 15, color: C.muted, marginTop: 6, marginBottom: 20 }}>
                On all dental materials this week. Code:{' '}
                <Text style={{ fontWeight: '800', color: C.dark }}>DENTAL20</Text>
              </Text>
              <Pressable style={{
                alignSelf: 'flex-start', backgroundColor: C.dark,
                borderRadius: 14, paddingHorizontal: isMobile ? 18 : 24,
                paddingVertical: isMobile ? 11 : 13,
                flexDirection: 'row', alignItems: 'center', gap: 8,
              }}>
                <Text style={{ color: 'white', fontSize: isMobile ? 13 : 14, fontWeight: '800' }}>Claim Offer</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </Pressable>
            </View>
            {!isMobile && (
              <Text style={{ fontSize: 100, fontWeight: '900', color: C.accent, opacity: 0.2 }}>20%</Text>
            )}
          </View>
        </View>

        {/* ── FOOTER ── */}
        

        <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}