import React from 'react';
import { ScrollView, View, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const C = {
  primary: '#CD0F0F',
  primaryDark: '#CD0F0F',
  primaryLight: '#ccfbf1',

  white: '#ffffff',
  background: '#f8fafc',

  text: '#0f172a',
  textSecondary: '#475569',
  muted: '#64748b',

  border: '#e2e8f0',
};

const sections = [
  {
    number: '01',
    title: 'Acceptance of Terms',
    content:
      'By accessing or using the MediShield website, mobile application, or related services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.',
  },
  {
    number: '02',
    title: 'Use of Our Services',
    content:
      'You agree to use our website and services only for lawful purposes and in accordance with these Terms & Conditions. You must not use the platform in a way that could damage, disable, overburden, or interfere with the operation of our services.',
    bullets: [
      'Provide accurate information when creating an account or placing an order.',
      'Keep your account credentials secure.',
      'Do not attempt to gain unauthorized access to our systems.',
      'Do not use the platform for fraudulent or unlawful activities.',
    ],
  },
  {
    number: '03',
    title: 'Products & Product Information',
    content:
      'We make reasonable efforts to ensure that product descriptions, images, prices, availability, specifications, and other information displayed on our platform are accurate. However, occasional errors or variations may occur.',
    bullets: [
      'Product images may differ slightly from the actual product.',
      'Product availability may change without prior notice.',
      'Specifications may be updated by manufacturers.',
      'We reserve the right to correct inaccurate information when identified.',
    ],
  },
  {
    number: '04',
    title: 'Product Prices',
    content:
      'Prices displayed on the platform are subject to change without prior notice. The applicable price for an order is the price displayed at the time the order is placed, subject to any applicable taxes, shipping charges, discounts, or promotions.',
  },
  {
    number: '05',
    title: 'Orders & Order Acceptance',
    content:
      'Placing an order constitutes a request to purchase the selected products. An order may be accepted, rejected, or cancelled depending on product availability, pricing errors, payment status, or other operational circumstances.',
    bullets: [
      'We may contact you if additional information is required.',
      'Orders may be cancelled if a product is unavailable.',
      'Orders affected by pricing or inventory errors may be cancelled.',
      'Any applicable refund will be processed according to our refund process.',
    ],
  },
  {
    number: '06',
    title: 'Payments',
    content:
      'Payments are processed through the payment methods made available during checkout. By completing a payment, you confirm that you are authorized to use the selected payment method.',
  },
  {
    number: '07',
    title: 'Shipping & Delivery',
    content:
      'Delivery timelines may vary depending on product availability, destination, shipping partner, and other factors. Delivery estimates are indicative and may be affected by circumstances outside our reasonable control.',
  },
  {
    number: '08',
    title: 'Returns, Replacements & Refunds',
    content:
      'Returns, replacements, and refunds are subject to the applicable return and refund policy of the product and order. Products may need to meet specific eligibility requirements before a return or replacement can be processed.',
    bullets: [
      'Products should be returned in the applicable condition and packaging.',
      'Certain products may not be eligible for return due to their nature.',
      'Requests may require order details and supporting information.',
      'Refund timing may vary depending on the payment method.',
    ],
  },
  {
    number: '09',
    title: 'Account Responsibility',
    content:
      'If you create an account with us, you are responsible for maintaining the confidentiality of your account credentials and for activities carried out through your account. Please notify us promptly if you believe your account has been accessed without authorization.',
  },
  {
    number: '10',
    title: 'Intellectual Property',
    content:
      'The content available on our platform, including text, graphics, logos, images, design elements, software, and other materials, may be protected by intellectual property laws. You may not reproduce, distribute, modify, or commercially exploit such content without appropriate authorization.',
  },
  {
    number: '11',
    title: 'Third-Party Services',
    content:
      'Our services may use or provide access to third-party services such as payment providers, logistics partners, analytics services, or external websites. Your use of such services may also be subject to the terms and policies of those third parties.',
  },
  {
    number: '12',
    title: 'Limitation of Liability',
    content:
      'To the extent permitted by applicable law, MediShield shall not be responsible for indirect, incidental, special, or consequential losses arising from the use of our platform or services. Nothing in these Terms is intended to exclude any liability that cannot legally be excluded.',
  },
  {
    number: '13',
    title: 'Changes to These Terms',
    content:
      'We may update these Terms & Conditions from time to time to reflect changes in our services, business practices, or applicable requirements. Updated terms will be published on this page and will become effective as indicated.',
  },
  {
    number: '14',
    title: 'Governing Law',
    content:
      'These Terms & Conditions shall be interpreted and applied in accordance with the applicable laws and regulations governing the services and transactions provided through our platform.',
  },
  {
    number: '15',
    title: 'Contact Us',
    content:
      'If you have questions regarding these Terms & Conditions, our products, orders, payments, or other services, please contact the MediShield support team.',
  },
];

function TermsAndConditions() {
  const router = useRouter();

  return (
    <View
      style={{ fontFamily : 'Poppins_400Regular',
        flex: 1,
        backgroundColor: C.background,
      }}>
      {/* Header */}
      <View
        style={{ fontFamily : 'Poppins_400Regular',
          backgroundColor: C.white,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}>
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',
            paddingHorizontal: 24,
            paddingVertical: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            onPress={() => router.back()}
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingVertical: 8,
            }}>
            <Ionicons name="arrow-back" size={20} color={C.text} />

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 14,
                fontWeight: '600',
                color: C.text,
              }}>
              Back
            </Text>
          </Pressable>

          <View
            style={{ fontFamily : 'Poppins_400Regular',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: C.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="document-text-outline" size={19} color={C.primary} />
            </View>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 15,
                fontWeight: '800',
                color: C.primaryDark,
              }}>
              MediShield
            </Text>
          </View>

          <View style={{ fontFamily : 'Poppins_400Regular', width: 55 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 70,
        }}>
        {/* Hero */}
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            backgroundColor: C.primaryDark,
            paddingHorizontal: 24,
            paddingVertical: Platform.OS === 'web' ? 68 : 48,
          }}>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              width: '100%',
              maxWidth: 980,
              alignSelf: 'center',
            }}>
            <View
              style={{ fontFamily : 'Poppins_400Regular',
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.10)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 22,
              }}>
              <Ionicons name="document-text-outline" size={24} color="#ffffff" />
            </View>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: '800',
                letterSpacing: 1.5,
                marginBottom: 12,
              }}>
              TERMS OF SERVICE
            </Text>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: C.white,
                fontSize: Platform.OS === 'web' ? 48 : 34,
                lineHeight: Platform.OS === 'web' ? 56 : 42,
                fontWeight: '900',
                letterSpacing: -1,
                marginBottom: 16,
              }}>
              Terms & Conditions
            </Text>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                color: '#b7d9d6',
                fontSize: 15,
                lineHeight: 24,
                maxWidth: 680,
              }}>
              Please read these terms carefully before using our website, application, or services.
            </Text>

            <View
              style={{ fontFamily : 'Poppins_400Regular',
                marginTop: 26,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
              <Ionicons name="calendar-outline" size={15} color="#ffffff" />

              <Text
                style={{ fontFamily : 'Poppins_400Regular',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                Last updated: August 2026
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View
          style={{ fontFamily : 'Poppins_400Regular',
            width: '100%',
            maxWidth: 980,
            alignSelf: 'center',
            paddingHorizontal: 24,
            paddingTop: 44,
          }}>
          {/* Intro */}
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              paddingBottom: 36,
              borderBottomWidth: 1,
              borderBottomColor: C.border,
              marginBottom: 10,
            }}>
            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 20,
                fontWeight: '800',
                color: C.text,
                marginBottom: 12,
              }}>
              Welcome to MediShield
            </Text>

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                fontSize: 15,
                lineHeight: 26,
                color: C.textSecondary,
              }}>
              These Terms & Conditions govern your access to and use of MediShield's website, mobile
              application, products, and related services. By accessing or using our services, you
              agree to comply with these terms.
            </Text>
          </View>

          {/* Sections */}
          {sections.map((section) => (
            <View
              key={section.number}
              style={{ fontFamily : 'Poppins_400Regular',
                paddingVertical: 30,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              }}>
              <View
                style={{ fontFamily : 'Poppins_400Regular',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 18,
                }}>
                {/* Number */}
                <Text
                  style={{ fontFamily : 'Poppins_400Regular',
                    width: 30,
                    fontSize: 12,
                    fontWeight: '800',
                    color: C.primary,
                    paddingTop: 4,
                  }}>
                  {section.number}
                </Text>

                {/* Content */}
                <View style={{ fontFamily : 'Poppins_400Regular', flex: 1 }}>
                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: 20,
                      lineHeight: 27,
                      fontWeight: '800',
                      color: C.text,
                      marginBottom: 12,
                    }}>
                    {section.title}
                  </Text>

                  <Text
                    style={{ fontFamily : 'Poppins_400Regular',
                      fontSize: 14,
                      lineHeight: 24,
                      color: C.textSecondary,
                    }}>
                    {section.content}
                  </Text>

                  {section.bullets && (
                    <View
                      style={{ fontFamily : 'Poppins_400Regular',
                        marginTop: 14,
                        gap: 9,
                      }}>
                      {section.bullets.map((bullet) => (
                        <View
                          key={bullet}
                          style={{ fontFamily : 'Poppins_400Regular',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 10,
                          }}>
                          <View
                            style={{ fontFamily : 'Poppins_400Regular',
                              width: 5,
                              height: 5,
                              borderRadius: 3,
                              backgroundColor: C.primary,
                              marginTop: 9,
                            }}
                          />

                          <Text
                            style={{ fontFamily : 'Poppins_400Regular',
                              flex: 1,
                              fontSize: 14,
                              lineHeight: 23,
                              color: C.textSecondary,
                            }}>
                            {bullet}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {section.number === '15' && (
                    <Pressable
                      style={{ fontFamily : 'Poppins_400Regular',
                        marginTop: 18,
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingVertical: 10,
                      }}>
                      <Ionicons name="mail-outline" size={18} color={C.primary} />

                      <Text
                        style={{ fontFamily : 'Poppins_400Regular',
                          fontSize: 14,
                          fontWeight: '700',
                          color: C.primary,
                        }}>
                        Contact Support
                      </Text>

                      <Ionicons name="arrow-forward" size={15} color={C.primary} />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ))}

          {/* Agreement */}
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              marginTop: 34,
              paddingTop: 28,
              borderTopWidth: 1,
              borderTopColor: C.border,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}>
            <Ionicons name="checkmark-circle-outline" size={21} color={C.primary} />

            <Text
              style={{ fontFamily : 'Poppins_400Regular',
                flex: 1,
                fontSize: 13,
                lineHeight: 21,
                color: C.muted,
              }}>
              By continuing to use MediShield's services, you acknowledge that you have read,
              understood, and agree to these Terms & Conditions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default TermsAndConditions;
