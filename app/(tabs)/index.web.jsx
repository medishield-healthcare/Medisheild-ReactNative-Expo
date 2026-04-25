// app/(tabs)/index.web.jsx
//
// Responsive breakpoints:
//   xs  < 480px  → mobile (single col)
//   sm  < 768px  → tablet portrait (2 col)
//   md  < 1024px → tablet landscape (3 col)
//   lg  ≥ 1024px → desktop (4 col)

import { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axios';
import Footer from 'components/Footer/Footer';
import BannerSlider from 'components/Slider/BannerSlider';
import WebHeader from 'components/Header/header.web';
import WebProductCard from 'components/Cards/WebProductCard';
import GridSkeleton from 'components/Cards/GridSkeleton';
import C from '@/utils/theme';
import TrustBar from 'components/ui/TrustBar';
import HeroSection from 'components/Section/HeroSection';
import OfferBanner from 'components/Section/OfferBanner';
import SectionHeader from 'components/Section/SectionHeader';
import NoProdcucts from 'components/Section/NoProdcucts';
import { useQuery } from '@tanstack/react-query';

// ── Responsive helpers ────────────────────────────────────────────────────────
function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    // product grid columns
    cols: width < 480 ? 2 : width < 768 ? 2 : width < 1024 ? 3 : 4,
    px: width < 640 ? 16 : width < 1024 ? 24 : 40,
  };
}

// ── Web Header ────────────────────────────────────────────────────────────────
// function WebHeader({ search, setSearch, cartCount, categories, activeCategory, setCategory }) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const { isMobile, isTablet, px } = useBreakpoint();
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <View style={{
//       backgroundColor: C.white,
//       borderBottomWidth: 1, borderBottomColor: C.border,
//       position: 'sticky', top: 0, zIndex: 100,
//       boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
//     }}>
//       {/* ── Announcement bar (desktop only) ── */}
//       {!isMobile && (
//         <View style={{
//           backgroundColor: C.primaryDark,
//           paddingVertical: 7, paddingHorizontal: px,
//           flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//         }}>
//           <Text style={{ color: '#5eead4', fontSize: 12, fontWeight: '600' }}>
//             🚚 Free shipping on orders above ₹999
//           </Text>
//           <View style={{ flexDirection: 'row', gap: 20 }}>
//             {['About', 'Contact', 'Track Order'].map(l => (
//               <Pressable key={l}>
//                 <Text style={{ color: '#94d8d4', fontSize: 12 }}>{l}</Text>
//               </Pressable>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* ── Main header row ── */}
//       <View style={{
//         flexDirection: 'row', alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: px, paddingVertical: isMobile ? 12 : 14, gap: isMobile ? 12 : 24,
//       }}>
//         {/* Logo */}
//         <Pressable
//           onPress={() => router.push('/')}
//           style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
//         >
//           <Image
//   source={require('../../assets/logo.png')}
//   style={{
//     width: isMobile ? 24 : 120,
//     height: isMobile ? 24 : 40,
//     resizeMode: 'contain',
//     mixBlendMode: 'difference',
//   }}
// />
//           {/* <View style={{
//             width: isMobile ? 34 : 40, height: isMobile ? 34 : 40,
//             borderRadius: isMobile ? 10 : 12,
//             backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
//           }}>
//             <Ionicons name="medical" size={isMobile ? 17 : 20} color="white" />
//           </View>
//           <View>
//             <Text style={{ fontSize: isMobile ? 16 : 20, fontWeight: '900', color: C.primaryDark, letterSpacing: -0.3 }}>
//               MediShield
//             </Text>
//             {!isMobile && (
//               <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted, letterSpacing: 2 }}>
//                 DENTAL CARE
//               </Text>
//             )}
//           </View> */}
//         </Pressable>

//         {/* Nav links — desktop only */}
//         {isTablet || isMobile ? null : (
//           <View style={{ flexDirection: 'row', gap: 4 }}>
//             {['Home', 'Products', 'Categories', 'Offers'].map((nav) => (
//               <Pressable key={nav} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
//                 <Text style={{ fontSize: 14, fontWeight: '600', color: C.dark }}>{nav}</Text>
//               </Pressable>
//             ))}
//           </View>
//         )}

//         {/* Search bar */}
//         <View style={{
//           flex: 1, maxWidth: isMobile ? 999 : 360,
//           flexDirection: 'row', alignItems: 'center',
//           backgroundColor: C.bg, borderRadius: 14,
//           borderWidth: 1.5, borderColor: C.border,
//           paddingHorizontal: 12, paddingVertical: isMobile ? 9 : 10, gap: 8,
//         }}>
//           <Ionicons name="search-outline" size={16} color={C.muted} />
//           <TextInput
//             placeholder="Search dental products..."
//             placeholderTextColor={C.muted}
//             value={search}
//             onChangeText={setSearch}
//             style={{ flex: 1, fontSize: 14, color: C.dark, outlineStyle: 'none' }}
//           />
//           {search.length > 0 && (
//             <Pressable onPress={() => setSearch('')}>
//               <Ionicons name="close-circle" size={16} color={C.muted} />
//             </Pressable>
//           )}
//         </View>

//         {/* Right actions */}
//         <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
//           {/* Coins — hide on mobile */}
//           {!isMobile && (
//             <Pressable style={{
//               flexDirection: 'row', alignItems: 'center', gap: 5,
//               backgroundColor: C.accentLight, borderRadius: 10,
//               paddingHorizontal: 10, paddingVertical: 7,
//             }}>
//               <Ionicons name="logo-bitcoin" size={15} color={C.accent} />
//               <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400e' }}>50</Text>
//             </Pressable>
//           )}

//           {/* Cart */}
//           <Pressable
//             onPress={() => router.push('/cart')}
//             style={{
//               width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
//               borderRadius: 12, backgroundColor: C.primary,
//               alignItems: 'center', justifyContent: 'center', position: 'relative',
//             }}
//           >
//             <Ionicons name="bag-outline" size={isMobile ? 18 : 20} color="white" />
//             {cartCount > 0 && (
//               <View style={{
//                 position: 'absolute', top: -4, right: -4,
//                 backgroundColor: C.accent, borderRadius: 10,
//                 width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <Text style={{ color: 'white', fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
//               </View>
//             )}
//           </Pressable>

//           {/* Account */}
//           {user ? (
//             <Pressable
//               onPress={() => router.push('/profile')}
//               style={{
//                 width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
//                 borderRadius: 12, backgroundColor: C.primaryLight,
//                 alignItems: 'center', justifyContent: 'center',
//               }}
//             >
//               <Ionicons name="person" size={isMobile ? 18 : 20} color={C.primary} />
//             </Pressable>
//           ) : (
//             <Pressable
//               onPress={() => router.push('/auth/login')}
//               style={{
//                 backgroundColor: C.primary, borderRadius: 12,
//                 paddingHorizontal: isMobile ? 12 : 16,
//                 paddingVertical: isMobile ? 8 : 10,
//               }}
//             >
//               <Text style={{ color: 'white', fontSize: isMobile ? 12 : 13, fontWeight: '700' }}>
//                 {isMobile ? 'Login' : 'Sign In'}
//               </Text>
//             </Pressable>
//           )}
//         </View>
//       </View>

//       {/* ── Category strip (dynamic) ── */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingHorizontal: px, paddingBottom: 12,
//           borderTopWidth: 1, borderTopColor: C.border,
//           paddingTop: 10, gap: 6, flexDirection: 'row',
//         }}
//       >
//         {/* All pill */}
//         {[{ _id: 'all', name: 'All' }, ...categories].map((cat) => {
//           const isActive = activeCategory === (cat._id || cat.name);
//           return (
//             <Pressable
//               key={cat._id || cat.name}
//               onPress={() => setCategory(cat._id || cat.name)}
//               style={{
//                 flexDirection: 'row', alignItems: 'center', gap: 5,
//                 paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
//                 backgroundColor: isActive ? C.primary : C.bg,
//                 borderWidth: 1, borderColor: isActive ? C.primary : C.border,
//               }}
//             >
//               <Ionicons
//                 name={catIcon(cat.name)}
//                 size={14}
//                 color={isActive ? 'white' : C.muted}
//               />
//               <Text style={{
//                 fontSize: 13, fontWeight: '600',
//                 color: isActive ? 'white' : C.dark,
//                 whiteSpace: 'nowrap',
//               }}>{cat.name}</Text>
//             </Pressable>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// }

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomeWeb() {
  // const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [loadingP, setLoadingP] = useState(true);
  const [loadingC, setLoadingC] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setCategory] = useState('all');
  const [cartCount] = useState(0);
  const [brands, setBrands] = useState([]);

  const router = useRouter();
  const { cols, px, isMobile, isTablet, isDesktop } = useBreakpoint();

  // ── Fetch products ──
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

  async function fetchBrands() {
    try {
      const { data } = await API.get('/brand');
      console.log('Brands fetched:', data);
      setBrands(data.data || []);
    } catch (e) {
      console.error('Brands fetch error:', e);
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
    // fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // ── Filter ──
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
        <View
          style={{
            maxWidth: isMobile ? '100%' : isTablet ? '720px' : isDesktop ? '1240px' : '1240px',
            marginHorizontal: 'auto',
            flex: 1,
            flexDirection: 'column',
            gap: 30,
            paddingVertical: 20,
            paddingHorizontal: px,
          }}>
          {/* ── HERO ── */}
          <HeroSection />

          {/* ── TRUST BAR ── */}
          <TrustBar />

           <View style={{ paddingHorizontal: 0 }}>
            <SectionHeader title="Top Brands" onSeeAll={() => router.push('/brands')} />
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

          {/* ── FEATURED PRODUCTS ── */}
          <View>
            {/* Section header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 20,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: isMobile ? 22 : 28,
                    fontWeight: '900',
                    color: C.dark,
                    letterSpacing: -0.5,
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  borderWidth: 1.5,
                  borderColor: C.primary,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>View All</Text>
                <Ionicons name="arrow-forward" size={14} color={C.primary} />
              </Pressable>
            </View>

            {/* Products */}
            {loadingP ? (
              <GridSkeleton cols={cols} />
            ) : filtered.length === 0 ? (
              <NoProdcucts search={search} setSearch={setSearch} />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  overflow: 'auto',
                  scrollBehavior: 'smooth',
                  gap: 16,
                }}>
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

         

          {/* ── OFFER BANNER ── */}
          <OfferBanner />
          <BannerSlider />
        </View>

        {/* ── FOOTER ── */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
