// app/product/[id].jsx
// Professional Product Detail Page — MediShield Dental
// Design: Clean editorial × medical-grade precision
// Inspired by: DentalKart, Cult.fit, Nykaa Pro

import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import API from '@/api/axios';
import WebHeader from 'components/Header/header.web';
import { useQuery } from '@tanstack/react-query';
import NoProdcucts from 'components/Section/NoProdcucts';
import GridSkeleton from 'components/Cards/GridSkeleton';
import WebProductCard from 'components/Cards/WebProductCard';
import SectionHeader from 'components/Section/SectionHeader';
import AddToCartButton from 'components/Cart/AddToCartButton';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  // Brand
  teal900: '#0f4f4f',
  teal800: '#0f5f5a',
  teal700: '#0f766e',
  teal600: '#0d9488',
  teal100: '#ccfbf1',
  teal50: '#f0fdfa',

  // Neutrals
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',

  // Accent
  amber500: '#f59e0b',
  amber100: '#fef3c7',
  amber50: '#fffbeb',

  // Semantic
  green500: '#22c55e',
  green100: '#dcfce7',
  red500: '#ef4444',
  red100: '#fee2e2',

  // Shadows
  shadowSm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 16px rgba(15,118,110,0.10)',
  shadowLg: '0 12px 40px rgba(15,118,110,0.14)',
  shadowXl: '0 20px 60px rgba(15,79,79,0.18)',
};

// ─────────────────────────────────────────────────────────────────────────────
// HTML UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const stripHtml = (html = '') =>
  html
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const parseListItems = (html = '') =>
  (html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [])
    .map((li) => stripHtml(li.replace(/<li[^>]*>/i, '').replace(/<\/li>/i, '')).trim())
    .filter(Boolean);

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Star rating
function Stars({ rating = 0, size = 13 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
          size={size}
          color={T.amber500}
        />
      ))}
    </View>
  );
}

// Quantity stepper
function Stepper({ value, onChange, max = 20 }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: T.slate200,
        overflow: 'hidden',
        backgroundColor: T.white,
      }}>
      <Pressable
        onPress={() => onChange(Math.max(1, value - 1))}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: T.slate50,
        }}>
        <Ionicons name="remove" size={18} color={value <= 1 ? T.slate400 : T.teal700} />
      </Pressable>
      <View style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: T.slate900 }}>{value}</Text>
      </View>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: T.slate50,
        }}>
        <Ionicons name="add" size={18} color={value >= max ? T.slate400 : T.teal700} />
      </Pressable>
    </View>
  );
}

// Pill / tag
function Pill({ label, color = T.teal700, bg = T.teal50, border = T.teal100 }) {
  return (
    <View
      style={{
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color, letterSpacing: 0.3 }}>{label}</Text>
    </View>
  );
}

// Section divider
function Divider({ mx = 0 }) {
  return (
    <View
      style={{ height: 1, backgroundColor: T.slate100, marginHorizontal: mx, marginVertical: 20 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function ImageGallery({ images, discount }) {
  const [active, setActive] = useState(0);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 1024;

  const imgSize = isDesktop ? Math.min(width * 0.38, 520) : width - 32;

  return (
    <View style={{ gap: 12 }}>
      {/* Main image */}
      <View
        style={{
          width: imgSize,
          height: imgSize,
          borderRadius: 20,
          backgroundColor: T.white,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: T.slate100,
          alignSelf: isDesktop ? 'flex-start' : 'center',
          ...(isWeb
            ? { boxShadow: T.shadowMd }
            : {
                shadowColor: T.teal900,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 4,
              }),
        }}>
        <Image
          source={{ uri: images[active] }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
        {/* Badges */}
        <View style={{ position: 'absolute', top: 12, left: 12, gap: 6 }}>
          {discount && (
            <View
              style={{
                backgroundColor: T.red500,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>
                {discount}% OFF
              </Text>
            </View>
          )}
        </View>
        {/* Zoom hint (web) */}
        {isWeb && (
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'rgba(255,255,255,0.85)',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
            <Ionicons name="expand-outline" size={13} color={T.slate500} />
            <Text style={{ fontSize: 11, color: T.slate500, fontWeight: '500' }}>Zoom</Text>
          </View>
        )}
      </View>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 2 }}>
          {images.map((img, i) => (
            <Pressable
              key={i}
              onPress={() => setActive(i)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: active === i ? T.teal700 : T.slate200,
                backgroundColor: T.white,
                overflow: 'hidden',
                ...(isWeb && active === i ? { boxShadow: `0 0 0 3px ${T.teal100}` } : {}),
              }}>
              <Image
                source={{ uri: img }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECS TABS
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'description', label: 'Overview', icon: 'document-text-outline' },
  { key: 'key_specs', label: 'Specifications', icon: 'list-outline' },
  { key: 'direction', label: 'How to Use', icon: 'flask-outline' },
  { key: 'features', label: 'Features', icon: 'sparkles-outline' },
  { key: 'packaging', label: 'Packaging', icon: 'cube-outline' },
];

function SpecContent({ html, isList }) {
  if (!html)
    return (
      <Text style={{ color: T.slate400, fontSize: 13, fontStyle: 'italic' }}>
        No information available.
      </Text>
    );
  if (isList) {
    const items = parseListItems(html);
    return (
      <View style={{ gap: 14 }}>
        {items.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: T.teal100,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
              <Ionicons name="checkmark" size={12} color={T.teal700} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: T.slate700, lineHeight: 22 }}>{item}</Text>
          </View>
        ))}
      </View>
    );
  }
  return <Text style={{ fontSize: 14, color: T.slate700, lineHeight: 24 }}>{stripHtml(html)}</Text>;
}

function SpecsTabs({ specs }) {
  const [active, setActive] = useState('description');
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        backgroundColor: T.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: T.slate100,
        overflow: 'hidden',
        ...(isWeb
          ? { boxShadow: T.shadowSm }
          : {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }),
      }}>
      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1, borderBottomColor: T.slate100 }}
        contentContainerStyle={{ paddingHorizontal: 4 }}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActive(tab.key)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 2.5,
              borderBottomColor: active === tab.key ? T.teal700 : 'transparent',
            }}>
            <Ionicons
              name={tab.icon}
              size={14}
              color={active === tab.key ? T.teal700 : T.slate400}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: active === tab.key ? '700' : '500',
                color: active === tab.key ? T.teal700 : T.slate500,
                whiteSpace: Platform.OS === 'web' ? 'nowrap' : undefined,
              }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={{ padding: 20 }}>
        {active === 'description' && <SpecContent html={specs.description} />}
        {active === 'key_specs' && <SpecContent html={specs.key_specifications} isList />}
        {active === 'direction' && <SpecContent html={specs.direction_to_use} isList />}
        {active === 'features' && <SpecContent html={specs.features} isList />}
        {active === 'packaging' && <SpecContent html={specs.packaging} isList />}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const initials = (review.reviewerName || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={{
        backgroundColor: T.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: T.slate100,
        ...(isWeb
          ? { boxShadow: T.shadowSm }
          : {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }),
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        {/* Avatar */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: T.teal700,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: T.slate800 }}>
            {review.reviewerName || 'Anonymous'}
          </Text>
          <Stars rating={review.rating} size={12} />
        </View>
        {review.date && (
          <Text style={{ fontSize: 11, color: T.slate400 }}>
            {new Date(review.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        )}
      </View>
      {review.comment && (
        <Text style={{ fontSize: 13, color: T.slate600, lineHeight: 20 }}>{review.comment}</Text>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST STRIP
// ─────────────────────────────────────────────────────────────────────────────
function TrustStrip() {
  const badges = [
    { icon: 'shield-checkmark', label: 'Genuine Product', sub: '100% authentic' },
    { icon: 'rocket', label: 'Fast Delivery', sub: '2–5 business days' },
    { icon: 'refresh-circle', label: 'Easy Returns', sub: '7 day return' },
    { icon: 'headset', label: '24/7 Support', sub: 'Always available' },
  ];
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: isMobile ? 0 : 0,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: T.slate100,
        backgroundColor: T.white,
      }}>
      {badges.map((b, i) => (
        <View
          key={b.label}
          style={{
            width: isMobile ? '50%' : '25%',
            padding: 14,
            alignItems: 'center',
            gap: 6,
            borderRightWidth: (isMobile ? i % 2 !== 1 : i < 3) ? 1 : 0,
            borderBottomWidth: isMobile && i < 2 ? 1 : 0,
            borderColor: T.slate100,
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: T.teal50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name={`${b.icon}-outline`} size={20} color={T.teal700} />
          </View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: T.slate800, textAlign: 'center' }}>
            {b.label}
          </Text>
          <Text style={{ fontSize: 11, color: T.slate400, textAlign: 'center' }}>{b.sub}</Text>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedCart, setAddedCart] = useState(false);

  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 1024;
  const isMobile = width < 640;
  const px = isDesktop ? 48 : isMobile ? 16 : 24;

  // Scroll-based sticky header
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    API.get(`/product/getproductwithid/${id}`)
      .then((res) => setProduct(res.data.findProduct))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // categoryProducts();
  }, [id]);

  // async function categoryProducts(){
  //   let { data } = await API.get('/product', { params: { category: product.category } })
  //   console.log('category product',data);

  // }

  async function fetchProducts() {
    try {
      const res = await API.get('/product', { params: { featured: true } });
      // setProducts(res.data.data || []);
      return res.data.data || [];
    } catch (e) {
      console.error('Products error:', e);
    } finally {
      // setLoadingP(false);
    }
  }

  let { data: products, isLoading: loadingP } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const handleAddCart = () => {
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
    // TODO: actual cart API call
  };

  // ── Loading ──
  if (loading)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: T.slate50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ gap: 16, alignItems: 'center' }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: T.teal100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={T.teal700} />
          </View>
          <Text style={{ color: T.slate500, fontSize: 14, fontWeight: '500' }}>
            Loading product...
          </Text>
        </View>
      </SafeAreaView>
    );

  if (!product)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: T.slate50,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}>
        <Ionicons name="alert-circle-outline" size={52} color={T.slate300} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: T.slate700,
            marginTop: 16,
            marginBottom: 8,
          }}>
          Product not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: T.teal700,
            borderRadius: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );

  const images = product.media_gallery_entries?.length
    ? product.media_gallery_entries.map((e) => e.file)
    : [product.thumbnail_url];

  const discount =
    product.price.minimalPrice < product.price.regularPrice
      ? Math.round((1 - product.price.minimalPrice / product.price.regularPrice) * 100)
      : null;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + (r.rating || 0), 0) / product.reviews.length
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.slate50 }}>
      {/* ── Web Header ── */}
      {isWeb && <WebHeader />}

      {/* ── Mobile top bar ── */}
      {!isWeb && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: T.white,
            borderBottomWidth: 1,
            borderBottomColor: T.slate100,
            gap: 10,
          }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: T.slate50,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: T.slate200,
            }}>
            <Ionicons name="arrow-back" size={20} color={T.slate700} />
          </Pressable>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: 15, fontWeight: '700', color: T.slate900 }}>
            {product.name}
          </Text>
          <Pressable
            onPress={() => setWishlisted((w) => !w)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: wishlisted ? '#fef2f2' : T.slate50,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: wishlisted ? '#fecaca' : T.slate200,
            }}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={19}
              color={wishlisted ? T.red500 : T.slate500}
            />
          </Pressable>
          <Pressable
            onPress={() => router.push('/cart')}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: T.teal700,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="bag-outline" size={18} color="white" />
          </Pressable>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isDesktop ? 60 : 100 }}>
        {/* ── Breadcrumb (web) ── */}
        {isWeb && (
          <View
            style={{
              paddingHorizontal: px,
              paddingTop: 16,
              paddingBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
            {['Home', 'Products', product.categories?.[0]?.name || 'Dental'].map(
              (crumb, i, arr) => (
                <View key={crumb} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Pressable onPress={() => i === 0 && router.push('/')}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: i === arr.length - 1 ? T.slate500 : T.teal700,
                        fontWeight: i === arr.length - 1 ? '500' : '600',
                      }}>
                      {crumb}
                    </Text>
                  </Pressable>
                  {i < arr.length - 1 && (
                    <Ionicons name="chevron-forward" size={12} color={T.slate400} />
                  )}
                </View>
              )
            )}
            <Ionicons name="chevron-forward" size={12} color={T.slate400} />
            <Text numberOfLines={1} style={{ fontSize: 12, color: T.slate400, flex: 1 }}>
              {product.name}
            </Text>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════
            MAIN PRODUCT SECTION
            ══════════════════════════════════════════════════════ */}
        <View
          style={{
            paddingHorizontal: px,
            paddingTop: isMobile ? 16 : 20,
            flexDirection: isDesktop ? 'row' : 'column',
            gap: isDesktop ? 48 : 0,
            alignItems: isDesktop ? 'flex-start' : undefined,
          }}>
          {/* ── LEFT: Image gallery ── */}
          <View style={{ width: isDesktop ? '42%' : '100%' }}>
            <ImageGallery images={images} discount={discount} />

            {/* Share + Compare (web) */}
            {isWeb && (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                {[
                  { icon: 'share-social-outline', label: 'Share' },
                  { icon: 'git-compare-outline', label: 'Compare' },
                ].map((a) => (
                  <Pressable
                    key={a.label}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 9,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: T.slate200,
                      backgroundColor: T.white,
                      ...(isWeb ? { cursor: 'pointer' } : {}),
                    }}>
                    <Ionicons name={a.icon} size={16} color={T.slate500} />
                    <Text style={{ fontSize: 13, color: T.slate600, fontWeight: '500' }}>
                      {a.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* ── RIGHT: Product info ── */}
          <View
            style={{
              flex: isDesktop ? 1 : undefined,
              width: isDesktop ? undefined : '100%',
              marginTop: isDesktop ? 0 : 20,
              gap: 0,
            }}>
            {/* Tags row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                flexWrap: 'wrap',
              }}>
              <Pill label={product.manufacturer || 'MediShield'} />
              {product.featured && (
                <Pill label="★ Featured" color={T.amber500} bg={T.amber50} border={T.amber100} />
              )}
              {product.published && (
                <Pill label="In Stock" color="#15803d" bg="#f0fdf4" border="#bbf7d0" />
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: T.slate400,
                  marginLeft: 'auto',
                  fontFamily: 'monospace',
                }}>
                SKU: {product.sku}
              </Text>
            </View>

            {/* Product name */}
            <Text
              style={{
                fontSize: isDesktop ? 26 : 20,
                fontWeight: '500',
                color: T.slate900,
                lineHeight: isDesktop ? 34 : 28,
                letterSpacing: -0.4,
                marginBottom: 10,
              }}>
              {product.name}
            </Text>

            {/* Short description */}
            {product.short_description && (
              <Text style={{ fontSize: 14, color: T.slate500, lineHeight: 22, marginBottom: 14 }}>
                {product.short_description}
              </Text>
            )}

            {/* Rating row */}
            {product.reviews?.length > 0 && (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Stars rating={avgRating} size={14} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.slate800 }}>
                  {avgRating.toFixed(1)}
                </Text>
                <Text style={{ fontSize: 13, color: T.slate400 }}>
                  ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                </Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: T.slate200,
                    marginHorizontal: 2,
                  }}
                />
                <Text style={{ fontSize: 13, color: T.teal700, fontWeight: '600' }}>Verified</Text>
              </View>
            )}

            {/* ── Price card ── */}
            <View
              style={{
                backgroundColor: T.white,
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: T.slate100,
                padding: 16,
                marginBottom: 20,
                ...(isWeb ? { boxShadow: T.shadowSm } : {}),
              }}>
              {/* Price row */}
              <View
                style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 4 }}>
                <Text
                  style={{
                    fontSize: isDesktop ? 32 : 28,
                    fontWeight: '600',
                    color: T.teal700,
                    letterSpacing: -0.5,
                  }}>
                  ₹{product.price.minimalPrice.toLocaleString('en-IN')}
                </Text>
                {discount && (
                  <Text
                    style={{
                      fontSize: 16,
                      color: T.slate400,
                      textDecorationLine: 'line-through',
                      marginBottom: 4,
                    }}>
                    ₹{product.price.regularPrice.toLocaleString('en-IN')}
                  </Text>
                )}
                {discount && (
                  <View
                    style={{
                      backgroundColor: T.red100,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      marginBottom: 4,
                    }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: T.red500 }}>
                      Save {discount}%
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 12, color: T.slate400, marginBottom: 12 }}>
                Inclusive of all taxes · Free shipping on orders ₹999+
              </Text>

              {/* Coins */}
              {product.medishield_coins > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: T.amber50,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    borderWidth: 1,
                    borderColor: T.amber100,
                  }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: T.amber100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="logo-bitcoin" size={15} color={T.amber500} />
                  </View>
                  <Text style={{ fontSize: 13, color: '#92400e', fontWeight: '600', flex: 1 }}>
                    Earn{' '}
                    <Text style={{ fontWeight: '800' }}>
                      {product.medishield_coins} MediShield Coin
                      {product.medishield_coins > 1 ? 's' : ''}
                    </Text>{' '}
                    on this purchase
                  </Text>
                </View>
              )}
            </View>

            {/* ── Qty + CTA ── */}
            <View style={{ gap: 12, marginBottom: 20 }}>
              {/* Qty row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: T.slate600 }}>Qty:</Text>
                <Stepper value={qty} onChange={setQty} max={product.max_sale_qty || 20} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginLeft: 'auto',
                  }}>
                  <View
                    style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.green500 }}
                  />
                  <Text style={{ fontSize: 13, color: T.green500, fontWeight: '600' }}>
                    In Stock
                  </Text>
                </View>
              </View>

              {/* CTA buttons */}
              {isDesktop ? (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  
                  <AddToCartButton
                      productId={product._id}
                      variant={product._id} // use _id as variant if product has no variants
                      price={product.price.regularPrice}
                      size="xxl"
                      style="outline"
                    />
                  <Pressable
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      paddingVertical: 15,
                      borderRadius: 14,
                      backgroundColor: T.amber500,
                      ...(isWeb
                        ? { boxShadow: '0 6px 20px rgba(245,158,11,0.3)', cursor: 'pointer' }
                        : {}),
                    }}>
                    <Ionicons name="flash-outline" size={20} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Buy Now</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setWishlisted((w) => !w)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      backgroundColor: wishlisted ? '#fef2f2' : T.slate50,
                      borderWidth: 1,
                      borderColor: wishlisted ? '#fecaca' : T.slate200,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(isWeb ? { cursor: 'pointer' } : {}),
                    }}>
                    <Ionicons
                      name={wishlisted ? 'heart' : 'heart-outline'}
                      size={22}
                      color={wishlisted ? T.red500 : T.slate400}
                    />
                  </Pressable>
                </View>
              ) : null}
            </View>

            {/* Trust strip */}
            <TrustStrip />
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════
            SPECS + REVIEWS SECTION
            ══════════════════════════════════════════════════════ */}
        <View
          style={{
            paddingHorizontal: px,
            marginTop: 32,
            flexDirection: isDesktop ? 'row' : 'column',
            gap: isDesktop ? 32 : 24,
            alignItems: 'flex-start',
          }}>
          {/* Main column */}
          <View style={{ flex: isDesktop ? 1 : undefined, width: '100%', gap: 24 }}>
            {/* Specs tabs */}
            <SpecsTabs specs={product.product_specs} />
            {/* Products */}
            <SectionHeader title="Related Products" />
            {loadingP ? (
              <GridSkeleton cols={2} />
            ) : products.length === 0 ? (
              <NoProdcucts />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  overflow: 'auto',
                  scrollBehavior: 'smooth',
                  gap: 16,
                }}>
                {products.map((item) => (
                  <WebProductCard
                    key={item._id}
                    item={item}
                    cols={isDesktop ? 3 : 1}
                    onBuy={(id) => router.navigate(`/product/${id}`)}
                    onCart={(item) => console.log('Add to cart', item._id)}
                  />
                ))}
              </View>
            )}

            {/* Reviews */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: T.slate900 }}>
                  Customer Reviews
                </Text>
                {product.reviews.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: T.teal50,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderWidth: 1,
                      borderColor: T.teal100,
                    }}>
                    <Ionicons name="star" size={14} color={T.amber500} />
                    <Text style={{ fontSize: 14, fontWeight: '800', color: T.teal700 }}>
                      {avgRating.toFixed(1)}
                    </Text>
                    <Text style={{ fontSize: 12, color: T.slate400 }}>/ 5</Text>
                  </View>
                )}
              </View>

              {product.reviews.length === 0 ? (
                <View
                  style={{
                    backgroundColor: T.white,
                    borderRadius: 16,
                    padding: 40,
                    alignItems: 'center',
                    gap: 10,
                    borderWidth: 1,
                    borderColor: T.slate100,
                  }}>
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: T.teal50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={T.teal700} />
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: T.slate700 }}>
                    No reviews yet
                  </Text>
                  <Text style={{ fontSize: 13, color: T.slate400, textAlign: 'center' }}>
                    Be the first to share your experience
                  </Text>
                  <Pressable
                    style={{
                      marginTop: 8,
                      backgroundColor: T.teal700,
                      borderRadius: 12,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
                      Write a Review
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ gap: 12 }}>
                  {product.reviews.map((r, i) => (
                    <ReviewCard key={i} review={r} />
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Sidebar (desktop): sticky buy box */}
          {isDesktop && (
            <View
              style={{
                width: 300,
                gap: 16,
                position: 'sticky',
                top: 90,
              }}>
              {/* Quick buy card */}
              <View
                style={{
                  backgroundColor: T.white,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: T.slate100,
                  overflow: 'hidden',
                  ...(isWeb ? { boxShadow: T.shadowMd } : {}),
                }}>
                <View style={{ padding: 20 }}>
                  <Image
                    source={{ uri: images[0] }}
                    style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 12,
                      backgroundColor: T.slate50,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: T.slate900,
                      marginTop: 12,
                      lineHeight: 20,
                    }}>
                    {product.name}
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: T.teal700, marginTop: 8 }}>
                    ₹{product.price.regularPrice.toLocaleString('en-IN')}
                  </Text>
                  {discount && (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: T.slate400,
                          textDecorationLine: 'line-through',
                        }}>
                        ₹{product.price.maximalPrice.toLocaleString('en-IN')}
                      </Text>
                      <Text style={{ fontSize: 12, color: T.red500, fontWeight: '700' }}>
                        {discount}% off
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
                  <Pressable
                    onPress={handleAddCart}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      paddingVertical: 13,
                      borderRadius: 12,
                      backgroundColor: addedCart ? T.green500 : T.teal700,
                      ...(isWeb
                        ? { boxShadow: '0 4px 14px rgba(15,118,110,0.25)', cursor: 'pointer' }
                        : {}),
                    }}>
                    <Ionicons
                      name={addedCart ? 'checkmark-circle' : 'bag-add-outline'}
                      size={18}
                      color="#fff"
                    />
                    {/* <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>
                      {addedCart ? 'Added to Cart!' : 'Add to Cart'}
                    </Text> */}
                    <AddToCartButton
                      productId={product._id}
                      variant={product._id} // use _id as variant if product has no variants
                      price={product.price.regularPrice}
                      size="sm"
                      style="solid"
                    />
                  </Pressable>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      paddingVertical: 13,
                      borderRadius: 12,
                      backgroundColor: T.amber500,
                      ...(isWeb
                        ? { boxShadow: '0 4px 14px rgba(245,158,11,0.25)', cursor: 'pointer' }
                        : {}),
                    }}>
                    <Ionicons name="flash-outline" size={18} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>Buy Now</Text>
                  </Pressable>
                </View>

                {/* Delivery info */}
                <View
                  style={{ borderTopWidth: 1, borderTopColor: T.slate100, padding: 16, gap: 10 }}>
                  {[
                    { icon: 'location-outline', text: 'Deliver to — Enter pincode' },
                    { icon: 'time-outline', text: 'Delivery in 2–5 business days' },
                    { icon: 'refresh-outline', text: '7 day easy returns' },
                  ].map((item) => (
                    <View
                      key={item.text}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons name={item.icon} size={15} color={T.teal700} />
                      <Text style={{ fontSize: 12, color: T.slate600, flex: 1 }}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Secure payment */}
              <View
                style={{
                  backgroundColor: T.white,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: T.slate100,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Ionicons name="shield-checkmark-outline" size={20} color={T.teal700} />
                <Text style={{ fontSize: 12, color: T.slate600, flex: 1, lineHeight: 18 }}>
                  <Text style={{ fontWeight: '700', color: T.slate800 }}>Secure payments</Text> via
                  Razorpay · UPI, Cards, NetBanking accepted
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Mobile sticky bottom bar ── */}
      {!isDesktop && (
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            backgroundColor: T.white,
            paddingHorizontal: 16,
            paddingVertical: 10,
            paddingBottom: 12,
            borderTopWidth: 1,
            borderTopColor: T.slate100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 10,
          }}>
          <Pressable
            onPress={() => setWishlisted((w) => !w)}
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: wishlisted ? '#fef2f2' : T.slate50,
              borderWidth: 1,
              borderColor: wishlisted ? '#fecaca' : T.slate200,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={wishlisted ? T.red500 : T.slate500}
            />
          </Pressable>
{/* 
          <Pressable
            onPress={handleAddCart}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 12,
              backgroundColor: addedCart ? T.green500 : T.teal700,
              shadowColor: T.teal700,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 5,
            }}>
            <Ionicons
              name={addedCart ? 'checkmark-circle' : 'bag-add-outline'}
              size={18}
              color="#fff"
            />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>
              {addedCart ? 'Added!' : 'Add to Cart'}
            </Text>
          </Pressable> */}
          <AddToCartButton
            productId={product._id}
            variant={product._id} // use _id as variant if product has no variants
            price={product.price.regularPrice}
            size="6xl"
            style="solid"
          />

          <Pressable
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 12,
              backgroundColor: T.amber500,
              shadowColor: T.amber500,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 5,
            }}>
            <Ionicons name="flash-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>Buy Now</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
