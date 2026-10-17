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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import API from '@/api/axios';
import WebHeader from 'components/Header/header.web';
import { useQuery } from '@tanstack/react-query';
import NoProdcucts from 'components/Section/NoProdcucts';
import GridSkeleton from 'components/Cards/GridSkeleton';
import WebProductCard from 'components/Cards/WebProductCard';
import SectionHeader from 'components/Section/SectionHeader';
import AddToCartButton from 'components/Cart/AddToCartButton';
import { useAuth } from '@/context/AuthContext';

/* =========================================================
   DESIGN TOKENS
   ========================================================= */

const T = {
  // Brand
  teal900: '#CD0F0F',
  teal800: '#0f5f5a',
  teal700: '#CD0F0F',
  teal600: '#0d9488',
  teal100: '#ccfbf1',
  teal50: '#f0fdfa',

  // Neutrals
  slate900: '#102326',
  slate800: '#18282c',
  slate700: '#26383c',
  slate500: '#5f6d71',
  slate400: '#89979b',
  slate200: '#d9e1e3',
  slate100: '#edf1f2',
  slate50: '#ffffff',
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

  // Very subtle shadows
  shadowSm: '0 1px 8px rgba(16,35,38,0.045)',
  shadowMd: '0 4px 20px rgba(16,35,38,0.06)',
  shadowLg: '0 12px 40px rgba(16,35,38,0.08)',
};

/* =========================================================
   HTML UTILITIES
   ========================================================= */

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

/* =========================================================
   STAR RATING
   ========================================================= */

function Stars({ rating = 0, size = 13 }) {
  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
      }}>
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

/* =========================================================
   QUANTITY STEPPER
   ========================================================= */

function Stepper({ value, onChange, max = 20 }) {
  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: T.slate200,
        overflow: 'hidden',
        backgroundColor: T.white,
      }}>
      <Pressable
        onPress={() => onChange(Math.max(1, value - 1))}
        style={{
          fontFamily: 'Poppins_400Regular',
          width: 40,
          height: 42,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafcfc',
        }}>
        <Ionicons name="remove" size={17} color={value <= 1 ? T.slate400 : T.teal700} />
      </Pressable>

      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          width: 42,
          height: 42,
          alignItems: 'center',
          justifyContent: 'center',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: T.slate100,
        }}>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            fontWeight: '700',
            color: T.slate900,
          }}>
          {value}
        </Text>
      </View>

      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={{
          fontFamily: 'Poppins_400Regular',
          width: 40,
          height: 42,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafcfc',
        }}>
        <Ionicons name="add" size={17} color={value >= max ? T.slate400 : T.teal700} />
      </Pressable>
    </View>
  );
}

/* =========================================================
   CLEAN PRODUCT PILL
   ========================================================= */

function Pill({ label, color = T.teal700, bg = T.teal50, border = T.teal100 }) {
  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}>
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 10,
          fontWeight: '700',
          color,
          letterSpacing: 0.25,
        }}>
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   IMAGE GALLERY
   ========================================================= */

function ImageGallery({ images, discount }) {
  const [active, setActive] = useState(0);

  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 1024;

  const imgSize = isDesktop ? Math.min(width * 0.4, 520) : width - 32;

  return (
    <View style={{ fontFamily: 'Poppins_400Regular', width: '100%' }}>
      {/* MAIN IMAGE */}

      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          width: imgSize,
          height: imgSize,
          borderRadius: 10,
          backgroundColor: '#fbfcfc',
          overflow: 'hidden',
          alignSelf: isDesktop ? 'flex-start' : 'center',

          ...(isWeb
            ? {}
            : {
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.025,
                shadowRadius: 5,
                elevation: 1,
              }),
        }}>
        <Image
          source={
            !images?.[active]
              ? require('../../assets/Image-not-found.png')
              : images[active].startsWith('/')
                ? {
                    uri: `https://images1.dentalkart.com/media/catalog/product${images[active]}`,
                  }
                : {
                    uri: images[active],
                  }
          }
          style={{ fontFamily: 'Poppins_400Regular', width: '100%', height: '100%' }}
          resizeMode="contain"
        />

        {/* DISCOUNT */}

        {discount && (
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              position: 'absolute',
              top: 14,
              left: 14,
              backgroundColor: T.red500,
              borderRadius: 5,
              paddingHorizontal: 9,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                color: '#fff',
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 0.2,
              }}>
              {discount}% OFF
            </Text>
          </View>
        )}

        {/* ZOOM */}

        {isWeb && (
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              position: 'absolute',
              bottom: 14,
              right: 14,
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderRadius: 5,
              paddingHorizontal: 9,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <Ionicons name="expand-outline" size={13} color={T.slate500} />

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 10,
                color: T.slate500,
                fontWeight: '600',
              }}>
              Zoom
            </Text>
          </View>
        )}
      </View>

      {/* THUMBNAILS */}

      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 9,
            paddingTop: 14,
            paddingBottom: 2,
          }}>
          {images.map((img, i) => (
            <Pressable
              key={i}
              onPress={() => setActive(i)}
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 68,
                height: 68,
                borderRadius: 6,
                borderWidth: active === i ? 2 : 1,
                borderColor: active === i ? T.teal700 : T.slate200,
                backgroundColor: T.white,
                overflow: 'hidden',
              }}>
              <Image
                source={
                  !img
                    ? require('../../assets/Image-not-found.png')
                    : img.startsWith('/')
                      ? {
                          uri: `https://images1.dentalkart.com/media/catalog/product${img}`,
                        }
                      : {
                          uri: img,
                        }
                }
                style={{ fontFamily: 'Poppins_400Regular', width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/* =========================================================
   PRODUCT INFORMATION TABS
   ========================================================= */

const TABS = [
  {
    key: 'description',
    label: 'Overview',
    icon: 'document-text-outline',
  },
  {
    key: 'key_specs',
    label: 'Specifications',
    icon: 'list-outline',
  },
  {
    key: 'direction',
    label: 'How to Use',
    icon: 'flask-outline',
  },
  {
    key: 'features',
    label: 'Features',
    icon: 'sparkles-outline',
  },
  {
    key: 'packaging',
    label: 'Packaging',
    icon: 'cube-outline',
  },
];

function SpecContent({ html, isList }) {
  if (!html) {
    return (
      <Text
        style={{
          fontFamily: 'Poppins_400Regular',
          color: T.slate400,
          fontSize: 13,
          fontStyle: 'italic',
        }}>
        No information available.
      </Text>
    );
  }

  if (isList) {
    const items = parseListItems(html);

    return (
      <View style={{ fontFamily: 'Poppins_400Regular', gap: 15 }}>
        {items.map((item, i) => (
          <View
            key={i}
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              gap: 11,
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: T.teal50,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
              <Ionicons name="checkmark" size={12} color={T.teal700} />
            </View>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                flex: 1,
                fontSize: 16,
                color: T.slate700,
                lineHeight: 22,
              }}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <Text
      style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: T.slate700, lineHeight: 24 }}>
      {stripHtml(html)}
    </Text>
  );
}

/* =========================================================
   SPECS TABS
   ========================================================= */

function SpecsTabs({ specs }) {
  const [active, setActive] = useState('description');

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        backgroundColor: T.white,
        borderRadius: 0,
        overflow: 'hidden',
      }}>
      {/* TAB HEADER */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          fontFamily: 'Poppins_400Regular',
          borderBottomWidth: 1,
          borderBottomColor: T.slate100,
        }}
        contentContainerStyle={{
          gap: 2,
        }}>
        {TABS.map((tab) => {
          const isActive = active === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActive(tab.key)}
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? T.teal700 : 'transparent',
              }}>
              <Ionicons name={tab.icon} size={14} color={isActive ? T.teal700 : T.slate400} />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 17,
                  fontWeight: isActive ? '500' : '500',
                  color: isActive ? T.teal700 : T.slate500,
                  whiteSpace: Platform.OS === 'web' ? 'nowrap' : undefined,
                }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* CONTENT */}

      <View style={{ fontFamily: 'Poppins_400Regular', paddingTop: 22, paddingBottom: 8 }}>
        {active === 'description' && <SpecContent html={specs.description} />}

        {active === 'key_specs' && <SpecContent html={specs.key_specifications} isList />}

        {active === 'direction' && <SpecContent html={specs.direction_to_use} isList />}

        {active === 'features' && <SpecContent html={specs.features} isList />}

        {active === 'packaging' && <SpecContent html={specs.packaging} isList />}
      </View>
    </View>
  );
}

/* =========================================================
   REVIEW
   ========================================================= */

function ReviewCard({ review }) {
  const initials = (review.reviewerName || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        backgroundColor: T.white,
        borderRadius: 0,
        paddingVertical: 18,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderColor: T.slate100,
      }}>
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
          marginBottom: 10,
        }}>
        {/* AVATAR */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: T.teal700,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              color: '#fff',
              fontSize: 12,
              fontWeight: '800',
            }}>
            {initials}
          </Text>
        </View>

        {/* USER */}

        <View style={{ fontFamily: 'Poppins_400Regular', flex: 1 }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              fontWeight: '700',
              color: T.slate800,
              marginBottom: 3,
            }}>
            {review.reviewerName || 'Anonymous'}
          </Text>

          <Stars rating={review.rating} size={11} />
        </View>

        {review.date && (
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: T.slate400 }}>
            {new Date(review.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        )}
      </View>

      {review.comment && (
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            color: T.slate500,
            lineHeight: 21,
            paddingLeft: 49,
          }}>
          {review.comment}
        </Text>
      )}
    </View>
  );
}

/* =========================================================
   TRUST STRIP
   ========================================================= */

function TrustStrip() {
  const badges = [
    {
      icon: 'shield-checkmark',
      label: 'Genuine Product',
      sub: '100% authentic',
    },
    {
      icon: 'rocket',
      label: 'Fast Delivery',
      sub: '2–5 business days',
    },
    {
      icon: 'refresh-circle',
      label: 'Easy Returns',
      sub: '7 day return',
    },
    {
      icon: 'headset',
      label: '24/7 Support',
      sub: 'Always available',
    },
  ];

  const { width } = useWindowDimensions();

  const isMobile = width < 640;

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: T.slate100,
        backgroundColor: T.white,
        paddingVertical: 16,
      }}>
      {badges.map((b, i) => (
        <View
          key={b.label}
          style={{
            fontFamily: 'Poppins_400Regular',
            width: isMobile ? '50%' : '25%',
            paddingVertical: 15,
            paddingHorizontal: 8,
            alignItems: 'center',
            gap: 6,
            borderRightWidth: isMobile ? (i % 2 !== 1 ? 1 : 0) : i < 3 ? 1 : 0,
            borderBottomWidth: isMobile && i < 2 ? 1 : 0,
            borderColor: T.slate100,
          }}>
          <Ionicons name={`${b.icon}-outline`} size={26} color={T.teal700} />

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              fontWeight: '700',
              color: T.slate800,
              textAlign: 'center',
            }}>
            {b.label}
          </Text>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              color: T.slate400,
              textAlign: 'center',
            }}>
            {b.sub}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* =========================================================
   MAIN PRODUCT PAGE
   ========================================================= */

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const { width } = useWindowDimensions();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  // const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addedCart, setAddedCart] = useState(false);

  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 1024;
  const isMobile = width < 640;

  const px = isDesktop ? 56 : isMobile ? 16 : 24;

  const scrollY = useRef(new Animated.Value(0)).current;

  const hasVariants = product?.childProducts?.length > 0;

  const [selectedVariant, setSelectedVariant] = useState(null);

  /*
   * IMPORTANT:
   * Existing variant / stock / SKU / price logic
   * remains exactly the same.
   */

  const activeStock = hasVariants
    ? Number(selectedVariant?.max_sale_qty ?? 0)
    : Number(product?.max_sale_qty ?? 0);

  const activeSku = hasVariants ? selectedVariant?.sku || product?.sku : product?.sku;

  const activePrice = hasVariants
    ? Number(
        selectedVariant?.price?.minimalPrice?.amount?.value ?? product?.price?.minimalPrice ?? 0
      )
    : Number(product?.price?.minimalPrice ?? 0);

  const variantRegularPrice = hasVariants
    ? Number(selectedVariant?.price?.regularPrice?.amount?.value ?? 0)
    : Number(product?.price?.regularPrice ?? 0);

  const activeRegularPrice =
    variantRegularPrice > activePrice
      ? variantRegularPrice
      : Number(product?.price?.regularPrice ?? 0) > activePrice
        ? Number(product?.price?.regularPrice)
        : null;

  const activeDiscount =
    activeRegularPrice && activeRegularPrice > activePrice
      ? Math.round((1 - activePrice / activeRegularPrice) * 100)
      : null;

  useEffect(() => {
    API.get(`/product/getproductwithid/${id}`)
      .then((res) => {
        const data = res.data.findProduct;

        setProduct(data);

        if (data.childProducts?.length > 0) {
          setSelectedVariant(data.childProducts[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
  };

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
        prodId: product._id,
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

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <SafeAreaView
        style={{
          fontFamily: 'Poppins_400Regular',
          flex: 1,
          backgroundColor: T.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{ fontFamily: 'Poppins_400Regular', alignItems: 'center', gap: 14 }}>
          <ActivityIndicator size="large" color={T.teal700} />

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              color: T.slate500,
              fontSize: 13,
              fontWeight: '500',
            }}>
            Loading product...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =====================================================
     PRODUCT NOT FOUND
     ===================================================== */

  if (!product) {
    return (
      <SafeAreaView
        style={{
          fontFamily: 'Poppins_400Regular',
          flex: 1,
          backgroundColor: T.white,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}>
        <Ionicons name="alert-circle-outline" size={48} color={T.slate400} />

        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 20,
            fontWeight: '800',
            color: T.slate700,
            marginTop: 14,
            marginBottom: 8,
          }}>
          Product not found
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{
            fontFamily: 'Poppins_400Regular',
            backgroundColor: T.teal700,
            borderRadius: 7,
            paddingHorizontal: 22,
            paddingVertical: 11,
          }}>
          <Text style={{ fontFamily: 'Poppins_400Regular', color: '#fff', fontWeight: '700' }}>
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const images = product.media_gallery_entries?.length
    ? product.media_gallery_entries.map((e) => e.file)
    : [product.thumbnail_url];

  const discount = activeDiscount;
  const price = activePrice;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + (r.rating || 0), 0) / product.reviews.length
    : 0;

  return (
    <SafeAreaView style={{ fontFamily: 'Poppins_400Regular', flex: 1, backgroundColor: T.white }}>
      {/* =====================================================
          WEB HEADER
         ===================================================== */}

      {isWeb && <WebHeader />}

      {/* =====================================================
          MOBILE TOP BAR
         ===================================================== */}

      {!isWeb && (
        <View
          style={{
            fontFamily: 'Poppins_400Regular',
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
              fontFamily: 'Poppins_400Regular',
              width: 38,
              height: 38,
              borderRadius: 7,
              backgroundColor: T.white,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: T.slate200,
            }}>
            <Ionicons name="arrow-back" size={20} color={T.slate700} />
          </Pressable>

          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Poppins_400Regular',
              flex: 1,
              fontSize: 15,
              fontWeight: '700',
              color: T.slate900,
            }}>
            {product.name}
          </Text>

          <Pressable
            onPress={handleWishlist}
            style={{
              fontFamily: 'Poppins_400Regular',
              width: 38,
              height: 38,
              borderRadius: 7,
              backgroundColor: wishlisted ? '#fff5f5' : T.white,
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
              fontFamily: 'Poppins_400Regular',
              width: 38,
              height: 38,
              borderRadius: 7,
              backgroundColor: T.teal700,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="bag-outline" size={18} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* =====================================================
          PAGE SCROLL
         ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isDesktop ? 60 : 105,
        }}>
        {/* ===================================================
            BREADCRUMB
           =================================================== */}

        {isWeb && (
          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              paddingHorizontal: px,
              paddingTop: 18,
              paddingBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
            {['Home', 'Products', product.categories?.[0]?.name || 'Dental'].map(
              (crumb, i, arr) => (
                <View
                  key={`${crumb}-${i}`}
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <Pressable onPress={() => i === 0 && router.push('/')}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 12,
                        color: i === arr.length - 1 ? T.slate500 : T.teal700,
                        fontWeight: i === arr.length - 1 ? '500' : '600',
                      }}>
                      {crumb}
                    </Text>
                  </Pressable>

                  {i < arr.length - 1 && (
                    <Ionicons name="chevron-forward" size={11} color={T.slate400} />
                  )}
                </View>
              )
            )}

            <Ionicons name="chevron-forward" size={11} color={T.slate400} />

            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: T.slate400,
                flex: 1,
              }}>
              {product.name}
            </Text>
          </View>
        )}

        {/* ===================================================
            MAIN PRODUCT SECTION
           =================================================== */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            paddingHorizontal: px,
            paddingTop: isMobile ? 12 : 18,

            flexDirection: isDesktop ? 'row' : 'column',

            gap: isDesktop ? 64 : 0,

            alignItems: isDesktop ? 'flex-start' : undefined,
          }}>
          {/* =================================================
              LEFT — PRODUCT IMAGE
             ================================================= */}

          <View style={{ fontFamily: 'Poppins_400Regular', width: isDesktop ? '46%' : '100%' }}>
            <ImageGallery images={images} discount={discount} />

            {/* SHARE / COMPARE */}

            {/* {isWeb && (
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',
                  gap: 22,
                  marginTop: 14,
                  paddingBottom: 4,
                }}>
                <Pressable
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <Ionicons name="share-social-outline" size={16} color={T.slate500} />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: 12,
                      color: T.slate500,
                      fontWeight: '600',
                    }}>
                    Share
                  </Text>
                </Pressable>

                <Pressable
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <Ionicons name="git-compare-outline" size={16} color={T.slate500} />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: 12,
                      color: T.slate500,
                      fontWeight: '600',
                    }}>
                    Compare
                  </Text>
                </Pressable>
              </View>
            )} */}
          </View>

          {/* =================================================
              RIGHT — PRODUCT INFORMATION
             ================================================= */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flex: isDesktop ? 1 : undefined,

              width: isDesktop ? undefined : '100%',

              marginTop: isDesktop ? 0 : 22,
            }}>
            {/* ===============================================
                BRAND / STOCK / SKU
               =============================================== */}

            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                marginBottom: 11,
                flexWrap: 'wrap',
              }}>
              <Pill label={product.manufacturer || 'MediShield'} />

              {product.featured && (
                <Pill label="★ Featured" color={T.amber500} bg={T.amber50} border={T.amber100} />
              )}

              {activeStock > 0 ? (
                <Pill
                  label={`In Stock · ${activeStock}`}
                  color="#15803d"
                  bg="#f0fdf4"
                  border="#bbf7d0"
                />
              ) : (
                <Pill label="Out of Stock" color={T.red500} bg={T.red100} border="#fecaca" />
              )}

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 11,
                  color: T.slate400,
                  marginLeft: isMobile ? 0 : 'auto',
                  fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
                }}>
                SKU: {activeSku}
              </Text>
            </View>

            {/* ===============================================
                PRODUCT TITLE
               =============================================== */}

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: isDesktop ? 30 : 22,

                fontWeight: '700',

                color: T.slate900,

                lineHeight: isDesktop ? 38 : 30,

                letterSpacing: -0.45,

                marginBottom: 9,
              }}>
              {product.name}
            </Text>

            {/* ===============================================
                SHORT DESCRIPTION
               =============================================== */}

            {product.short_description && (
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 14,
                  color: T.slate500,
                  lineHeight: 22,
                  marginBottom: 13,
                  maxWidth: isDesktop ? 700 : undefined,
                }}>
                {product.short_description}
              </Text>
            )}

            {/* ===============================================
                RATING
               =============================================== */}

            {product.reviews?.length > 0 && (
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 16,
                }}>
                <Stars rating={avgRating} size={14} />

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 13,
                    fontWeight: '700',
                    color: T.slate800,
                  }}>
                  {avgRating.toFixed(1)}
                </Text>

                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: T.slate400 }}>
                  ({product.reviews.length} review
                  {product.reviews.length !== 1 ? 's' : ''})
                </Text>

                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: T.slate200,
                    marginHorizontal: 2,
                  }}
                />

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 12,
                    color: T.teal700,
                    fontWeight: '600',
                  }}>
                  Verified
                </Text>
              </View>
            )}

            {/* ===============================================
                PRICE SECTION
               =============================================== */}

            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                backgroundColor: 'transparent',

                paddingTop: 16,
                paddingBottom: 16,

                marginBottom: 18,

                borderTopWidth: 1,
                borderBottomWidth: 1,

                borderColor: T.slate100,
              }}>
              {/* PRICE */}

              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 9,
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: isDesktop ? 34 : 30,

                    fontWeight: '800',

                    color: T.teal700,

                    letterSpacing: -0.6,
                  }}>
                  ₹{price.toLocaleString('en-IN')}
                </Text>

                {discount && activeRegularPrice && (
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 15,
                      color: T.slate400,
                      textDecorationLine: 'line-through',
                    }}>
                    ₹{activeRegularPrice.toLocaleString('en-IN')}
                  </Text>
                )}

                {discount && (
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      backgroundColor: T.red100,
                      borderRadius: 4,
                      paddingHorizontal: 7,
                      paddingVertical: 4,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 11,
                        fontWeight: '800',
                        color: T.red500,
                      }}>
                      {discount}% OFF
                    </Text>
                  </View>
                )}
              </View>

              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: T.slate400 }}>
                Inclusive of all taxes · Free shipping on orders ₹999+
              </Text>

              {/* MEDISHIELD COINS */}

              {product.medishield_coins > 0 && (
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 9,
                    backgroundColor: T.amber50,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: T.amber100,
                  }}>
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: T.amber100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="logo-bitcoin" size={14} color={T.amber500} />
                  </View>

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 12,
                      color: '#92400e',
                      fontWeight: '600',
                      flex: 1,
                    }}>
                    Earn{' '}
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontWeight: '800' }}>
                      {product.medishield_coins} MediShield Coin
                      {product.medishield_coins > 1 ? 's' : ''}
                    </Text>{' '}
                    on this purchase
                  </Text>
                </View>
              )}
            </View>

            {/* ===============================================
                VARIANTS
               =============================================== */}

            {hasVariants && (
              <View style={{ fontFamily: 'Poppins_400Regular', marginBottom: 20 }}>
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 14,
                      fontWeight: '700',
                      color: T.slate800,
                    }}>
                    Select Variation
                  </Text>

                  <Text
                    style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: T.slate400 }}>
                    {product.childProducts.length} options
                  </Text>
                </View>

                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 9,
                  }}>
                  {product.childProducts.map((variant, i) => {
                    const isActive = selectedVariant?.sku === variant.sku;

                    const available = variant.max_sale_qty > 0;

                    return (
                      <Pressable
                        key={i}
                        onPress={() => setSelectedVariant(variant)}
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          minWidth: 125,

                          paddingHorizontal: 13,

                          paddingVertical: 10,

                          borderRadius: 6,

                          borderWidth: isActive ? 1.5 : 1,

                          borderColor: isActive ? (available ? T.teal700 : T.red500) : T.slate200,

                          backgroundColor: isActive ? (available ? T.teal50 : '#fff5f5') : T.white,

                          opacity: available ? 1 : 0.7,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 12,
                            fontWeight: '600',

                            color: isActive ? (available ? T.teal700 : '#dc2626') : T.slate700,
                          }}
                          numberOfLines={2}>
                          {variant.name}
                        </Text>

                        <Text
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            marginTop: 4,
                            fontSize: 10,
                            fontWeight: '600',

                            color: available ? '#15803d' : '#dc2626',
                          }}>
                          {available ? `${variant.max_sale_qty} available` : 'Out of stock'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ===============================================
                QUANTITY
               =============================================== */}

            <View style={{ fontFamily: 'Poppins_400Regular', marginBottom: 18 }}>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 13,
                    fontWeight: '600',
                    color: T.slate700,
                  }}>
                  Qty
                </Text>

                <Stepper value={qty} onChange={setQty} max={activeStock || 20} />

                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginLeft: 'auto',
                  }}>
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: activeStock > 0 ? T.green500 : T.red500,
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 12,
                      color: activeStock > 0 ? T.green500 : T.red500,
                      fontWeight: '600',
                    }}>
                    {activeStock > 0 ? `${activeStock} in stock` : 'Out of stock'}
                  </Text>
                </View>
              </View>
            </View>

            {/* ===============================================
                DESKTOP CTA
               =============================================== */}

            {isDesktop && (
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',
                  gap: 10,
                  marginBottom: 20,
                }}>
                {/* ADD TO CART */}

                <View style={{ fontFamily: 'Poppins_400Regular', flex: 1, minHeight: 50 }}>
                  <AddToCartButton
                    productId={product._id}
                    variant={selectedVariant?.sku || product.sku}
                    count={qty}
                    price={price}
                    size="xxl"
                    style="outline"
                  />
                </View>

                {/* BUY NOW */}

                {/* <Pressable
                  style={{ fontFamily : 'Poppins_400Regular',
                    flex: 1,
                    minHeight: 50,

                    flexDirection:
                      'row',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',

                    gap: 8,

                    paddingVertical:
                      14,

                    borderRadius: 7,

                    backgroundColor:
                      T.amber500,

                    ...(isWeb
                      ? {
                          cursor:
                            'pointer',
                        }
                      : {}),
                  }}>

                  <Ionicons
                    name="flash-outline"
                    size={19}
                    color="#fff"
                  />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '800',
                    }}>
                    Buy Now
                  </Text>
                </Pressable> */}

                {/* WISHLIST */}

                <Pressable
                  onPress={handleWishlist}
                  disabled={wishlistLoading}
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 38,
                    height: 38,
                    borderRadius: 7,
                    backgroundColor: wishlisted ? '#fff5f5' : T.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: wishlisted ? '#fecaca' : T.slate200,
                    opacity: wishlistLoading ? 0.6 : 1,
                  }}>
                  {wishlistLoading ? (
                    <ActivityIndicator size="small" color={T.red500} />
                  ) : (
                    <Ionicons
                      name={wishlisted ? 'heart' : 'heart-outline'}
                      size={19}
                      color={wishlisted ? T.red500 : T.slate500}
                    />
                  )}
                </Pressable>
              </View>
            )}

            {/* ===============================================
                TRUST
               =============================================== */}

            <TrustStrip />
          </View>
        </View>

        {/* ===================================================
            DETAILS + REVIEWS
           =================================================== */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            paddingHorizontal: px,
            marginTop: 42,

            flexDirection: isDesktop ? 'row' : 'column',

            gap: isDesktop ? 44 : 28,

            alignItems: 'flex-start',
          }}>
          {/* =================================================
              MAIN CONTENT
             ================================================= */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flex: isDesktop ? 1 : undefined,

              width: '100%',

              gap: 38,
            }}>
            {/* ===============================================
                PRODUCT DETAILS
               =============================================== */}

            <View>
              <View style={{ fontFamily: 'Poppins_400Regular', marginBottom: 16 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 20,
                    fontWeight: '800',
                    color: T.slate900,
                    marginBottom: 5,
                  }}>
                  Product Details
                </Text>

                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    width: 34,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: T.teal700,
                  }}
                />
              </View>

              <SpecsTabs specs={product.product_specs} />
            </View>

            {/* ===============================================
                RELATED PRODUCTS
               =============================================== */}

            <View>
              <SectionHeader title="Related Products" />

              {loadingP ? (
                <GridSkeleton cols={2} />
              ) : !products || products.length === 0 ? (
                <NoProdcucts />
              ) : (
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    flexDirection: 'row',

                    overflow: 'auto',

                    gap: 16,

                    ...(Platform.OS === 'web'
                      ? {
                          scrollBehavior: 'smooth',
                        }
                      : {}),
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
            </View>

            {/* ===============================================
                REVIEWS
               =============================================== */}

            <View>
              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flexDirection: 'row',

                  alignItems: 'center',

                  justifyContent: 'space-between',

                  marginBottom: 16,
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 20,
                      fontWeight: '800',
                      color: T.slate900,
                      marginBottom: 5,
                    }}>
                    Customer Reviews
                  </Text>

                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      width: 34,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: T.teal700,
                    }}
                  />
                </View>

                {product.reviews.length > 0 && (
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      flexDirection: 'row',

                      alignItems: 'center',

                      gap: 6,
                    }}>
                    <Ionicons name="star" size={14} color={T.amber500} />

                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        fontWeight: '800',
                        color: T.teal700,
                      }}>
                      {avgRating.toFixed(1)}
                    </Text>

                    <Text
                      style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: T.slate400 }}>
                      / 5
                    </Text>
                  </View>
                )}
              </View>

              {product.reviews.length === 0 ? (
                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    paddingVertical: 45,
                    alignItems: 'center',

                    borderTopWidth: 1,
                    borderBottomWidth: 1,

                    borderColor: T.slate100,

                    gap: 10,
                  }}>
                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: T.teal50,

                      alignItems: 'center',

                      justifyContent: 'center',
                    }}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={T.teal700} />
                  </View>

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 15,
                      fontWeight: '700',
                      color: T.slate700,
                    }}>
                    No reviews yet
                  </Text>

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 13,
                      color: T.slate400,
                      textAlign: 'center',
                    }}>
                    Be the first to share your experience
                  </Text>

                  <Pressable
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      marginTop: 7,
                      backgroundColor: T.teal700,
                      borderRadius: 6,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: 13,
                      }}>
                      Write a Review
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View>
                  {product.reviews.map((r, i) => (
                    <ReviewCard key={i} review={r} />
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* =================================================
              DESKTOP STICKY PURCHASE SIDEBAR
             ================================================= */}

          {isDesktop && (
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                width: 320,
                gap: 20,
                position: 'sticky',
                top: 90,
              }}>
              {/* =============================================
                  QUICK BUY
                 ============================================= */}

              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  backgroundColor: T.white,

                  borderRadius: 10,

                  borderWidth: 1,

                  borderColor: T.slate100,

                  overflow: 'hidden',

                  ...(isWeb
                    ? {
                        boxShadow: T.shadowSm,
                      }
                    : {}),
                }}>
                <View style={{ fontFamily: 'Poppins_400Regular', padding: 18 }}>
                  {/* IMAGE */}

                  <View
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      height: 175,
                      backgroundColor: '#fbfcfc',
                      borderRadius: 7,
                      overflow: 'hidden',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={
                        !images?.[0]
                          ? require('../../assets/Image-not-found.png')
                          : images[0].startsWith('/')
                            ? {
                                uri: `https://images1.dentalkart.com/media/catalog/product${images[0]}`,
                              }
                            : {
                                uri: images[0],
                              }
                      }
                      style={{ fontFamily: 'Poppins_400Regular', width: '100%', height: '100%' }}
                      resizeMode="contain"
                    />
                  </View>

                  {/* NAME */}

                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 14,
                      fontWeight: '700',
                      color: T.slate900,
                      marginTop: 14,
                      lineHeight: 20,
                    }}>
                    {product.name}
                  </Text>

                  {/* PRICE */}

                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 23,
                      fontWeight: '800',
                      color: T.teal700,
                      marginTop: 8,
                    }}>
                    ₹{price.toLocaleString('en-IN')}
                  </Text>

                  {discount && activeRegularPrice && (
                    <View
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                        marginTop: 3,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          fontSize: 12,
                          color: T.slate400,
                          textDecorationLine: 'line-through',
                        }}>
                        ₹{activeRegularPrice.toLocaleString('en-IN')}
                      </Text>

                      <Text
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          fontSize: 11,
                          color: T.red500,
                          fontWeight: '700',
                        }}>
                        {discount}% off
                      </Text>
                    </View>
                  )}
                </View>

                {/* BUTTONS */}

                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    paddingHorizontal: 16,

                    paddingBottom: 16,

                    gap: 9,
                  }}>
                  {/* <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      minHeight: 46,
                    }}>
                    <AddToCartButton
                      productId={product._id}
                      variant={activeSku || product._id}
                      price={price}
                      size="sm"
                      style="solid"
                      fullWidth={true}
                    />
                  </View> */}
                  <Pressable
                    onPress={() => router.push(`/product/${product._id}`)}
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                      paddingVertical: 13,
                      color: '#fff',
                      // borderRadius: 7,
                      backgroundColor: T.teal700,
                      ...(isWeb
                        ? {
                            cursor: 'pointer',
                          }
                        : {}),
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        color: '#fff',
                        fontWeight: `600`,
                      }}>
                      Buy Now
                    </Text>
                  </Pressable>

                  {/* <Pressable
                    style={{ fontFamily : 'Poppins_400Regular',
                      flexDirection: 'row',

                      alignItems: 'center',

                      justifyContent: 'center',

                      gap: 7,

                      paddingVertical: 13,

                      borderRadius: 7,

                      backgroundColor: T.amber500,

                      ...(isWeb
                        ? {
                            cursor: 'pointer',
                          }
                        : {}),
                    }}>
                    <Ionicons name="flash-outline" size={17} color="#fff" />

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: '800',
                      }}>
                      Buy Now
                    </Text>
                  </Pressable> */}
                </View>

                {/* DELIVERY */}

                <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    borderTopWidth: 1,
                    borderTopColor: T.slate100,

                    padding: 16,

                    gap: 11,
                  }}>
                  {[
                    {
                      icon: 'location-outline',
                      text: 'Deliver to — Enter pincode',
                    },
                    {
                      icon: 'time-outline',
                      text: 'Delivery in 2–5 business days',
                    },
                    {
                      icon: 'refresh-outline',
                      text: '7 day easy returns',
                    },
                  ].map((item) => (
                    <View
                      key={item.text}
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        flexDirection: 'row',

                        alignItems: 'center',

                        gap: 10,
                      }}>
                      <Ionicons name={item.icon} size={15} color={T.teal700} />

                      <Text
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          fontSize: 12,
                          color: T.slate600,
                          flex: 1,
                        }}>
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* =============================================
                  SECURE PAYMENT
                 ============================================= */}

              <View
                style={{
                  fontFamily: 'Poppins_400Regular',
                  backgroundColor: T.white,

                  borderRadius: 8,

                  borderWidth: 1,

                  borderColor: T.slate100,

                  padding: 14,

                  flexDirection: 'row',

                  alignItems: 'center',

                  gap: 10,
                }}>
                <Ionicons name="shield-checkmark-outline" size={20} color={T.teal700} />

                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 12,
                    color: T.slate500,
                    flex: 1,
                    lineHeight: 18,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontWeight: '700',
                      color: T.slate800,
                    }}>
                    Secure payments
                  </Text>{' '}
                  via Razorpay · UPI, Cards, NetBanking accepted
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* =====================================================
          MOBILE STICKY BOTTOM BAR
         ===================================================== */}

      {!isDesktop && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: T.white,

            paddingHorizontal: 14,
            paddingVertical: 9,
            paddingBottom: 11,
            gap: 42,
            borderTopWidth: 1,
            borderTopColor: T.slate100,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.06,
            shadowRadius: 10,

            elevation: 10,
          }}>
          {/* WISHLIST */}
          <Pressable
            onPress={handleWishlist}
            disabled={wishlistLoading}
            style={{
              width: 50,
              height: 50,
              borderRadius: 7,
              backgroundColor: wishlisted ? '#fff5f5' : T.white,
              borderWidth: 1,
              borderColor: wishlisted ? '#fecaca' : T.slate200,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: wishlistLoading ? 0.6 : 1,
            }}>
            {wishlistLoading ? (
              <ActivityIndicator size="small" color={T.red500} />
            ) : (
              <Ionicons
                name={wishlisted ? 'heart' : 'heart-outline'}
                size={21}
                color={wishlisted ? T.red500 : T.slate400}
              />
            )}
          </Pressable>

          {/* ADD TO CART */}
          <View
            style={{
              minHeight: 46,
              minWidth: 180, // optional
            }}>
            <AddToCartButton
              productId={product._id}
              variant={activeSku || product._id}
              price={price}
              count={qty}
              size="6xl"
              style="solid"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
