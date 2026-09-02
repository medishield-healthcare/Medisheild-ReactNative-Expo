import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  useWindowDimensions,
  Alert,
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

  red500: '#ef4444',
};

// ─────────────────────────────────────────────────────────────────────────────
// INFO CARD
// ─────────────────────────────────────────────────────────────────────────────

function ContactInfoCard({ icon, title, description, value, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: T.white,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: T.slate100,
        padding: 20,
        flex: 1,
        minWidth: 220,
        opacity: pressed ? 0.9 : 1,

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
      })}>
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
          marginBottom: 15,
        }}>
        <Ionicons name={icon} size={22} color={T.teal700} />
      </View>

      <Text
        style={{
          fontSize: 15,
          fontWeight: '900',
          color: T.slate900,
          marginBottom: 5,
        }}>
        {title}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: T.slate400,
          lineHeight: 17,
          marginBottom: 8,
        }}>
        {description}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: T.teal700,
          fontWeight: '800',
        }}>
        {value}
      </Text>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM INPUT
// ─────────────────────────────────────────────────────────────────────────────

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
}) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 180,
      }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '800',
          color: T.slate700,
          marginBottom: 7,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={T.slate400}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={{
          backgroundColor: T.slate50,
          borderWidth: 1.5,
          borderColor: T.slate200,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 14 : 12,
          fontSize: 13,
          color: T.slate900,
          minHeight: multiline ? 125 : undefined,

          ...(Platform.OS === 'web'
            ? {
                outlineStyle: 'none',
              }
            : {}),
        }}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const router = useRouter();

  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 700 && width < 1024;
  const isMobile = width < 700;

  const horizontalPadding = isDesktop ? 60 : isTablet ? 32 : 18;

  const maxWidth = 1280;

  // ─────────────────────────────────────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────────────────────────────────────

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // FORM HANDLER
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }

    if (!form.email.trim()) {
      Alert.alert('Required', 'Please enter your email.');
      return;
    }

    if (!form.message.trim()) {
      Alert.alert('Required', 'Please enter your message.');
      return;
    }

    setSubmitting(true);

    /*
      Connect your contact API here.

      Example:

      await API.post('/contact', form);
    */

    setTimeout(() => {
      setSubmitting(false);

      Alert.alert(
        'Message Sent',
        'Thank you for contacting MediShield. Our team will get back to you soon.'
      );

      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 800);
  };

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
            Contact Us
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // paddingBottom: 70,
        }}>
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
              paddingTop: isMobile ? 48 : 70,
              paddingBottom: isMobile ? 50 : 70,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 17,
                backgroundColor: T.white,
                borderWidth: 1,
                borderColor: T.teal100,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 17,
              }}>
              <Ionicons name="chatbubbles-outline" size={27} color={T.teal700} />
            </View>

            <View
              style={{
                backgroundColor: T.white,
                borderWidth: 1,
                borderColor: T.teal100,
                borderRadius: 30,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginBottom: 14,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '900',
                  color: T.teal700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>
                We are here to help
              </Text>
            </View>

            <Text
              style={{
                fontSize: isMobile ? 34 : 46,
                lineHeight: isMobile ? 41 : 54,
                fontWeight: '900',
                color: T.slate900,
                letterSpacing: -1.3,
                textAlign: 'center',
              }}>
              Let's talk.
            </Text>

            <Text
              style={{
                fontSize: isMobile ? 25 : 32,
                lineHeight: isMobile ? 32 : 39,
                fontWeight: '800',
                color: T.teal700,
                letterSpacing: -0.7,
                textAlign: 'center',
              }}>
              We're here for you.
            </Text>

            <Text
              style={{
                maxWidth: 600,
                fontSize: 13,
                lineHeight: 22,
                color: T.slate500,
                textAlign: 'center',
                marginTop: 12,
              }}>
              Have a question about a product, your order, delivery or anything else? Reach out to
              the MediShield team and we'll be happy to help.
            </Text>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            CONTACT CARDS
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            width: '100%',
            maxWidth: 1100,
            alignSelf: 'center',
            paddingHorizontal: horizontalPadding,
            paddingVertical: isMobile ? 30 : 42,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 13,
            }}>
            <ContactInfoCard
              icon="mail-outline"
              title="Email Us"
              description="For general questions and support"
              value="support@medishield.com"
              onPress={() => {}}
            />

            <ContactInfoCard
              icon="call-outline"
              title="Call Us"
              description="Speak directly with our support team"
              value="+91 98765 43210"
              onPress={() => {}}
            />

            <ContactInfoCard
              icon="time-outline"
              title="Support Hours"
              description="We're available to assist you"
              value="Mon – Sat · 9 AM – 6 PM"
            />

            <ContactInfoCard
              icon="location-outline"
              title="Our Location"
              description="MediShield support & operations"
              value="India"
            />
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            CONTACT FORM + SIDE PANEL
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            width: '100%',
            maxWidth,
            alignSelf: 'center',
            paddingHorizontal: horizontalPadding,
            paddingBottom: isMobile ? 55 : 75,
          }}>
          <View
            style={{
              flexDirection: isDesktop ? 'row' : 'column',
              gap: 20,
              alignItems: 'stretch',
            }}>
            {/* FORM */}

            <View
              style={{
                flex: 1.5,
                backgroundColor: T.white,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: T.slate100,
                padding: isMobile ? 20 : 28,

                ...(Platform.OS === 'web'
                  ? {
                      boxShadow: '0 7px 28px rgba(15,23,42,0.07)',
                    }
                  : {
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.04,
                      shadowRadius: 12,
                      elevation: 3,
                    }),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 22,
                }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    backgroundColor: T.teal50,
                    borderWidth: 1,
                    borderColor: T.teal100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 11,
                  }}>
                  <Ionicons name="paper-plane-outline" size={20} color={T.teal700} />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '900',
                      color: T.slate900,
                    }}>
                    Send us a message
                  </Text>

                  <Text
                    style={{
                      fontSize: 11,
                      color: T.slate400,
                      marginTop: 2,
                    }}>
                    We'll get back to you as soon as possible.
                  </Text>
                </View>
              </View>

              {/* NAME + EMAIL */}

              <View
                style={{
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 13,
                  marginBottom: 15,
                }}>
                <FormField
                  label="Full Name"
                  placeholder="Your name"
                  value={form.name}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      name: text,
                    })
                  }
                />

                <FormField
                  label="Email Address"
                  placeholder="you@example.com"
                  value={form.email}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      email: text,
                    })
                  }
                  keyboardType="email-address"
                />
              </View>

              {/* PHONE + SUBJECT */}

              <View
                style={{
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 13,
                  marginBottom: 15,
                }}>
                <FormField
                  label="Phone Number"
                  placeholder="9876543210"
                  value={form.phone}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      phone: text,
                    })
                  }
                  keyboardType="phone-pad"
                />

                <FormField
                  label="Subject"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      subject: text,
                    })
                  }
                />
              </View>

              {/* MESSAGE */}

              <View
                style={{
                  marginBottom: 18,
                }}>
                <FormField
                  label="Message"
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      message: text,
                    })
                  }
                  multiline
                />
              </View>

              {/* BUTTON */}

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                style={({ pressed }) => ({
                  backgroundColor: T.teal700,
                  borderRadius: 13,
                  paddingVertical: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  opacity: submitting ? 0.65 : pressed ? 0.9 : 1,

                  ...(Platform.OS === 'web'
                    ? {
                        cursor: 'pointer',
                        boxShadow: '0 7px 20px rgba(15,118,110,0.20)',
                      }
                    : {}),
                })}>
                {submitting ? (
                  <Text
                    style={{
                      color: T.white,
                      fontSize: 14,
                      fontWeight: '900',
                    }}>
                    Sending...
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{
                        color: T.white,
                        fontSize: 14,
                        fontWeight: '900',
                      }}>
                      Send Message
                    </Text>

                    <Ionicons name="arrow-forward" size={17} color={T.white} />
                  </>
                )}
              </Pressable>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: 12,
                }}>
                <Ionicons name="lock-closed-outline" size={12} color={T.slate400} />

                <Text
                  style={{
                    fontSize: 10,
                    color: T.slate400,
                  }}>
                  Your information is kept private and secure.
                </Text>
              </View>
            </View>

            {/* RIGHT SIDE */}

            <View
              style={{
                flex: 1,
                backgroundColor: T.teal900,
                borderRadius: 22,
                padding: isMobile ? 23 : 28,
                overflow: 'hidden',
                position: 'relative',
              }}>
              {/* DECORATIVE CIRCLE */}

              <View
                style={{
                  position: 'absolute',
                  width: 250,
                  height: 250,
                  borderRadius: 125,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  right: -100,
                  top: -80,
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  left: -100,
                  bottom: -70,
                }}
              />

              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                <Ionicons name="headset-outline" size={25} color={T.white} />
              </View>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal100,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 9,
                }}>
                Customer Support
              </Text>

              <Text
                style={{
                  fontSize: 25,
                  lineHeight: 32,
                  fontWeight: '900',
                  color: T.white,
                  letterSpacing: -0.5,
                  marginBottom: 12,
                }}>
                Need a little help?
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 21,
                  color: '#b8dedb',
                  marginBottom: 27,
                }}>
                Whether you're looking for a product, need help with an order, or simply have a
                question, our team is ready to help.
              </Text>

              {/* SUPPORT POINTS */}

              <View
                style={{
                  gap: 17,
                }}>
                {[
                  {
                    icon: 'checkmark-circle-outline',
                    title: 'Order Support',
                    text: 'Questions about your order or delivery?',
                  },
                  {
                    icon: 'medical-outline',
                    title: 'Product Help',
                    text: 'Need help finding the right product?',
                  },
                  {
                    icon: 'chatbubble-ellipses-outline',
                    title: 'General Questions',
                    text: `We're happy to answer your questions.`,
                  },
                ].map((item) => (
                  <View
                    key={item.title}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 11,
                    }}>
                    <View
                      style={{
                        width: 31,
                        height: 31,
                        borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons name={item.icon} size={15} color={T.teal100} />
                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '900',
                          color: T.white,
                          marginBottom: 2,
                        }}>
                        {item.title}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          lineHeight: 16,
                          color: '#a8d4d1',
                        }}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* SUPPORT BADGE */}

              <View
                style={{
                  marginTop: 30,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 13,
                  padding: 13,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 9,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                }}>
                <Ionicons name="time-outline" size={17} color={T.teal100} />

                <View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '900',
                      color: T.white,
                    }}>
                    Support Hours
                  </Text>

                  <Text
                    style={{
                      fontSize: 10,
                      color: '#a8d4d1',
                      marginTop: 2,
                    }}>
                    Monday – Saturday · 9 AM – 6 PM
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            FAQ / QUICK HELP
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
              paddingVertical: isMobile ? 50 : 65,
            }}>
            <View
              style={{
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: 28,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: 9,
                }}>
                Quick Help
              </Text>

              <Text
                style={{
                  fontSize: isMobile ? 27 : 33,
                  fontWeight: '900',
                  color: T.slate900,
                  letterSpacing: -0.7,
                  textAlign: isMobile ? 'left' : 'center',
                }}>
                Looking for something specific?
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
              }}>
              {[
                {
                  icon: 'cart-outline',
                  title: 'Track My Order',
                  text: 'Check the status of your order.',
                },
                {
                  icon: 'help-circle-outline',
                  title: 'Need Product Help?',
                  text: 'Get help choosing a product.',
                },
                {
                  icon: 'refresh-outline',
                  title: 'Returns & Refunds',
                  text: 'Need help with a return?',
                },
              ].map((item) => (
                <Pressable
                  key={item.title}
                  style={{
                    flex: 1,
                    minWidth: 220,
                    backgroundColor: T.white,
                    borderRadius: 17,
                    borderWidth: 1,
                    borderColor: T.slate100,
                    padding: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: T.teal50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name={item.icon} size={19} color={T.teal700} />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '900',
                        color: T.slate900,
                      }}>
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        fontSize: 10,
                        lineHeight: 15,
                        color: T.slate400,
                        marginTop: 3,
                      }}>
                      {item.text}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color={T.slate400} />
                </Pressable>
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
            paddingTop: isMobile ? 45 : 65,
          }}>
          <View
            style={{
              backgroundColor: T.teal700,
              borderRadius: 25,
              paddingHorizontal: isMobile ? 22 : 45,
              paddingVertical: isMobile ? 32 : 42,

              flexDirection: isDesktop ? 'row' : 'column',

              alignItems: isDesktop ? 'center' : 'flex-start',

              justifyContent: 'space-between',
              gap: 22,
              overflow: 'hidden',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '900',
                  color: T.teal100,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                Explore MediShield
              </Text>

              <Text
                style={{
                  fontSize: isMobile ? 25 : 31,
                  lineHeight: isMobile ? 32 : 38,
                  fontWeight: '900',
                  color: T.white,
                  letterSpacing: -0.6,
                }}>
                Take care of your smile.
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 20,
                  color: '#c4e7e4',
                  marginTop: 7,
                }}>
                Discover dental-care essentials designed for your everyday routine.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push('/shop')}
              style={{
                backgroundColor: T.white,
                borderRadius: 13,
                paddingHorizontal: 22,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minWidth: isMobile ? '100%' : 155,
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
            BRAND FOOTER
        ───────────────────────────────────────────────────────────────── */}

        <View
          style={{
            alignItems: 'center',
            paddingTop: 38,
            marginBottom: 32,
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
              marginTop: 7,
            }}>
            Better dental care. Simpler shopping.
          </Text>
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
