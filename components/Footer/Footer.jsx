import C from '@/utils/theme';

import { Image, Platform, Pressable, Text, useWindowDimensions, View, Linking } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ─────────────────────────────────────────────
// Breakpoint
// ─────────────────────────────────────────────

function useBreakpoint() {
  const { width } = useWindowDimensions();

  return {
    width,

    isMobile: width < 640,

    isTablet: width >= 640 && width < 1024,

    isDesktop: width >= 1024,

    cols: width < 480 ? 1 : width < 768 ? 2 : width < 1024 ? 3 : 4,

    px: width < 640 ? 16 : width < 1024 ? 24 : 40,
  };
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────

export default function Footer() {
  if (Platform.OS !== 'web') {
    return null;
  }
  const { isMobile, px, isTablet } = useBreakpoint();

  const router = useRouter();

  // ───────────────────────────────────────────
  // Footer navigation
  // ───────────────────────────────────────────

  const footerColumns = [
    {
      heading: 'Shop',

      links: [
        {
          label: 'All Products',
          route: '/shop',
        },
        {
          label: 'Instruments',
          route: '/shop?category=Instruments',
        },
        {
          label: 'Materials',
          route: '/shop?category=Materials',
        },
        {
          label: 'Equipment',
          route: '/shop?category=Equipment',
        },
      ],
    },

    {
      heading: 'Company',

      links: [
        {
          label: 'About Us',
          route: '/about',
        },
        {
          label: 'Blog',
          route: '/blog',
        },
        {
          label: 'Careers',
          route: '/careers',
        },
        {
          label: 'Contact',
          route: '/contact',
        },
      ],
    },

    {
      heading: 'Support',

      links: [
        {
          label: 'FAQ',
          route: '/help-and-support',
        },
        {
          label: 'Shipping',
          route: '/shipping',
        },
        {
          label: 'Returns',
          route: '/returns',
        },
        {
          label: 'Track Order',
          route: '/track-order',
        },
      ],
    },
  ];

  const bottomLinks = [
    {
      label: 'Privacy',
      route: '/privacy-policy',
    },
    {
      label: 'Terms & Conditions',
      route: '/terms-and-conditions',
    },
    // {
    //   label: 'Cookies',
    //   route: '/cookies',
    // },
  ];

  // ───────────────────────────────────────────
  // Navigation helper
  // ───────────────────────────────────────────

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <View
      style={{
        fontFamily: 'Poppins_400Regular',
        backgroundColor: C.white,
        paddingTop: isMobile ? 32 : 48,
        // paddingBottom: 34,
        // marginBottom: 24,
      }}>
      <View
        style={{
          fontFamily: 'Poppins_400Regular',
          width: '100%',
          maxWidth: 1280,
          alignSelf: 'center',
          paddingHorizontal: px,
        }}>
        {/* ═══════════════════════════════════════
          TOP SECTION
      ═══════════════════════════════════════ */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            flexDirection: isMobile ? 'column' : 'row',

            gap: isMobile ? 28 : 40,

            marginBottom: 32,
          }}>
          {/* ─────────────────────────────────────
            BRAND
        ───────────────────────────────────── */}

          <View style={{ fontFamily: 'Poppins_400Regular', flex: isMobile ? undefined : 2 }}>
            <View
              style={{
                fontFamily: 'Poppins_400Regular',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
                // borderWidth: 1,
                // borderColor: '#fff',
                // backgroundColor: '#fff',
                // borderRadius: 10,
                // paddingHorizontal: 10,
                // paddingVertical: 10,
                width: isMobile ? 120 : isTablet ? 140 : 130,
              }}>
              <Image
                source={require('../../assets/logo-img.png')}
                style={{
                  fontFamily: 'Poppins_400Regular',
                  width: isMobile ? 100 : isTablet ? 115 : 130,
                  height: isMobile ? 44 : 46,
                  marginLeft: isMobile ? 0 : -12,
                  resizeMode: 'contain',
                }}
              />
            </View>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                color: '#000000',
                fontSize: 14,
                lineHeight: 22,
                fontWeight: '500',
                maxWidth: 240,
              }}>
              India's trusted dental products store. Quality you can count on.
            </Text>
          </View>

          {/* ─────────────────────────────────────
            LINK COLUMNS
        ───────────────────────────────────── */}

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              flex: isMobile ? undefined : 3,
              gap: 20,
              flexWrap: 'wrap',
            }}>
            {footerColumns.map((column) => (
              <View
                key={column.heading}
                style={{
                  fontFamily: 'Poppins_400Regular',
                  flex: 1,
                  minWidth: 100,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 12,
                    fontWeight: '900',
                    color: C.primaryDark,
                    letterSpacing: 1.5,
                    marginBottom: 14,
                  }}>
                  {column.heading.toUpperCase()}
                </Text>

                {column.links.map((link) => (
                  <Pressable
                    key={link.label}
                    onPress={() => handleNavigation(link.route)}
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      marginBottom: 10,

                      alignSelf: 'flex-start',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        color: '#000000',
                        fontSize: 13,
                      }}>
                      {link.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* ═══════════════════════════════════════
          BOTTOM SECTION
      ═══════════════════════════════════════ */}

        <View
          style={{
            fontFamily: 'Poppins_400Regular',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.1)',
            paddingTop: 18,
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 10 : 0,
            paddingBottom: 18,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              color: C.primaryDark,
              fontWeight: '600',
              fontSize: 12,
            }}>
            © 2026 MediShield · All rights reserved.
          </Text>

          <View
            style={{
              fontFamily: 'Poppins_400Regular',
              flexDirection: 'row',
              gap: 16,
            }}>
            {bottomLinks.map((link) => (
              <Pressable key={link.label} onPress={() => handleNavigation(link.route)}>
                <Text
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    color: C.primaryDark,
                    fontWeight: '600',
                    fontSize: 12,
                  }}>
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      {/* <View
        style={{
          fontFamily: 'Poppins_400Regular',
          backgroundColor: C.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.06)',
          width: '100%', 
          marginTop: 20
        }}>
        <Pressable
          onPress={() => Linking.openURL('https://www.infoseeksoftwaresystems.com/')}
          style={({ pressed }) => ({
            fontFamily: 'Poppins_400Regular',
            flexDirection: 'row',
            alignItems: 'center',
            opacity: pressed ? 0.6 : 1,
          })}>
          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 13,
              fontWeight: '500',
              color: C.primary,
              letterSpacing: 0.2,
            }}>
            Powered by{' '}
          </Text>

          <Text
            style={{
              fontFamily: 'Poppins_400Regular',
              fontSize: 15,
              fontWeight: '500',
              color: '#111827',
              letterSpacing: 0.3,
            }}>
            Infoseek
          </Text>
        </Pressable>
      </View> */}
    </View>
  );
}
