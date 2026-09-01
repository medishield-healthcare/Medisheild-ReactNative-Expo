import { View, Text, Pressable } from 'react-native';
import C from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import useBreakpoint from '@/utils/breakpoints';
import { router } from 'expo-router';

export default function OfferBanner() {
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <View
      style={{
        width: '100%',
        marginVertical: isMobile ? 8 : 14,
      }}>
      <View
        style={{
          position: 'relative',
          overflow: 'hidden',

          minHeight: isMobile ? 300 : 235,

          borderRadius: isMobile ? 22 : 28,

          backgroundColor: C.primaryDark,

          flexDirection: isMobile ? 'column' : 'row',

          alignItems: 'stretch',

          justifyContent: 'space-between',
        }}>
        {/* =====================================================
            BACKGROUND DECORATION
        ====================================================== */}

        <View
          style={{
            position: 'absolute',

            width: isMobile ? 260 : 440,
            height: isMobile ? 260 : 440,

            borderRadius: 999,

            backgroundColor: C.primary,

            opacity: 0.18,

            right: isMobile ? -120 : -160,
            top: isMobile ? -130 : -190,
          }}
        />

        <View
          style={{
            position: 'absolute',

            width: isMobile ? 150 : 230,
            height: isMobile ? 150 : 230,

            borderRadius: 999,

            borderWidth: 1,
            borderColor: '#ffffff',

            opacity: 0.12,

            right: isMobile ? 35 : 150,
            bottom: isMobile ? -90 : -120,
          }}
        />

        <View
          style={{
            position: 'absolute',

            width: 7,
            height: 7,

            borderRadius: 4,

            backgroundColor: '#ffffff',

            opacity: 0.7,

            right: isMobile ? 35 : 320,
            top: 30,
          }}
        />

        <View
          style={{
            position: 'absolute',

            width: 4,
            height: 4,

            borderRadius: 2,

            backgroundColor: '#fff',

            opacity: 0.35,

            right: isMobile ? 70 : 350,
            top: 62,
          }}
        />

        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <View
          style={{
            flex: 1,

            paddingHorizontal: isMobile ? 22 : isTablet ? 30 : 42,

            paddingVertical: isMobile ? 25 : 32,

            justifyContent: 'center',

            zIndex: 3,
          }}>
          {/* Eyebrow */}

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              gap: 8,

              marginBottom: 12,
            }}>
            <View
              style={{
                width: 8,
                height: 8,

                borderRadius: 4,

                backgroundColor: '#ffffff',
              }}
            />

            <Text
              style={{
                color: '#99f6e4',

                fontSize: 10,

                fontWeight: '900',

                letterSpacing: 1.6,
              }}>
              THIS WEEK ONLY
            </Text>
          </View>

          {/* Main heading */}

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'baseline',

              flexWrap: 'wrap',

              gap: 8,

              marginBottom: 5,
            }}>
            <Text
              style={{
                color: '#fff',

                fontSize: isMobile ? 34 : isTablet ? 40 : 46,

                lineHeight: isMobile ? 40 : 52,

                fontWeight: '900',

                letterSpacing: -1.5,
              }}>
              Save
            </Text>

            <Text
              style={{
                color: '#ffffff',

                fontSize: isMobile ? 42 : isTablet ? 50 : 58,

                lineHeight: isMobile ? 46 : 62,

                fontWeight: '900',

                letterSpacing: -2,
              }}>
              20%
            </Text>
          </View>

          <Text
            style={{
              color: '#fff',

              fontSize: isMobile ? 18 : 21,

              fontWeight: '700',

              marginBottom: 7,
            }}>
            on dental essentials
          </Text>

          <Text
            style={{
              color: '#a7d7d3',

              fontSize: isMobile ? 12 : 13,

              lineHeight: 20,

              maxWidth: 410,

              marginBottom: 18,
            }}>
            Stock up on trusted dental products and get more value from every purchase.
          </Text>

          {/* CTA + Coupon */}

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              flexWrap: 'wrap',

              gap: 10,
            }}>
            <Pressable
               onPress={() => router.push('/offers')}
              style={{
                backgroundColor: '#fff',

                minHeight: 42,

                paddingHorizontal: 18,

                borderRadius: 10,

                flexDirection: 'row',

                alignItems: 'center',

                justifyContent: 'center',

                gap: 8,
              }}>
              <Text
                style={{
                  color: C.primaryDark,

                  fontSize: 12,

                  fontWeight: '900',
                }}>
                Shop Offer
              </Text>

              <Ionicons name="arrow-forward" size={15} color={C.primaryDark} />
            </Pressable>

            {/* Coupon */}

            <View
              style={{
                minHeight: 42,

                paddingHorizontal: 12,

                borderRadius: 10,

                borderWidth: 1,

                borderColor: 'rgba(255,255,255,0.18)',

                backgroundColor: 'rgba(255,255,255,0.07)',

                flexDirection: 'row',

                alignItems: 'center',

                gap: 8,
              }}>
              <Text
                style={{
                  color: '#8de8df',

                  fontSize: 10,

                  fontWeight: '600',
                }}>
                CODE
              </Text>

              <Text
                style={{
                  color: '#fff',

                  fontSize: 12,

                  fontWeight: '900',

                  letterSpacing: 0.8,
                }}>
                DENTAL20
              </Text>

              <Ionicons name="copy-outline" size={14} color="#8de8df" />
            </View>
          </View>
        </View>

        {/* =====================================================
            RIGHT VISUAL
        ====================================================== */}

        {!isMobile && (
          <View
            style={{
              width: isTablet ? 220 : 300,

              position: 'relative',

              alignItems: 'center',

              justifyContent: 'center',

              zIndex: 2,
            }}>
            {/* Main percentage */}

            <Text
              style={{
                color: '#fff',

                fontSize: isTablet ? 105 : 135,

                lineHeight: isTablet ? 110 : 140,

                fontWeight: '900',

                letterSpacing: -8,

                opacity: 0.08,

                position: 'absolute',

                right: -10,

                top: 35,
              }}>
              20
            </Text>

            {/* Floating discount badge */}

            <View
              style={{
                width: isTablet ? 145 : 170,

                height: isTablet ? 145 : 170,

                borderRadius: 999,

                backgroundColor: 'rgba(255,255,255,0.08)',

                borderWidth: 1,

                borderColor: 'rgba(255,255,255,0.16)',

                alignItems: 'center',

                justifyContent: 'center',

                transform: [
                  {
                    rotate: '-7deg',
                  },
                ],
              }}>
              <Text
                style={{
                  color: '#ffffff',

                  fontSize: isTablet ? 46 : 55,

                  lineHeight: isTablet ? 50 : 58,

                  fontWeight: '900',

                  letterSpacing: -2,
                }}>
                20%
              </Text>

              <Text
                style={{
                  color: '#fff',

                  fontSize: 11,

                  fontWeight: '800',

                  letterSpacing: 2,

                  marginTop: 2,
                }}>
                OFF
              </Text>
            </View>

            {/* Small badge */}

            <View
              style={{
                position: 'absolute',

                right: isTablet ? 10 : 28,

                bottom: isTablet ? 22 : 28,

                backgroundColor: '#fbbf24',

                paddingHorizontal: 10,

                paddingVertical: 6,

                borderRadius: 8,

                transform: [
                  {
                    rotate: '4deg',
                  },
                ],
              }}>
              <Text
                style={{
                  color: '#422006',

                  fontSize: 9,

                  fontWeight: '900',

                  letterSpacing: 0.5,
                }}>
                LIMITED OFFER
              </Text>
            </View>
          </View>
        )}

        {/* =====================================================
            MOBILE DISCOUNT VISUAL
        ====================================================== */}

        {isMobile && (
          <View
            style={{
              position: 'absolute',

              right: 18,
              bottom: 16,

              zIndex: 1,
            }}>
            <Text
              style={{
                color: '#fff',

                fontSize: 70,

                lineHeight: 72,

                fontWeight: '900',

                letterSpacing: -5,

                opacity: 0.08,
              }}>
              20%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
