import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Pressable,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ═══════════════════════════════════════════════════════════════
// BANNER API
// ═══════════════════════════════════════════════════════════════

const BANNER_API = 'https://medishield-admin-two.vercel.app/api/banners';

// ═══════════════════════════════════════════════════════════════
// HERO SLIDER
// ═══════════════════════════════════════════════════════════════

export default function HeroSlider() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const intervalRef = useRef(null);
  const isMobile = width < 640;
  const currentSlide = slides[activeIndex];

  // ═══════════════════════════════════════════════════════════════
  // FETCH BANNERS
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    let mounted = true;
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(BANNER_API);
        if (!response.ok) {
          throw new Error(`Banner API failed: ${response.status}`);
        }
        const result = await response.json();
        const banners = Array.isArray(result?.data) ? result.data : [];
        const formattedSlides = banners
          .filter((banner) => banner?.mobile_image)
          .map((banner) => ({
            id: banner._id || banner.id,
            image: {
              uri: banner.mobile_image,
            },
            title: banner.title || '',
            route: '/product/' + banner.id,
          }));

        if (mounted) {
          setSlides(formattedSlides);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error('Hero banners API error:', err);

        if (mounted) {
          setSlides([]);
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // GET ACTUAL IMAGE SIZE
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!currentSlide?.image?.uri) {
      return;
    }

    Image.getSize(
      currentSlide.image.uri,
      (imageWidth, imageHeight) => {
        setImageSize({
          width: imageWidth,
          height: imageHeight,
        });
      },
      (imageError) => {
        console.log('Hero image size error:', imageError);
        // Safe fallback ratio
        setImageSize({
          width: 1,
          height: 0.35,
        });
      }
    );
  }, [currentSlide]);

  // ═══════════════════════════════════════════════════════════════
  // CALCULATE ACTUAL HEIGHT
  // ═══════════════════════════════════════════════════════════════

  const imageRatio = imageSize.width > 0 ? imageSize.height / imageSize.width : 0.35;

  const heroHeight = Math.max(width * imageRatio, 1);

  // ═══════════════════════════════════════════════════════════════
  // AUTO SLIDE
  // ═══════════════════════════════════════════════════════════════

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (slides.length <= 1) {
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        return (prev + 1) % slides.length;
      });
    }, 4500);
  };

  useEffect(() => {
    if (!loading && slides.length > 0) {
      startAutoSlide();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, slides.length]);

  // ═══════════════════════════════════════════════════════════════
  // PREVIOUS
  // ═══════════════════════════════════════════════════════════════

  const handlePrevious = () => {
    if (slides.length <= 1) {
      return;
    }

    setActiveIndex((prev) => {
      return prev === 0 ? slides.length - 1 : prev - 1;
    });

    startAutoSlide();
  };

  // ═══════════════════════════════════════════════════════════════
  // NEXT
  // ═══════════════════════════════════════════════════════════════

  const handleNext = () => {
    if (slides.length <= 1) {
      return;
    }

    setActiveIndex((prev) => {
      return (prev + 1) % slides.length;
    });

    startAutoSlide();
  };

  // ═══════════════════════════════════════════════════════════════
  // DOT
  // ═══════════════════════════════════════════════════════════════

  const goToSlide = (index) => {
    setActiveIndex(index);

    startAutoSlide();
  };

  // ═══════════════════════════════════════════════════════════════
  // LOADING
  // ═══════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <View
        style={{
          width: '100%',
          minHeight: isMobile ? 180 : 300,
          borderRadius: isMobile ? 12 : 18,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <ActivityIndicator size="small" color="#CD0F0F" />
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // NO BANNERS
  // ═══════════════════════════════════════════════════════════════

  if (!currentSlide || error) {
    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  // HERO
  // ═══════════════════════════════════════════════════════════════

  return (
    <View
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: isMobile ? 12 : 18,
      }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* IMAGE */}
      {/* ═══════════════════════════════════════════════════════ */}

      <Pressable
        onPress={() => {
          if (currentSlide?.route) {
            router.push(currentSlide.route);
          }
        }}
        style={{
          width: '100%',
          borderRadius: isMobile ? 12 : 18,
          overflow: 'hidden',
        }}>
        <Image
          source={currentSlide.image}
          resizeMode="cover"
          style={{
            width: '100%',
            height: isMobile ? 250 : 400,
            borderRadius: isMobile ? 12 : 18,
            backgroundColor: '#E9E9E9',
          }}
        />
      </Pressable>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* WEB ONLY — PREVIOUS */}
      {/* ═══════════════════════════════════════════════════════ */}

      {Platform.OS === 'web' && slides.length > 1 && (
        <Pressable
          onPress={handlePrevious}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Previous slide"
          style={({ pressed }) => ({
            position: 'absolute',
            left: isMobile ? 10 : 18,
            top: '50%',
            transform: [
              {
                translateY: -21,
              },
            ],
            width: isMobile ? 36 : 42,
            height: isMobile ? 36 : 42,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? '#ffffff' : 'rgba(255,255,255,0.92)',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
          })}>
          <Ionicons name="chevron-back" size={isMobile ? 19 : 22} color="#122b45" />
        </Pressable>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* WEB ONLY — NEXT */}
      {/* ═══════════════════════════════════════════════════════ */}

      {Platform.OS === 'web' && slides.length > 1 && (
        <Pressable
          onPress={handleNext}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Next slide"
          style={({ pressed }) => ({
            position: 'absolute',
            right: isMobile ? 10 : 18,
            top: '50%',
            transform: [
              {
                translateY: -21,
              },
            ],
            width: isMobile ? 36 : 42,
            height: isMobile ? 36 : 42,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? '#ffffff' : 'rgba(255,255,255,0.92)',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
          })}>
          <Ionicons name="chevron-forward" size={isMobile ? 19 : 22} color="#122b45" />
        </Pressable>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DOTS */}
      {/* ═══════════════════════════════════════════════════════ */}

      {slides.length > 1 && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: isMobile ? 10 : 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
          {slides.map((slide, index) => {
            const active = index === activeIndex;

            return (
              <Pressable
                key={slide.id}
                onPress={() => goToSlide(index)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Go to slide ${index + 1}`}
                style={{
                  width: active ? (isMobile ? 18 : 22) : 7,
                  height: 7,
                  borderRadius: 999,
                  backgroundColor: active ? '#CD0F0F' : 'rgba(255,255,255,0.95)',
                }}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}
