import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const FAQ_DATA = [
  {
    category: 'Orders',
    icon: 'bag-handle-outline',
    questions: [
      {
        question: 'How can I place an order?',
        answer:
          'Browse the products you need, open the product details page, select the required variant and quantity, and add the product to your cart. From the cart, review your order and continue to checkout.',
      },
      {
        question: 'Can I modify my order after placing it?',
        answer:
          'Order modifications depend on the current status of your order. If your order has not been processed or shipped, please contact our support team as soon as possible.',
      },
      {
        question: 'How can I check my order status?',
        answer:
          'You can check your order status from your account after logging in. Open your orders section to view the latest available information.',
      },
      {
        question: 'Can I cancel my order?',
        answer:
          'Cancellation may be possible depending on the processing and shipping status of the order. Please contact support as soon as possible if you want to cancel an order.',
      },
    ],
  },
  {
    category: 'Products',
    icon: 'medical-outline',
    questions: [
      {
        question: 'How do I find a specific product?',
        answer:
          'You can use the search option or browse products through categories. You can also use available filters to narrow down the products according to your requirements.',
      },
      {
        question: 'Are all products available in stock?',
        answer:
          'Product availability can vary. The product page displays the currently available stock or availability status where applicable.',
      },
      {
        question: 'What if a product is out of stock?',
        answer:
          'If a product or selected variant is out of stock, you will not be able to purchase the unavailable quantity. You can check again later for availability.',
      },
      {
        question: 'Can I select different product variants?',
        answer:
          'Yes. Where variants are available, you can select the required option such as size, pack, or other available variants before adding the product to your cart.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: 'card-outline',
    questions: [
      {
        question: 'What payment methods are available?',
        answer:
          'Available payment methods are displayed during checkout. The options may vary depending on your location and the current payment services supported by the platform.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Payments are processed through secure payment services. Sensitive payment credentials are handled by the applicable payment provider according to its security practices.',
      },
      {
        question: 'What should I do if my payment was deducted but my order was not confirmed?',
        answer:
          'Please do not place the same order repeatedly. Check your order history first and contact support with your payment or transaction details so the payment status can be verified.',
      },
    ],
  },
  {
    category: 'Shipping',
    icon: 'car-outline',
    questions: [
      {
        question: 'How long does delivery take?',
        answer:
          'Delivery time depends on your location, product availability, and the shipping method selected. The applicable delivery estimate is shown during the ordering process where available.',
      },
      {
        question: 'Can I track my shipment?',
        answer:
          'Once tracking information is available, you can use the order details to follow the shipment status.',
      },
      {
        question: 'What happens if I am not available when the delivery arrives?',
        answer:
          'The delivery partner may attempt delivery again or contact you according to its delivery process. Please ensure that your contact and delivery details are accurate.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: 'return-down-back-outline',
    questions: [
      {
        question: 'Can I return a product?',
        answer:
          'Returns depend on the product, order status, and applicable return policy. Please review the applicable return terms or contact support before sending a product back.',
      },
      {
        question: 'How do I request a return or replacement?',
        answer:
          'Contact our support team with your order details and the reason for the request. Our team will guide you through the applicable process.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Refund processing time can vary depending on the payment method and the applicable refund process. You will receive relevant information once the refund is initiated.',
      },
    ],
  },
  {
    category: 'Account',
    icon: 'person-outline',
    questions: [
      {
        question: 'How do I create an account?',
        answer:
          'Select the registration or sign-up option and provide the required information. Follow the instructions to complete your account setup.',
      },
      {
        question: 'I forgot my password. What should I do?',
        answer:
          'Use the Forgot Password option on the login screen and follow the instructions to reset your password.',
      },
      {
        question: 'How can I update my account information?',
        answer:
          'Log in to your account and open your profile or account settings to update the information available for editing.',
      },
    ],
  },
];

function HelpFAQ() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openQuestion, setOpenQuestion] = useState(null);

  const categories = useMemo(
    () => [
      {
        name: 'All',
        icon: 'apps-outline',
      },
      ...FAQ_DATA.map((item) => ({
        name: item.category,
        icon: item.icon,
      })),
    ],
    []
  );

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return FAQ_DATA
      .filter(
        (section) =>
          activeCategory === 'All' ||
          section.category === activeCategory
      )
      .map((section) => ({
        ...section,
        questions: section.questions.filter((item) => {
          if (!query) return true;

          return (
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((section) => section.questions.length > 0);
  }, [activeCategory, search]);

  const totalQuestions = FAQ_DATA.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  const toggleQuestion = (id) => {
    setOpenQuestion((current) =>
      current === id ? null : id
    );
  };

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
                name="help-circle-outline"
                size={20}
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
            paddingVertical:
              Platform.OS === 'web' ? 68 : 46,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 980,
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 12,
                fontWeight: '800',
                letterSpacing: 1.5,
                marginBottom: 12,
              }}
            >
              SUPPORT CENTRE
            </Text>

            <Text
              style={{
                color: C.white,
                fontSize:
                  Platform.OS === 'web' ? 46 : 34,
                lineHeight:
                  Platform.OS === 'web' ? 54 : 42,
                fontWeight: '900',
                letterSpacing: -1,
                marginBottom: 14,
              }}
            >
              How can we help?
            </Text>

            <Text
              style={{
                color: '#b7d9d6',
                fontSize: 15,
                lineHeight: 24,
                maxWidth: 650,
              }}
            >
              Find answers to common questions about products,
              orders, payments, delivery, returns, and your account.
            </Text>

            {/* Search */}
            <View
              style={{
                marginTop: 28,
                maxWidth: 700,
                height: 54,
                backgroundColor: C.white,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}
            >
              <Ionicons
                name="search-outline"
                size={21}
                color={C.muted}
              />

              <TextInput
                value={search}
                onChangeText={(value) => {
                  setSearch(value);
                  setOpenQuestion(null);
                }}
                placeholder="Search your question..."
                placeholderTextColor="#94a3b8"
                style={{
                  flex: 1,
                  marginLeft: 11,
                  fontSize: 14,
                  color: C.text,
                  outlineStyle: 'none',
                }}
              />

              {search.length > 0 && (
                <Pressable
                  onPress={() => {
                    setSearch('');
                    setOpenQuestion(null);
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={C.muted}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Main */}
        <View
          style={{
            width: '100%',
            maxWidth: 980,
            alignSelf: 'center',
            paddingHorizontal: 24,
            paddingTop: 40,
          }}
        >
          {/* Quick stats */}
          <View
            style={{
              flexDirection:
                Platform.OS === 'web'
                  ? 'row'
                  : 'column',
              gap: Platform.OS === 'web' ? 40 : 14,
              paddingBottom: 32,
              borderBottomWidth: 1,
              borderBottomColor: C.border,
              marginBottom: 30,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: C.text,
                }}
              >
                {totalQuestions}+
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 3,
                }}
              >
                Helpful answers
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: C.text,
                }}
              >
                {FAQ_DATA.length}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 3,
                }}
              >
                Help categories
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: C.text,
                }}
              >
                24/7
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 3,
                }}
              >
                Online help centre
              </Text>
            </View>
          </View>

          {/* Categories */}
          <View
            style={{
              marginBottom: 34,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: C.text,
                marginBottom: 16,
              }}
            >
              Browse by topic
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 9,
                paddingBottom: 4,
              }}
            >
              {categories.map((category) => {
                const active =
                  activeCategory === category.name;

                return (
                  <Pressable
                    key={category.name}
                    onPress={() => {
                      setActiveCategory(category.name);
                      setOpenQuestion(null);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,

                      paddingHorizontal: 14,
                      paddingVertical: 10,

                      borderRadius: 10,

                      backgroundColor: active
                        ? C.primary
                        : C.white,

                      borderWidth: 1,
                      borderColor: active
                        ? C.primary
                        : C.border,
                    }}
                  >
                    <Ionicons
                      name={category.icon}
                      size={16}
                      color={
                        active
                          ? C.white
                          : C.primary
                      }
                    />

                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: active
                          ? C.white
                          : C.textSecondary,
                      }}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* FAQ */}
          {filteredData.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 70,
              }}
            >
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={25}
                  color={C.primary}
                />
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: C.text,
                  marginBottom: 7,
                }}
              >
                No results found
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: C.muted,
                  textAlign: 'center',
                  maxWidth: 400,
                  lineHeight: 22,
                }}
              >
                Try searching with different keywords or
                browse one of the categories above.
              </Text>
            </View>
          ) : (
            filteredData.map((section) => (
              <View
                key={section.category}
                style={{
                  marginBottom: 38,
                }}
              >
                {/* Category heading */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 11,
                    marginBottom: 13,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: C.primaryLight,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={section.icon}
                      size={18}
                      color={C.primary}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '800',
                      color: C.text,
                    }}
                  >
                    {section.category}
                  </Text>
                </View>

                {/* Questions */}
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: C.border,
                  }}
                >
                  {section.questions.map(
                    (item, index) => {
                      const id =
                        `${section.category}-${index}`;

                      const isOpen =
                        openQuestion === id;

                      return (
                        <View
                          key={id}
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor:
                              C.border,
                          }}
                        >
                          <Pressable
                            onPress={() =>
                              toggleQuestion(id)
                            }
                            style={{
                              minHeight: 62,
                              paddingVertical: 17,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent:
                                'space-between',
                              gap: 20,
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 14,
                                lineHeight: 21,
                                fontWeight: '700',
                                color: C.text,
                              }}
                            >
                              {item.question}
                            </Text>

                            <Ionicons
                              name={
                                isOpen
                                  ? 'remove'
                                  : 'add'
                              }
                              size={20}
                              color={
                                isOpen
                                  ? C.primary
                                  : C.muted
                              }
                            />
                          </Pressable>

                          {isOpen && (
                            <View
                              style={{
                                paddingBottom: 20,
                                paddingRight: 35,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  lineHeight: 24,
                                  color:
                                    C.textSecondary,
                                }}
                              >
                                {item.answer}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    }
                  )}
                </View>
              </View>
            ))
          )}

          {/* Still need help */}
          <View
            style={{
              marginTop: 10,
              paddingTop: 32,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: C.text,
                marginBottom: 8,
              }}
            >
              Still need help?
            </Text>

            <Text
              style={{
                fontSize: 14,
                lineHeight: 23,
                color: C.muted,
                marginBottom: 20,
                maxWidth: 580,
              }}
            >
              Can't find the answer you're looking for?
              Our support team will be happy to help you
              with your questions.
            </Text>

            <View
              style={{
                flexDirection:
                  Platform.OS === 'web'
                    ? 'row'
                    : 'column',
                gap: 12,
              }}
            >
              <Pressable
                style={{
                  minHeight: 46,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: C.primary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={17}
                  color={C.white}
                />

                <Text
                  style={{
                    color: C.white,
                    fontSize: 13,
                    fontWeight: '800',
                  }}
                >
                  Contact Support
                </Text>
              </Pressable>

              <Pressable
                style={{
                  minHeight: 46,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: C.border,
                  backgroundColor: C.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={17}
                  color={C.primary}
                />

                <Text
                  style={{
                    color: C.text,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  Email Us
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HelpFAQ;