import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBreakpoint from '@/utils/breakpoints';
import C from '@/utils/theme';
import WebHeader from 'components/Header/header.web';
import Footer from 'components/Footer/Footer';

// ============================================================
// CLINIC SETUP PAGE
// ============================================================

export default function NewClinicSetup() {
  const router = useRouter();

  const { isMobile, isTablet, px } = useBreakpoint();

  // ==========================================================
  // SETUP STEPS
  // ==========================================================

  const setupSteps = [
    {
      number: '01',
      icon: 'business-outline',
      title: 'Plan Your Clinic',
      description: 'Start with the right plan for your clinic size, specialty and workflow.',
    },
    {
      number: '02',
      icon: 'construct-outline',
      title: 'Choose Equipment',
      description: 'Select essential dental equipment and instruments based on your requirements.',
    },
    {
      number: '03',
      icon: 'flask-outline',
      title: 'Stock Materials',
      description: 'Build your initial inventory with everyday consumables and clinical materials.',
    },
    {
      number: '04',
      icon: 'rocket-outline',
      title: 'Get Ready to Open',
      description: 'Organise your essentials and get your clinic ready to welcome patients.',
    },
  ];

  // ==========================================================
  // CLINIC ESSENTIALS
  // ==========================================================

  const essentials = [
    {
      icon: 'medkit-outline',
      title: 'Dental Equipment',
      text: 'Chairs, compressors, suction systems and other essential equipment.',
      count: 'Essential',
    },
    {
      icon: 'construct-outline',
      title: 'Instruments',
      text: 'Hand instruments and clinical tools for your everyday procedures.',
      count: 'Core setup',
    },
    {
      icon: 'flask-outline',
      title: 'Dental Materials',
      text: 'Consumables and materials required for routine dental treatments.',
      count: 'Daily use',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Safety & Infection Control',
      text: 'Products that help maintain hygiene, sterilization and clinical safety.',
      count: 'Must have',
    },
  ];

  // ==========================================================
  // BENEFITS
  // ==========================================================

  const benefits = [
    {
      icon: 'checkmark-circle-outline',
      title: 'Curated essentials',
      text: 'Focus on what your clinic actually needs.',
    },
    {
      icon: 'pricetag-outline',
      title: 'Better value',
      text: 'Build your setup without unnecessary purchases.',
    },
    {
      icon: 'time-outline',
      title: 'Save time',
      text: 'Find your clinic essentials in one place.',
    },
  ];

  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        flex: 1,
        backgroundColor: '#f8fafc',
      }}>
      <WebHeader/> 
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // paddingBottom: 70,
        }}>
        {/* ====================================================
            HERO
        ===================================================== */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            backgroundColor: C.primaryDark,
            paddingHorizontal: px,
            paddingTop: isMobile ? 38 : 58,
            paddingBottom: isMobile ? 40 : 55,
            overflow: 'hidden',
          }}>
          {/* Decorative circle */}

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              position: 'absolute',

              width: isMobile ? 260 : 500,
              height: isMobile ? 260 : 500,

              borderRadius: 999,

              borderWidth: 1,

              borderColor: 'rgba(94,234,212,0.12)',

              right: isMobile ? -150 : -180,
              top: isMobile ? -90 : -220,
            }}
          />

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              position: 'absolute',

              width: isMobile ? 150 : 260,
              height: isMobile ? 150 : 260,

              borderRadius: 999,

              backgroundColor: C.primary,

              opacity: 0.16,

              right: isMobile ? -50 : 80,
              bottom: isMobile ? -100 : -150,
            }}
          />

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: '100%',
              maxWidth: 1180,
              alignSelf: 'center',

              flexDirection: isMobile ? 'column' : 'row',

              alignItems: isMobile ? 'flex-start' : 'center',

              gap: isMobile ? 28 : 50,
            }}>
            {/* Hero copy */}

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,
                zIndex: 2,
              }}>
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,

                  marginBottom: 14,
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    width: 7,
                    height: 7,

                    borderRadius: 4,

                    backgroundColor: '#ffffff',
                  }}
                />

                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    color: '#ffffff',

                    fontSize: 10,

                    fontWeight: '900',

                    letterSpacing: 1.8,
                  }}>
                  NEW CLINIC SETUP
                </Text>
              </View>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#fff',

                  fontSize: isMobile ? 35 : isTablet ? 43 : 52,

                  lineHeight: isMobile ? 42 : isTablet ? 51 : 60,

                  fontWeight: '900',

                  letterSpacing: -1.7,

                  maxWidth: 650,

                  marginBottom: 15,
                }}>
                Everything you need
                {'\n'}
                to start your clinic.
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#fff',
                  fontSize: isMobile ? 14 : 15,
                  lineHeight: 24,
                  maxWidth: 570,
                  marginBottom: 24,
                }}>
                From essential equipment to everyday clinical supplies, build your new dental clinic
                with the right products from day one.
              </Text>

              {/* CTA */}

              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 10,
                }}>
                <Pressable
                  onPress={() => router.push('/shop')}
                  style={{ fontFamily : 'Poppins_400Regular',
                    backgroundColor: '#fff',

                    paddingHorizontal: 20,
                    paddingVertical: 12,

                    borderRadius: 9,

                    flexDirection: 'row',
                    alignItems: 'center',

                    gap: 8,
                  }}>
                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      color: C.primaryDark,

                      fontSize: 13,

                      fontWeight: '900',
                    }}>
                    Explore Products
                  </Text>

                  <Ionicons name="arrow-forward" size={15} color={C.primaryDark} />
                </Pressable>

                <Pressable
                  style={{ fontFamily : 'Poppins_400Regular',
                    paddingHorizontal: 18,
                    paddingVertical: 11,

                    borderRadius: 9,

                    borderWidth: 1,

                    borderColor: 'rgba(255,255,255,0.22)',

                    flexDirection: 'row',
                    alignItems: 'center',

                    gap: 8,
                  }}>
                  <Ionicons name="call-outline" size={15} color="#b8e9e4" />

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      color: '#d7f5f2',

                      fontSize: 13,

                      fontWeight: '700',
                    }}>
                    Talk to an Expert
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Hero visual */}

            {!isMobile && (
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  width: isTablet ? 250 : 320,

                  height: 260,

                  alignItems: 'center',
                  justifyContent: 'center',

                  zIndex: 2,
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    width: isTablet ? 190 : 220,

                    height: isTablet ? 190 : 220,

                    borderRadius: 999,

                    backgroundColor: 'rgba(255,255,255,0.06)',

                    borderWidth: 1,

                    borderColor: 'rgba(255,255,255,0.13)',

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="business-outline" size={isTablet ? 70 : 82} color="#ffffff" />

                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      position: 'absolute',

                      width: 55,
                      height: 55,

                      borderRadius: 28,

                      backgroundColor: '#fff',

                      alignItems: 'center',
                      justifyContent: 'center',

                      right: -5,
                      bottom: 18,
                    }}>
                    <Ionicons name="checkmark" size={27} color={C.primary} />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ====================================================
            INTRO
        ===================================================== */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',

            paddingHorizontal: px,

            paddingTop: isMobile ? 42 : 58,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: isMobile ? 'column' : 'row',

              gap: isMobile ? 25 : 70,

              alignItems: isMobile ? 'flex-start' : 'flex-end',

              paddingBottom: 35,

              borderBottomWidth: 1,
              borderBottomColor: '#e2e8f0',
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,
              }}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: C.primary,

                  fontSize: 10,

                  fontWeight: '900',

                  letterSpacing: 1.5,

                  marginBottom: 9,
                }}>
                A SIMPLE WAY TO START
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: C.text,

                  fontSize: isMobile ? 25 : 31,

                  lineHeight: isMobile ? 32 : 39,

                  fontWeight: '900',

                  letterSpacing: -0.7,
                }}>
                Set up your clinic without the guesswork.
              </Text>
            </View>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,

                color: C.textSecondary,

                fontSize: 14,

                lineHeight: 24,

                maxWidth: 550,
              }}>
              Starting a new clinic involves hundreds of small decisions. We've organised the major
              essentials into a simple setup journey so you can focus on your practice.
            </Text>
          </View>
        </View>

        {/* ====================================================
            SETUP STEPS
        ===================================================== */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',

            paddingHorizontal: px,

            paddingTop: 36,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: isMobile ? 'column' : 'row',

              gap: isMobile ? 0 : 18,
            }}>
            {setupSteps.map((step, index) => (
              <View
                key={step.number}
                style={{ fontFamily : 'Poppins_400Regular',
                  flex: 1,

                  paddingVertical: isMobile ? 18 : 22,

                  paddingHorizontal: isMobile ? 0 : 18,

                  borderBottomWidth: isMobile ? 1 : 0,

                  borderBottomColor: '#e2e8f0',
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: isMobile ? 'row' : 'column',

                    gap: isMobile ? 14 : 0,
                  }}>
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      width: 42,
                      height: 42,

                      borderRadius: 12,

                      backgroundColor: C.primaryLight,

                      alignItems: 'center',
                      justifyContent: 'center',

                      marginBottom: isMobile ? 0 : 17,

                      flexShrink: 0,
                    }}>
                    <Ionicons name={step.icon} size={19} color={C.primary} />
                  </View>

                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      flex: 1,
                    }}>
                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: '#94a3b8',

                        fontSize: 10,

                        fontWeight: '900',

                        letterSpacing: 1,

                        marginBottom: 5,
                      }}>
                      {step.number}
                    </Text>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: C.text,

                        fontSize: 16,

                        fontWeight: '800',

                        marginBottom: 7,
                      }}>
                      {step.title}
                    </Text>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: C.muted,

                        fontSize: 12,

                        lineHeight: 19,

                        maxWidth: 240,
                      }}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ====================================================
            ESSENTIALS
        ===================================================== */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',

            paddingHorizontal: px,

            marginTop: isMobile ? 50 : 70,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              marginBottom: 24,
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: C.primary,

                fontSize: 10,

                fontWeight: '900',

                letterSpacing: 1.5,

                marginBottom: 8,
              }}>
              CLINIC ESSENTIALS
            </Text>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: C.text,

                fontSize: isMobile ? 25 : 31,

                fontWeight: '900',

                letterSpacing: -0.7,
              }}>
              Start with the essentials.
            </Text>
          </View>

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: 'row',
              flexWrap: 'wrap',

              columnGap: 30,
              rowGap: 0,
            }}>
            {essentials.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => router.push('/shop')}
                style={{ fontFamily : 'Poppins_400Regular',
                  width: isMobile ? '100%' : isTablet ? '47%' : '48%',

                  paddingVertical: 23,

                  borderTopWidth: 1,

                  borderTopColor: '#e2e8f0',
                }}>
                <View
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',

                    alignItems: 'flex-start',

                    gap: 15,
                  }}>
                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      width: 42,
                      height: 42,

                      borderRadius: 10,

                      backgroundColor: '#f0fdfa',

                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name={item.icon} size={19} color={C.primary} />
                  </View>

                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      flex: 1,
                    }}>
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        flexDirection: 'row',

                        justifyContent: 'space-between',

                        alignItems: 'center',

                        gap: 10,

                        marginBottom: 5,
                      }}>
                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          color: C.text,

                          fontSize: 15,

                          fontWeight: '800',
                        }}>
                        {item.title}
                      </Text>

                      <Ionicons name="arrow-forward" size={14} color="#94a3b8" />
                    </View>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: C.muted,

                        fontSize: 12,

                        lineHeight: 19,

                        marginBottom: 6,
                      }}>
                      {item.text}
                    </Text>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: C.primary,

                        fontSize: 10,

                        fontWeight: '800',

                        letterSpacing: 0.5,
                      }}>
                      {item.count.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ====================================================
            BENEFITS
        ===================================================== */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',

            paddingHorizontal: px,

            marginTop: isMobile ? 50 : 70,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: C.primaryDark,

              borderRadius: isMobile ? 18 : 22,

              padding: isMobile ? 22 : 32,

              flexDirection: isMobile ? 'column' : 'row',

              gap: isMobile ? 25 : 40,
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,
              }}>
              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#ffffff',

                  fontSize: 10,

                  fontWeight: '900',

                  letterSpacing: 1.5,

                  marginBottom: 10,
                }}>
                WHY MEDISHIELD
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#fff',

                  fontSize: isMobile ? 23 : 28,

                  lineHeight: isMobile ? 30 : 36,

                  fontWeight: '900',

                  letterSpacing: -0.6,

                  marginBottom: 8,
                }}>
                Build smarter. Start stronger.
              </Text>

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#fff',

                  fontSize: 12,

                  lineHeight: 20,

                  maxWidth: 390,
                }}>
                Everything you need to get your clinic ready, without making the process
                complicated.
              </Text>
            </View>

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,

                gap: 18,
              }}>
              {benefits.map((item) => (
                <View
                  key={item.title}
                  style={{ fontFamily : 'Poppins_400Regular',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}>
                  <Ionicons name={item.icon} size={20} color="#ffffff" />

                  <View
                    style={{ fontFamily : 'Poppins_400Regular',
                      flex: 1,
                    }}>
                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: '800',
                        marginBottom: 3,
                      }}>
                      {item.title}
                    </Text>

                    <Text
                      style={{ fontFamily : 'Poppins_400Regular',
                        color: '#fff',
                        fontSize: 11,
                        lineHeight: 18,
                      }}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ====================================================
            FINAL CTA
        ===================================================== */}

        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 900,
            alignSelf: 'center',
            paddingHorizontal: px,
            paddingBottom : 50,
            marginTop: isMobile ? 55 : 75,
            alignItems: 'center',
          }}>
          <Ionicons name="business-outline" size={28} color={C.primary} />

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              color: C.text,
              fontSize: isMobile ? 24 : 30,
              fontWeight: '900',
              letterSpacing: -0.7,
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 9,
            }}>
            Ready to build your clinic?
          </Text>

          <Text
            style={{ fontFamily : 'Poppins_400Regular',
              color: C.muted,
              fontSize: 13,
              lineHeight: 21,
              textAlign: 'center',
              maxWidth: 520,
              marginBottom: 20,
            }}>
            Explore our complete range of dental products and start building your clinic with
            confidence.
          </Text>

          <Pressable
            onPress={() => router.push('/shop')}
            style={{ fontFamily : 'Poppins_400Regular',
              backgroundColor: C.primary,
              paddingHorizontal: 22,
              paddingVertical: 12,
              borderRadius: 9,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: '#fff',
                fontSize: 13,
                fontWeight: '900',
              }}>
              Start Your Setup
            </Text>

            <Ionicons name="arrow-forward" size={15} color="#fff" />
          </Pressable>
        </View>
        <Footer/>
      </ScrollView>
    </View>
  );
}
