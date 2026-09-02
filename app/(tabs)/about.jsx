import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import WebHeader from 'components/Header/header.web';
import Footer from 'components/Footer/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  teal900: '#CD0F0F',
  teal800: '#115e59',
  teal700: '#CD0F0F',
  teal600: '#0d9488',
  teal500: '#14b8a6',
  teal100: '#ccfbf1',
  teal50: '#f0fdfa',

  slate950: '#020617',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',

  white: '#ffffff',

  green500: '#22c55e',
  green100: '#dcfce7',

  amber500: '#f59e0b',
  amber100: '#fef3c7',

  bg: '#f0fafa',
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Trusted Quality',
    description:
      'We focus on bringing reliable dental-care products together in one convenient place.',
  },
  {
    icon: 'medical-outline',
    title: 'Dental Focused',
    description:
      'From everyday oral care to professional dental essentials, MediShield is built around dental needs.',
  },
  {
    icon: 'cart-outline',
    title: 'Easy Shopping',
    description:
      'Discover products, compare options and place your order through a simple shopping experience.',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Secure Checkout',
    description:
      'Your checkout experience is designed with secure payments and a smooth ordering process in mind.',
  },
];

const categories = [
  {
    icon: 'sparkles-outline',
    title: 'Oral Care',
    description: 'Everyday essentials for maintaining a healthy and confident smile.',
  },
  {
    icon: 'medkit-outline',
    title: 'Dental Essentials',
    description: 'Practical products designed to support everyday dental-care routines.',
  },
  {
    icon: 'fitness-outline',
    title: 'Dental Hygiene',
    description: 'Products that help make oral hygiene a consistent part of your routine.',
  },
  {
    icon: 'business-outline',
    title: 'Professional Care',
    description: 'Dental-focused products for professionals and healthcare needs.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STAT ITEM
// ─────────────────────────────────────────────────────────────────────────────

function StatItem({ value, label, icon }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        alignItems: 'center',
        paddingHorizontal: 12,
      }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: T.teal50,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Ionicons name={icon} size={21} color={T.teal700} />
      </View>

      <Text
        style={{
          fontSize: 23,
          fontWeight: '900',
          color: T.slate900,
        }}>
        {value}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: T.slate500,
          marginTop: 3,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BENEFIT CARD
// ─────────────────────────────────────────────────────────────────────────────

function BenefitCard({ icon, title, description }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 220,
        backgroundColor: T.white,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: T.slate100,
        padding: 22,

        ...(Platform.OS === 'web'
          ? {
              boxShadow: '0 5px 22px rgba(15,23,42,0.06)',
            }
          : {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }),
      }}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: T.teal50,
          borderWidth: 1,
          borderColor: T.teal100,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 17,
        }}>
        <Ionicons name={icon} size={22} color={T.teal700} />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: '900',
          color: T.slate900,
          marginBottom: 7,
        }}>
        {title}
      </Text>

      <Text
        style={{
          fontSize: 12,
          lineHeight: 19,
          color: T.slate500,
        }}>
        {description}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CARD
// ─────────────────────────────────────────────────────────────────────────────

function CategoryCard({ icon, title, description }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 220,
        borderRadius: 18,
        backgroundColor: T.slate50,
        borderWidth: 1,
        borderColor: T.slate100,
        padding: 20,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          backgroundColor: T.white,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,

          ...(Platform.OS === 'web'
            ? {
                boxShadow: '0 3px 12px rgba(15,23,42,0.05)',
              }
            : {}),
        }}>
        <Ionicons name={icon} size={20} color={T.teal700} />
      </View>

      <Text
        style={{
          fontSize: 15,
          fontWeight: '900',
          color: T.slate900,
          marginBottom: 6,
        }}>
        {title}
      </Text>

      <Text
        style={{
          fontSize: 12,
          lineHeight: 18,
          color: T.slate500,
        }}>
        {description}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 700 && width < 1024;
  const isMobile = width < 700;

  const horizontalPadding = isDesktop ? 60 : isTablet ? 32 : 18;

  const maxWidth = 1280;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: T.white,
      }}>
      {/* ─────────────────────────────────────────────────────────────────────
          HEADER
      ───────────────────────────────────────────────────────────────────── */}

      {Platform.OS === 'web' ? (
        <WebHeader />
      ) : (
        <View
          style={{
            height: 58,
            paddingHorizontal: 18,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: T.slate100,
            backgroundColor: T.white,
          }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              backgroundColor: T.slate50,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: T.slate200,
            }}>
            <Ionicons name="arrow-back" size={20} color={T.slate700} />
          </Pressable>

          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              marginRight: 38,
              fontSize: 17,
              fontWeight: '900',
              color: T.slate900,
            }}>
            About MediShield
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            // paddingBottom: 70,
          }
        }>
        {/* ─────────────────────────────────────────────────────────────────
            HERO
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            backgroundColor: T.teal50,
            borderBottomWidth: 1,
            borderBottomColor: T.teal100,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth,
              alignSelf: 'center',
              paddingHorizontal: horizontalPadding,
              paddingTop: isMobile ? 52 : 82,
              paddingBottom: isMobile ? 55 : 85,

              flexDirection: isDesktop ? 'row' : 'column',

              alignItems: 'center',
              gap: isDesktop ? 60 : 35,
            }}>
            {/* HERO CONTENT */}

            <View
              style={{
                flex: 1,
                alignItems: isDesktop ? 'flex-start' : 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: T.white,
                  borderWidth: 1,
                  borderColor: T.teal100,
                  borderRadius: 30,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: T.teal600,
                    marginRight: 7,
                  }}
                />

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    color: T.teal700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}>
                  Dental Care Made Simple
                </Text>
              </View>

              <Text
                style={{
                  fontSize: isMobile ? 39 : 52,
                  lineHeight: isMobile ? 45 : 58,
                  fontWeight: '900',
                  color: T.slate900,
                  letterSpacing: -1.7,
                  textAlign: isDesktop ? 'left' : 'center',
                }}>
                Better Dental Care.
              </Text>

              <Text
                style={{
                  fontSize: isMobile ? 27 : 36,
                  lineHeight: isMobile ? 34 : 43,
                  fontWeight: '800',
                  color: T.teal700,
                  letterSpacing: -1,
                  textAlign: isDesktop ? 'left' : 'center',
                }}>
                All in One Place.
              </Text>

              <Text
                style={{
                  maxWidth: 580,
                  fontSize: 14,
                  lineHeight: 23,
                  color: T.slate500,
                  marginTop: 18,
                  textAlign: isDesktop ? 'left' : 'center',
                }}>
                MediShield brings dental-care essentials closer to you with a simple, reliable and
                convenient online shopping experience.
              </Text>

              <View
                style={{
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 10,
                  marginTop: 27,
                  width: isMobile ? '100%' : undefined,
                }}>
                <Pressable
                  onPress={() => router.push('/shop')}
                  style={{
                    backgroundColor: T.teal700,
                    borderRadius: 13,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,

                    ...(Platform.OS === 'web'
                      ? {
                          cursor: 'pointer',
                          boxShadow: '0 7px 20px rgba(15,118,110,0.22)',
                        }
                      : {}),
                  }}>
                  <Text
                    style={{
                      color: T.white,
                      fontSize: 13,
                      fontWeight: '900',
                    }}>
                    Explore Products
                  </Text>

                  <Ionicons name="arrow-forward" size={16} color={T.white} />
                </Pressable>

                <Pressable
                  onPress={() => router.push('/')}
                  style={{
                    borderRadius: 13,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: T.slate200,
                    backgroundColor: T.white,
                  }}>
                  <Text
                    style={{
                      color: T.slate700,
                      fontSize: 13,
                      fontWeight: '800',
                    }}>
                    Back to Home
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* HERO VISUAL */}

            <View
              style={{
                width: isDesktop ? 450 : isMobile ? '100%' : 430,
                height: isMobile ? 300 : 380,
                borderRadius: 30,
                backgroundColor: T.white,
                borderWidth: 1,
                borderColor: T.teal100,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',

                ...(Platform.OS === 'web'
                  ? {
                      boxShadow: '0 15px 45px rgba(15,118,110,0.10)',
                    }
                  : {
                      shadowColor: T.teal700,
                      shadowOffset: {
                        width: 0,
                        height: 8,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 20,
                      elevation: 6,
                    }),
              }}>
              {/* Decorative circles */}

              <View
                style={{
                  position: 'absolute',
                  width: 280,
                  height: 280,
                  borderRadius: 140,
                  backgroundColor: T.teal50,
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  width: 190,
                  height: 190,
                  borderRadius: 95,
                  backgroundColor: T.teal100,
                  opacity: 0.7,
                }}
              />

              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 38,
                  backgroundColor: T.teal700,
                  alignItems: 'center',
                  justifyContent: 'center',

                  transform: [
                    {
                      rotate: '-5deg',
                    },
                  ],
                }}>
                <Ionicons name="medical-outline" size={64} color={T.white} />
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 27,
                  left: 25,
                  backgroundColor: T.white,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,

                  ...(Platform.OS === 'web'
                    ? {
                        boxShadow: '0 5px 18px rgba(15,23,42,0.08)',
                      }
                    : {}),
                }}>
                <Ionicons name="shield-checkmark" size={17} color={T.green500} />

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    color: T.slate800,
                  }}>
                  Care You Can Trust
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  top: 27,
                  right: 25,
                  backgroundColor: T.white,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,

                  ...(Platform.OS === 'web'
                    ? {
                        boxShadow: '0 5px 18px rgba(15,23,42,0.08)',
                      }
                    : {}),
                }}>
                <Ionicons name="cart" size={17} color={T.teal700} />

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    color: T.slate800,
                  }}>
                  Easy Shopping
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            STATS
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            width: '100%',
            maxWidth: 1050,
            alignSelf: 'center',
            paddingHorizontal: horizontalPadding,
            paddingVertical: 28,

            flexDirection: isMobile ? 'column' : 'row',

            gap: isMobile ? 22 : 0,
          }}>
          <StatItem value="24/7" label="Convenient Access" icon="time-outline" />

          <StatItem value="100%" label="Dental Focused" icon="heart-outline" />

          <StatItem value="Secure" label="Shopping Experience" icon="lock-closed-outline" />

          <StatItem value="Easy" label="Order & Checkout" icon="flash-outline" />
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            ABOUT US
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            backgroundColor: T.slate50,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: T.slate100,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth,
              alignSelf: 'center',
              paddingHorizontal: horizontalPadding,
              paddingVertical: isMobile ? 55 : 80,

              flexDirection: isDesktop ? 'row' : 'column',

              gap: isDesktop ? 65 : 30,
            }}>
            {/* LEFT */}

            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                About MediShield
              </Text>

              <Text
                style={{
                  fontSize: isMobile ? 28 : 34,
                  lineHeight: isMobile ? 35 : 42,
                  fontWeight: '900',
                  color: T.slate900,
                  letterSpacing: -0.8,
                }}>
                Making dental care easier for everyone.
              </Text>
            </View>

            {/* RIGHT */}

            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  color: T.slate600,
                  marginBottom: 16,
                }}>
                MediShield is built with one simple idea: dental care should be easier to discover,
                understand and access.
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  color: T.slate600,
                  marginBottom: 16,
                }}>
                Our platform brings dental-care products together in a convenient online experience,
                helping customers find the essentials they need without making the shopping process
                complicated.
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  color: T.slate600,
                }}>
                Whether you are maintaining your everyday oral-care routine or looking for dental
                essentials, MediShield is designed to make the journey simple and dependable.
              </Text>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            WHY MEDISHIELD
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            width: '100%',
            maxWidth,
            alignSelf: 'center',
            paddingHorizontal: horizontalPadding,
            paddingVertical: isMobile ? 55 : 80,
          }}>
          <View
            style={{
              alignItems: isMobile ? 'flex-start' : 'center',
              marginBottom: 32,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                color: T.teal700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
              Why MediShield
            </Text>

            <Text
              style={{
                fontSize: isMobile ? 28 : 34,
                fontWeight: '900',
                color: T.slate900,
                letterSpacing: -0.8,
                textAlign: isMobile ? 'left' : 'center',
              }}>
              Built around your care.
            </Text>

            <Text
              style={{
                maxWidth: 600,
                fontSize: 13,
                lineHeight: 21,
                color: T.slate500,
                marginTop: 9,
                textAlign: isMobile ? 'left' : 'center',
              }}>
              A thoughtful shopping experience designed around quality, convenience and trust.
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 14,
            }}>
            {benefits.map((item) => (
              <BenefitCard key={item.title} {...item} />
            ))}
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            WHAT WE OFFER
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            backgroundColor: T.teal900,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth,
              alignSelf: 'center',
              paddingHorizontal: horizontalPadding,
              paddingVertical: isMobile ? 55 : 80,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                color: T.teal100,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
              What We Offer
            </Text>

            <Text
              style={{
                fontSize: isMobile ? 28 : 35,
                fontWeight: '900',
                color: T.white,
                letterSpacing: -0.8,
                maxWidth: 600,
              }}>
              Everything you need for a better oral-care routine.
            </Text>

            <Text
              style={{
                maxWidth: 650,
                fontSize: 13,
                lineHeight: 21,
                color: '#b8dedb',
                marginTop: 10,
                marginBottom: 30,
              }}>
              Explore a growing range of dental and oral-care essentials selected to make everyday
              care easier.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 13,
              }}>
              {categories.map((item) => (
                <View
                  key={item.title}
                  style={{
                    flex: 1,
                    minWidth: 220,
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.10)',
                    borderRadius: 18,
                    padding: 20,
                  }}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 13,
                      backgroundColor: 'rgba(255,255,255,0.10)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 15,
                    }}>
                    <Ionicons name={item.icon} size={20} color={T.teal100} />
                  </View>

                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '900',
                      color: T.white,
                      marginBottom: 6,
                    }}>
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 19,
                      color: '#b8dedb',
                    }}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            MISSION + VISION
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            width: '100%',
            maxWidth,
            alignSelf: 'center',
            paddingHorizontal: horizontalPadding,
            paddingVertical: isMobile ? 55 : 80,
          }}>
          <View
            style={{
              flexDirection: isDesktop ? 'row' : 'column',
              gap: 15,
            }}>
            {/* MISSION */}

            <View
              style={{
                flex: 1,
                backgroundColor: T.teal50,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: T.teal100,
                padding: isMobile ? 23 : 30,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  backgroundColor: T.teal700,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                <Ionicons name="flag-outline" size={23} color={T.white} />
              </View>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal700,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                Our Mission
              </Text>

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: T.slate900,
                  lineHeight: 29,
                  marginBottom: 10,
                }}>
                Simplify access to better dental care.
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: T.slate500,
                  lineHeight: 21,
                }}>
                We aim to create a convenient and dependable dental shopping experience where
                customers can discover the products they need with confidence.
              </Text>
            </View>

            {/* VISION */}

            <View
              style={{
                flex: 1,
                backgroundColor: T.slate900,
                borderRadius: 22,
                padding: isMobile ? 23 : 30,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  backgroundColor: T.teal700,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                <Ionicons name="eye-outline" size={23} color={T.white} />
              </View>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal100,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                Our Vision
              </Text>

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: T.white,
                  lineHeight: 29,
                  marginBottom: 10,
                }}>
                A trusted destination for dental wellness.
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: '#aab5c4',
                  lineHeight: 21,
                }}>
                We envision a future where finding trusted dental-care products is as simple as a
                few clicks, helping more people make oral care part of their everyday life.
              </Text>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            TRUST SECTION
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            backgroundColor: T.slate50,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: T.slate100,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth: 1100,
              alignSelf: 'center',
              paddingHorizontal: horizontalPadding,
              paddingVertical: isMobile ? 50 : 70,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 18,
                backgroundColor: T.teal100,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 17,
              }}>
              <Ionicons name="shield-checkmark-outline" size={28} color={T.teal700} />
            </View>

            <Text
              style={{
                fontSize: isMobile ? 27 : 34,
                fontWeight: '900',
                color: T.slate900,
                letterSpacing: -0.8,
                textAlign: 'center',
              }}>
              Your care comes first.
            </Text>

            <Text
              style={{
                maxWidth: 650,
                fontSize: 13,
                lineHeight: 22,
                color: T.slate500,
                textAlign: 'center',
                marginTop: 10,
              }}>
              From discovering products to completing your order, MediShield is designed to keep the
              experience simple, transparent and convenient.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 10,
                marginTop: 25,
              }}>
              {[
                {
                  icon: 'checkmark-circle-outline',
                  text: 'Simple Experience',
                },
                {
                  icon: 'lock-closed-outline',
                  text: 'Secure Payments',
                },
                {
                  icon: 'medical-outline',
                  text: 'Dental Focused',
                },
                {
                  icon: 'headset-outline',
                  text: 'Customer Support',
                },
              ].map((item) => (
                <View
                  key={item.text}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                    backgroundColor: T.white,
                    borderWidth: 1,
                    borderColor: T.slate200,
                    borderRadius: 30,
                    paddingHorizontal: 13,
                    paddingVertical: 8,
                  }}>
                  <Ionicons name={item.icon} size={15} color={T.teal700} />

                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: T.slate700,
                    }}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            CTA
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            width: '100%',
            maxWidth,
            alignSelf: 'center',
            paddingHorizontal: horizontalPadding,
            paddingTop: isMobile ? 50 : 75,
          }}>
          <View
            style={{
              backgroundColor: T.teal700,
              borderRadius: 26,
              paddingHorizontal: isMobile ? 23 : 50,
              paddingVertical: isMobile ? 35 : 48,

              flexDirection: isDesktop ? 'row' : 'column',

              alignItems: isDesktop ? 'center' : 'flex-start',

              justifyContent: 'space-between',
              gap: 25,

              overflow: 'hidden',
              position: 'relative',
            }}>
            {/* Decorative circle */}

            <View
              style={{
                position: 'absolute',
                width: 250,
                height: 250,
                borderRadius: 125,
                backgroundColor: 'rgba(255,255,255,0.06)',
                right: -80,
                top: -100,
              }}
            />

            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal100,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: 9,
                }}>
                Ready to take care?
              </Text>

              <Text
                style={{
                  fontSize: isMobile ? 27 : 34,
                  lineHeight: isMobile ? 34 : 41,
                  fontWeight: '900',
                  color: T.white,
                  letterSpacing: -0.7,
                }}>
                Find the right products for your dental care.
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: '#c4e7e4',
                  lineHeight: 20,
                  marginTop: 9,
                  maxWidth: 600,
                }}>
                Explore MediShield and make your everyday dental-care routine simpler.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push('/shop')}
              style={{
                backgroundColor: T.white,
                borderRadius: 13,
                paddingHorizontal: 23,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minWidth: isMobile ? '100%' : 170,
              }}>
              <Text
                style={{
                  color: T.teal700,
                  fontSize: 13,
                  fontWeight: '900',
                }}>
                Shop Now
              </Text>

              <Ionicons name="arrow-forward" size={16} color={T.teal700} />
            </Pressable>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            FOOTER BRAND LINE
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: horizontalPadding,
            paddingTop: 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                backgroundColor: T.teal700,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="medical-outline" size={16} color={T.white} />
            </View>

            <Text
              style={{
                fontSize: 15,
                fontWeight: '900',
                color: T.slate900,
              }}>
              Medi
              <Text
                style={{
                  color: T.teal700,
                }}>
                Shield
              </Text>
            </Text>
          </View>

          <Text
            style={{
              fontSize: 10,
              color: T.slate400,
              marginTop: 8,
              textAlign: 'center',
              marginBottom: 40,
            }}>
            Better dental care. Simpler shopping.
          </Text>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
