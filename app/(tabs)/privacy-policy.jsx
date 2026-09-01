import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  primary: '#09BBAF',
  primaryDark: '#09BBAF',
  primaryLight: '#ccfbf1',

  white: '#ffffff',
  background: '#f8fafc',

  text: '#0f172a',
  textSecondary: '#475569',
  muted: '#64748b',

  border: '#e2e8f0',
};

function PrivacyPolicy() {
  const router = useRouter();

  const sections = [
    {
      number: '01',
      title: 'Information We Collect',
      content:
        'When you use our website or services, we may collect information that you voluntarily provide to us, such as your name, email address, phone number, delivery address, billing information, and account details.',
      bullets: [
        'Account and contact information',
        'Shipping and billing information',
        'Order and transaction details',
        'Information you provide when contacting support',
      ],
    },
    {
      number: '02',
      title: 'How We Use Your Information',
      content:
        'We use the information we collect to provide, maintain, and improve our services and to give you a better shopping experience.',
      bullets: [
        'Process and deliver your orders',
        'Manage your account',
        'Provide customer support',
        'Send important service-related communications',
        'Improve our products, website, and services',
        'Prevent fraud and protect the security of our platform',
      ],
    },
    {
      number: '03',
      title: 'Payment Information',
      content:
        'Payments made through our platform may be processed by secure third-party payment providers. We do not unnecessarily store sensitive payment credentials such as complete card numbers or CVV information on our servers.',
    },
    {
      number: '04',
      title: 'Cookies & Similar Technologies',
      content:
        'We may use cookies and similar technologies to remember your preferences, understand how our website is used, improve performance, and provide a more personalized experience.',
    },
    {
      number: '05',
      title: 'Sharing of Information',
      content:
        'We do not sell your personal information. We may share necessary information with trusted service providers who help us operate our business, such as payment processors, logistics partners, hosting providers, and customer-support services.',
    },
    {
      number: '06',
      title: 'Data Security',
      content:
        'We take reasonable technical and organizational measures to protect your personal information against unauthorized access, misuse, alteration, disclosure, or destruction. However, no internet-based service can guarantee absolute security.',
    },
    {
      number: '07',
      title: 'Data Retention',
      content:
        'We retain personal information only for as long as reasonably necessary to provide our services, complete transactions, comply with applicable legal obligations, resolve disputes, and enforce our agreements.',
    },
    {
      number: '08',
      title: 'Your Rights',
      content:
        'Depending on applicable law, you may have rights regarding your personal information, including requesting access, correction, deletion, or information about how your data is being used.',
    },
    {
      number: '09',
      title: 'Children’s Privacy',
      content:
        'Our services are not intended to knowingly collect personal information from children without appropriate consent. If you believe that a child has provided personal information to us, please contact us so that we can take appropriate action.',
    },
    {
      number: '10',
      title: 'Third-Party Links',
      content:
        'Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those external services. We recommend reviewing their privacy policies before providing personal information.',
    },
    {
      number: '11',
      title: 'Changes to This Privacy Policy',
      content:
        'We may update this Privacy Policy from time to time to reflect changes in our services, technology, or applicable requirements. Any updated version will be published on this page with the revised date.',
    },
    {
      number: '12',
      title: 'Contact Us',
      content:
        'If you have questions, concerns, or requests regarding this Privacy Policy or the way we handle your information, please contact our support team.',
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: C.background,
      }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: C.white,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',
            paddingHorizontal: 24,
            paddingVertical: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingVertical: 8,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={C.text}
            />

            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.text,
              }}
            >
              Back
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: C.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={19}
                color={C.primary}
              />
            </View>

            <Text
              style={{
                fontSize: 15,
                fontWeight: '800',
                color: C.primaryDark,
              }}
            >
              Medishield
            </Text>
          </View>

          <View style={{ width: 55 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 70,
        }}
      >
        {/* Hero */}
        <View
          style={{
            backgroundColor: C.primaryDark,
            paddingHorizontal: 24,
            paddingVertical: Platform.OS === 'web' ? 72 : 48,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 980,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.10)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 22,
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#ffffff"
              />
            </View>

            <Text
              style={{
                color: '#ffffff',
                fontSize: 12,
                fontWeight: '800',
                letterSpacing: 1.5,
                marginBottom: 12,
              }}
            >
              YOUR PRIVACY MATTERS
            </Text>

            <Text
              style={{
                color: C.white,
                fontSize: Platform.OS === 'web' ? 48 : 34,
                lineHeight: Platform.OS === 'web' ? 56 : 42,
                fontWeight: '900',
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Privacy Policy
            </Text>

            <Text
              style={{
                color: '#b7d9d6',
                fontSize: 15,
                lineHeight: 24,
                maxWidth: 680,
              }}
            >
              We respect your privacy and are committed to protecting
              the personal information you share with us.
            </Text>

            <View
              style={{
                marginTop: 26,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={15}
                color="#99f6e4"
              />

              <Text
                style={{
                  color: '#99f6e4',
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                Last updated: August 2026
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View
          style={{
            width: '100%',
            maxWidth: 980,
            alignSelf: 'center',
            paddingHorizontal: 24,
            paddingTop: 44,
          }}
        >
          {/* Intro */}
          <View
            style={{
              paddingBottom: 36,
              borderBottomWidth: 1,
              borderBottomColor: C.border,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: C.text,
                marginBottom: 12,
              }}
            >
              Our commitment to you
            </Text>

            <Text
              style={{
                fontSize: 15,
                lineHeight: 26,
                color: C.textSecondary,
              }}
            >
              This Privacy Policy explains how Medishield collects,
              uses, protects, and manages your information when you
              use our website, mobile application, and related services.
              By using our services, you acknowledge the practices
              described in this policy.
            </Text>
          </View>

          {/* Sections */}
          {sections.map((section) => (
            <View
              key={section.number}
              style={{
                paddingVertical: 30,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 18,
                }}
              >
                {/* Number */}
                <Text
                  style={{
                    width: 30,
                    fontSize: 12,
                    fontWeight: '800',
                    color: C.primary,
                    paddingTop: 4,
                  }}
                >
                  {section.number}
                </Text>

                {/* Content */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 27,
                      fontWeight: '800',
                      color: C.text,
                      marginBottom: 12,
                    }}
                  >
                    {section.title}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 24,
                      color: C.textSecondary,
                    }}
                  >
                    {section.content}
                  </Text>

                  {section.bullets && (
                    <View
                      style={{
                        marginTop: 14,
                        gap: 9,
                      }}
                    >
                      {section.bullets.map((bullet) => (
                        <View
                          key={bullet}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: 10,
                          }}
                        >
                          <View
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: 3,
                              backgroundColor: C.primary,
                              marginTop: 9,
                            }}
                          />

                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              lineHeight: 23,
                              color: C.textSecondary,
                            }}
                          >
                            {bullet}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Contact */}
                  {section.number === '12' && (
                    <Pressable
                      style={{
                        marginTop: 18,
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingVertical: 10,
                      }}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color={C.primary}
                      />

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: C.primary,
                        }}
                      >
                        Contact Support
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={15}
                        color={C.primary}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ))}

          {/* Footer note */}
          <View
            style={{
              marginTop: 34,
              paddingTop: 28,
              borderTopWidth: 1,
              borderTopColor: C.border,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={C.primary}
            />

            <Text
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 21,
                color: C.muted,
              }}
            >
              We continuously work to keep your information secure
              and to provide a transparent and trustworthy shopping
              experience.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrivacyPolicy;