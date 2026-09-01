import C from '@/utils/theme';

import { Image, Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';

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
    {
      label: 'Cookies',
      route: '/cookies',
    },
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
        backgroundColor: C.primaryDark,

        paddingHorizontal: px,

        paddingTop: isMobile ? 32 : 48,

        paddingBottom: 24,
      }}>
      {/* ═══════════════════════════════════════
          TOP SECTION
      ═══════════════════════════════════════ */}

      <View
        style={{
          flexDirection: isMobile ? 'column' : 'row',

          gap: isMobile ? 28 : 40,

          marginBottom: 32,
        }}>
        {/* ─────────────────────────────────────
            BRAND
        ───────────────────────────────────── */}

        <View
          style={{
            flex: isMobile ? undefined : 2,
          }}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              gap: 10,

              marginBottom: 12,
            }}>
            <Image
              source={require('../../assets/medisheild-white.png')}
              style={{
                width: isMobile ? 100 : isTablet ? 115 : 130,
                height: isMobile ? 44 : 46,
                marginLeft: isMobile ? 0 : -12,
                resizeMode: 'contain',
              }}
            />
          </View>

          <Text
            style={{
              color: '#ffffff',

              fontSize: 14,

              lineHeight: 22,

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
            flexDirection: 'row',

            flex: isMobile ? undefined : 3,

            gap: 20,

            flexWrap: 'wrap',
          }}>
          {footerColumns.map((column) => (
            <View
              key={column.heading}
              style={{
                flex: 1,

                minWidth: 100,
              }}>
              <Text
                style={{
                  fontSize: 12,

                  fontWeight: '800',

                  color: '#fff',

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
                    marginBottom: 10,

                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',

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
          borderTopWidth: 1,

          borderTopColor: 'rgba(255,255,255,0.1)',

          paddingTop: 18,

          flexDirection: isMobile ? 'column' : 'row',

          justifyContent: 'space-between',

          alignItems: isMobile ? 'flex-start' : 'center',

          gap: isMobile ? 10 : 0,
        }}>
        <Text
          style={{
            color: '#ffffff',

            fontSize: 12,
          }}>
          © 2026 MediShield · All rights reserved.
        </Text>

        <View
          style={{
            flexDirection: 'row',

            gap: 16,
          }}>
          {bottomLinks.map((link) => (
            <Pressable key={link.label} onPress={() => handleNavigation(link.route)}>
              <Text
                style={{
                  color: '#ffffff',

                  fontSize: 12,
                }}>
                {link.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
