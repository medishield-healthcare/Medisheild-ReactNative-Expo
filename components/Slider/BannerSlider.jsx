// components/BannerSlider/BannerSlider.jsx
//
// Usage:
//   import BannerSlider from 'components/BannerSlider/BannerSlider';
//   <BannerSlider />
//
// API: GET /product/banner/getBannerProduct
// Response: { data: [{ _id, mobile_image, title, id }] }

import { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, Pressable, ScrollView,
  useWindowDimensions, ActivityIndicator, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '@/api/axios';
import C from '@/utils/theme';



const AUTO_PLAY_INTERVAL = 3500; // ms

export default function BannerSlider() {
  const [banners,  setBanners]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [current,  setCurrent]  = useState(0);
  const [hovered,  setHovered]  = useState(false);

  const scrollRef  = useRef(null);
  const timerRef   = useRef(null);
  const { width }  = useWindowDimensions();

  // Responsive: full width on mobile, constrained on web
  const isWeb     = Platform.OS === 'web';
  const sliderW   = isWeb ? Math.min(width, 1400) : width;  // max 1400px on web
  const imgHeight = isWeb
    ? (width < 768 ? 180 : width < 1024 ? 280 : 380)
    : 200;

  // ── Fetch banners ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/product/banner/getBannerProduct');
        setBanners(data.data || []);
      } catch (e) {
        console.error('Banner fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Auto-play ──────────────────────────────────────────────────
  useEffect(() => {
    if (banners.length === 0) return;
    startTimer();
    return () => clearTimer();
  }, [banners, current, hovered]);

  function startTimer() {
    clearTimer();
    if (hovered) return; // pause on hover (web)
    timerRef.current = setTimeout(() => {
      goTo((current + 1) % banners.length);
    }, AUTO_PLAY_INTERVAL);
  }

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  // ── Scroll to slide ────────────────────────────────────────────
  function goTo(index) {
    if (!scrollRef.current || banners.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(index, banners.length - 1));
    scrollRef.current.scrollTo({ x: clampedIndex * sliderW, animated: true });
    setCurrent(clampedIndex);
  }

  // ── Track scroll position (native swipe) ──────────────────────
  function onScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / sliderW);
    setCurrent(index);
  }

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <View style={{
        height: imgHeight,
        backgroundColor: C.bg,
        borderRadius: isWeb ? 20 : 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: isWeb ? 0 : 0,
      }}>
        {/* Shimmer skeleton */}
        <View style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#e2e8f0',
        }} />
        <View style={{
          position: 'absolute',
          width: '40%', height: '30%',
          borderRadius: 12,
          backgroundColor: '#cbd5e1',
          top: '35%', left: '30%',
        }} />
        <ActivityIndicator color={C.primary} size="large" style={{ position: 'absolute' }} />
      </View>
    );
  }

  if (banners.length === 0) return null;

  return (
    <View
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* ── Slides ── */}
      <View style={{
        borderRadius: isWeb ? 20 : 16,
        overflow: 'hidden',
        // Web shadow
        ...(isWeb ? { boxShadow: '0 8px 32px rgba(15,77,77,0.18)' } : {
          shadowColor: C.primaryDark,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 6,
        }),
      }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onScrollEnd}
          style={{ width: sliderW }}
        >
          {banners.map((banner, index) => (
            <Pressable
              key={banner._id}
              onPress={() => console.log('Banner tapped:', banner.id)}
              style={{ width: sliderW, height: imgHeight }}
            >
              <Image
                source={{ uri: banner.mobile_image }}
                style={{  height: '100%' }}
                resizeMode="cover"
              />

              {/* Gradient overlay at bottom */}
              <View style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: imgHeight * 0.45,
                background: isWeb
                  ? 'linear-gradient(to top, rgba(15,79,79,0.7) 0%, transparent 100%)'
                  : undefined,
                backgroundColor: !isWeb ? 'transparent' : undefined,
                // Native gradient fallback
                ...(!isWeb ? {
                  background: undefined,
                } : {}),
              }}>
                {/* Web gradient via nested view */}
                {isWeb && (
                  <View style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(to top, rgba(15,79,79,0.65) 0%, transparent 100%)',
                  }} />
                )}
              </View>

              {/* Slide label */}
              {/* {banner.title && (
                <View style={{
                  position: 'absolute', bottom: isWeb ? 20 : 12, left: isWeb ? 24 : 16,
                }}>
                  <Text style={{
                    color: C.white,
                    fontSize: isWeb ? 16 : 13,
                    fontWeight: '800',
                    letterSpacing: 0.3,
                    textShadowColor: 'rgba(0,0,0,0.4)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}>
                    {banner.title}
                  </Text>
                  <Text style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: isWeb ? 12 : 10,
                    fontWeight: '500',
                    marginTop: 2,
                  }}>
                    #{banner.id}
                  </Text>
                </View>
              )} */}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── Prev / Next arrows (web only, visible on hover) ── */}
      {isWeb && banners.length > 1 && (
        <>
          <Pressable
            onPress={() => goTo((current - 1 + banners.length) % banners.length)}
            style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.92)',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <Ionicons name="chevron-back" size={20} color={C.primaryDark} />
          </Pressable>

          <Pressable
            onPress={() => goTo((current + 1) % banners.length)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.92)',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <Ionicons name="chevron-forward" size={20} color={C.primaryDark} />
          </Pressable>
        </>
      )}

      {/* ── Dots ── */}
      {banners.length > 1 && (
        <View style={{
          position: 'absolute',
          bottom: isWeb ? 16 : 10,
          right: isWeb ? 20 : 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}>
          {banners.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={{
                height: 6,
                width: i === current ? (isWeb ? 22 : 18) : 6,
                borderRadius: 3,
                backgroundColor: i === current
                  ? C.white
                  : 'rgba(255,255,255,0.45)',
                // Web transition
                ...(isWeb ? { transition: 'all 0.3s ease' } : {}),
              }}
            />
          ))}
        </View>
      )}

      {/* ── Slide counter (top right) ── */}
      <View style={{
        position: 'absolute',
        top: isWeb ? 14 : 10,
        right: isWeb ? 16 : 12,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
        <Text style={{
          color: C.white,
          fontSize: isWeb ? 12 : 10,
          fontWeight: '700',
        }}>
          {current + 1} / {banners.length}
        </Text>
      </View>
    </View>
  );
}