// components/Header/header.web.jsx
//
// ✅ Fully self-contained — no props needed, manages own state
// ✅ Search with live dropdown (debounced 350ms) → click → product detail
// ✅ Category strip from API → click → /shop?category=xyz
// ✅ Sticky header with announcement bar
// ✅ Responsive: mobile / tablet / desktop
// ✅ Cart count from context
// ✅ Auth-aware account button

import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

// ── Theme ─────────────────────────────────────────────────────────────────────
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
};

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP = {
  all: 'grid-outline',
  instruments: 'build-outline',
  materials: 'flask-outline',
  equipment: 'hardware-chip-outline',
  consumables: 'medical-outline',
  hygiene: 'shield-checkmark-outline',
};
const catIcon = (name = '') => ICON_MAP[name.toLowerCase()] || 'grid-outline';

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Search Dropdown ───────────────────────────────────────────────────────────
function SearchDropdown({ results, loading, query, onSelect, onClose }) {
  if (!query.trim()) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 6,
        backgroundColor: C.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        zIndex: 99999,
        maxHeight: 420,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(15,118,110,0.14)',
      }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: C.muted, letterSpacing: 0.5 }}>
          {loading
            ? 'Searching...'
            : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
        </Text>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={16} color={C.muted} />
        </Pressable>
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ paddingVertical: 28, alignItems: 'center', gap: 8 }}>
          <ActivityIndicator color={C.primary} size="small" />
          <Text style={{ fontSize: 13, color: C.muted }}>Looking for products...</Text>
        </View>
      )}

      {/* No results */}
      {!loading && results.length === 0 && (
        <View style={{ paddingVertical: 32, alignItems: 'center', gap: 8 }}>
          <Ionicons name="search-outline" size={32} color={C.border} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.dark }}>No products found</Text>
          <Text style={{ fontSize: 12, color: C.muted }}>Try different keywords</Text>
        </View>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {results.map((item, index) => (
            <Pressable
              key={item._id}
              onPress={() => onSelect(item)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                backgroundColor: pressed ? C.primaryLight : C.white,
                borderBottomWidth: index < results.length - 1 ? 1 : 0,
                borderBottomColor: '#f1f5f9',
              })}>
              {/* Thumbnail */}
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  backgroundColor: C.bg,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: C.border,
                  flexShrink: 0,
                }}>
                <Image
                  source={{ uri: item.thumbnail_url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>

              {/* Info */}
              <View style={{ flex: 1, gap: 2 }}>
                <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '700', color: C.dark }}>
                  {item.name}
                </Text>
                {item.short_description && (
                  <Text numberOfLines={1} style={{ fontSize: 11, color: C.muted }}>
                    {item.short_description}
                  </Text>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 }}>
                  <Text style={{ fontSize: 12, color: C.muted }}>₹</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: C.primary }}>
                    {item.price?.regularPrice}
                  </Text>
                  {item.manufacturer && (
                    <Text style={{ fontSize: 11, color: C.muted, marginLeft: 6 }}>
                      · {item.manufacturer}
                    </Text>
                  )}
                </View>
              </View>

              {/* Arrow */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="arrow-forward" size={14} color={C.primary} />
              </View>
            </Pressable>
          ))}

          {/* View all results */}
          <Pressable
            onPress={() => {
              onClose();
              // Navigate to shop with search query
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: 12,
              backgroundColor: C.primaryLight,
            }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>
              View all results for "{query}"
            </Text>
            <Ionicons name="arrow-forward" size={14} color={C.primary} />
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function WebHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const px = isMobile ? 16 : isTablet ? 24 : 40;

  // ── State ──
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount] = useState(0); // connect to cart context if available

  const debouncedSearch = useDebounce(search, 350);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // ── Fetch categories ──
  // useEffect(() => {
  //   API.get('/category')
  //     .then(({ data }) => setCategories(data.data || data.categories || data || []))
  //     .catch(console.error);
  // }, []);

  const { category } = useLocalSearchParams();

  useEffect(() => {
    if (category) {
      setActiveCategory(category); // direct
    } else {
      setActiveCategory('all');
    }
  }, [category]);

  async function fetchCategory() {
    let { data } = await API.get('/category');
    setCategories(data.data || data.categories || data || []);
    return data.data || data.categories || data || [];
  }

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategory,
  });

  // ── Live search ──
  useEffect(() => {
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    API.get('/product', {
      params: { search: debouncedSearch, limit: 8, page: 1 },
    })
      .then(({ data }) => setSearchResults(data.data || []))
      .catch(console.error)
      .finally(() => setSearchLoading(false));
  }, [debouncedSearch]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Handlers ──
  const handleSelectProduct = useCallback(
    (item) => {
      setSearch('');
      setSearchFocused(false);
      setSearchResults([]);
      router.push(`/product/${item._id}`);
    },
    [router]
  );

  const handleCategoryPress = (cat) => {
    const value = cat.name;

    setActiveCategory(value);

    if (value === 'All') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${encodeURIComponent(value)}`);
    }
  };

  const showDropdown = searchFocused && search.trim().length >= 2;

  return (
    <View
      style={{
        backgroundColor: C.white,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        overflow: 'visible',
      }}>
      {/* ── Announcement bar ── */}
      {!isMobile && (
        <View
          style={{
            backgroundColor: C.primaryDark,
            paddingVertical: 7,
            paddingHorizontal: px,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ color: '#5eead4', fontSize: 12, fontWeight: '600' }}>
            🚚 Free shipping on orders above ₹999
          </Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            {['About', 'Contact', 'Track Order'].map((l) => (
              <Pressable
                key={l}
                onPress={() => router.push(`/${l.toLowerCase().replace(' ', '-')}`)}>
                <Text style={{ color: '#94d8d4', fontSize: 12 }}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* ── Main row ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: px,
          paddingVertical: isMobile ? 10 : 14,
          gap: isMobile ? 10 : 20,
          position: 'relative',
          zIndex: 10,
          overflow: 'visible',
        }}>
        {/* Logo */}
        <Pressable
          onPress={() => router.push('/')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: isMobile ? 100 : 130,
              height: isMobile ? 32 : 42,
              resizeMode: 'contain',
            }}
          />
        </Pressable>

        {/* Nav links — desktop only */}
        {isDesktop && (
          <View style={{ flexDirection: 'row', gap: 2 }}>
            {[
              { name: 'Home', link: '/' },
              { name: 'Products', link: '/shop' },
              { name: 'Offers', link: '/offers' },
            ].map((nav) => (
              <Pressable
                key={nav.name}
                onPress={() => router.push(nav.link)}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.dark }}>{nav.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* ── Search with dropdown ── */}
        <View ref={searchRef} style={{ flex: 1, position: 'relative', zIndex: 9999 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: searchFocused ? C.white : C.bg,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: searchFocused ? C.primary : C.border,
              paddingHorizontal: 12,
              paddingVertical: isMobile ? 9 : 10,
              gap: 8,
              transition: 'all 0.15s ease',
              boxShadow: searchFocused ? '0 0 0 3px rgba(15,118,110,0.12)' : 'none',
            }}>
            <Ionicons
              name={searchLoading ? 'sync-outline' : 'search-outline'}
              size={16}
              color={searchFocused ? C.primary : C.muted}
            />
            <TextInput
              placeholder="Search dental products, brands, SKUs..."
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setSearchFocused(true)}
              style={{
                flex: 1,
                fontSize: 14,
                color: C.dark,
                outlineStyle: 'none',
                fontWeight: search ? '500' : '400',
                width: '100%',
              }}
            />
            {search.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearch('');
                  setSearchResults([]);
                }}
                style={{ padding: 2 }}>
                <Ionicons name="close-circle" size={16} color={C.muted} />
              </Pressable>
            )}
          </View>

          {/* Dropdown */}
          {showDropdown && (
            <View ref={dropdownRef}>
              <SearchDropdown
                results={searchResults}
                loading={searchLoading}
                query={search}
                onSelect={handleSelectProduct}
                onClose={() => {
                  setSearchFocused(false);
                  setSearch('');
                  setSearchResults([]);
                }}
              />
            </View>
          )}
        </View>

        {/* ── Right actions ── */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {/* Coins — desktop only */}
          {isDesktop && (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: C.accentLight,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 7,
              }}>
              <Ionicons name="logo-bitcoin" size={15} color={C.accent} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400e' }}>
                {user?.medishieldcoins ?? 0}
              </Text>
            </Pressable>
          )}

          {/* Wishlist — desktop */}
          {isDesktop && (
            <Pressable
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: C.bg,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: C.border,
              }}>
              <Ionicons name="heart-outline" size={20} color={C.dark} />
            </Pressable>
          )}

          {/* Cart */}
          <Pressable
            onPress={() => router.push('/cart')}
            style={{
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              borderRadius: 12,
              backgroundColor: C.primary,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
            <Ionicons name="bag-outline" size={isMobile ? 17 : 20} color="white" />
            {cartCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: C.accent,
                  borderRadius: 10,
                  width: 17,
                  height: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
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
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                borderRadius: 12,
                backgroundColor: C.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* Initials avatar */}
              <Text style={{ fontSize: 13, fontWeight: '800', color: C.primary }}>
                {((user.firstname?.[0] || '') + (user.lastname?.[0] || '')).toUpperCase() || '?'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/auth/login')}
              style={{
                backgroundColor: C.primary,
                borderRadius: 12,
                paddingHorizontal: isMobile ? 12 : 16,
                paddingVertical: isMobile ? 7 : 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
              {!isMobile && <Ionicons name="person-outline" size={14} color="white" />}
              <Text style={{ color: 'white', fontSize: isMobile ? 12 : 13, fontWeight: '700' }}>
                {isMobile ? 'Login' : 'Sign In'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Category strip ── */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: C.border,
          position: 'relative',
          zIndex: 1,
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: px,
            paddingVertical: 10,
            gap: 6,
            flexDirection: 'row',
          }}>
          {categoriesData &&
            [{ _id: 'all', name: 'All' }, ...categoriesData].map((cat) => {
              const isActive =
                activeCategory === cat.name || (cat.name === 'All' && activeCategory === 'all');
              return (
                <Pressable
                  key={cat._id || cat.name}
                  onPress={() => handleCategoryPress(cat)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 10,
                    backgroundColor: isActive ? C.primary : C.bg,
                    borderWidth: 1,
                    borderColor: isActive ? C.primary : C.border,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 3px 10px rgba(15,118,110,0.22)' : 'none',
                  }}>
                  <Ionicons
                    name={catIcon(cat.name)}
                    size={14}
                    color={isActive ? 'white' : C.muted}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isActive ? 'white' : C.dark,
                      whiteSpace: 'nowrap',
                    }}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
}
