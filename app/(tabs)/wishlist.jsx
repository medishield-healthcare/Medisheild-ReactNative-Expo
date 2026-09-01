import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import WebHeader from "components/Header/header.web";
import AddToCartButton from "components/Cart/AddToCartButton";
import Footer from "components/Footer/Footer";

const T = {
  teal900: "#09BBAF",
  teal800: "#0f5f5a",
  teal700: "#09BBAF",
  teal600: "#0d9488",
  teal100: "#ccfbf1",
  teal50: "#f0fdfa",

  slate900: "#102326",
  slate800: "#18282c",
  slate700: "#26383c",
  slate500: "#5f6d71",
  slate400: "#89979b",
  slate200: "#d9e1e3",
  slate100: "#edf1f2",

  white: "#ffffff",

  red500: "#ef4444",
  red100: "#fee2e2",

  amber500: "#f59e0b",
};

// ─────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────

function WishlistCard({ product, onRemove }) {
  const router = useRouter();

  const image =
    product?.media_gallery_entries?.length > 0
      ? product.media_gallery_entries[0]?.file
      : product?.thumbnail_url;

  const price = Number(
    product?.price?.minimalPrice ?? 0
  );

  const regularPrice = Number(
    product?.price?.regularPrice ?? 0
  );

  const discount =
    regularPrice > price
      ? Math.round(
          (1 - price / regularPrice) * 100
        )
      : null;

  const rating = product?.reviews?.length
    ? (
        product.reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating || 0),
          0
        ) / product.reviews.length
      ).toFixed(1)
    : null;

  return (
    <View
      style={{
        backgroundColor: T.white,
        borderWidth: 1,
        borderColor: T.slate100,
        borderRadius: 16,
        overflow: "hidden",
        flex: 1,

        ...(Platform.OS === "web"
          ? {
              boxShadow:
                "0 5px 22px rgba(16,35,38,0.07)",
            }
          : {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }),
      }}
    >
      {/* IMAGE */}

      <Pressable
        onPress={() =>
          router.push(`/product/${product._id}`)
        }
        style={{
          height: 245,
          backgroundColor: "#fafcfc",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            resizeMode="contain"
            style={{
              width: "86%",
              height: "86%",
            }}
          />
        ) : (
          <Ionicons
            name="image-outline"
            size={42}
            color={T.slate200}
          />
        )}

        {/* DISCOUNT */}

        {discount > 0 && (
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: T.red500,
              borderRadius: 5,
              paddingHorizontal: 8,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                color: T.white,
                fontSize: 10,
                fontWeight: "900",
              }}
            >
              {discount}% OFF
            </Text>
          </View>
        )}

        {/* REMOVE */}

        <Pressable
          onPress={() => onRemove(product._id)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: T.white,
            borderWidth: 1,
            borderColor: T.slate100,
            alignItems: "center",
            justifyContent: "center",

            ...(Platform.OS === "web"
              ? {
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.08)",
                }
              : {}),
          }}
        >
          <Ionicons
            name="heart"
            size={19}
            color={T.red500}
          />
        </Pressable>
      </Pressable>

      {/* CONTENT */}

      <View
        style={{
          padding: 16,
        }}
      >
        {/* BRAND */}

        <Text
          numberOfLines={1}
          style={{
            fontSize: 10,
            color: T.teal700,
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 7,
          }}
        >
          {product.manufacturer ||
            "MediShield"}
        </Text>

        {/* NAME */}

        <Pressable
          onPress={() =>
            router.push(`/product/${product._id}`)
          }
        >
          <Text
            numberOfLines={2}
            style={{
              minHeight: 40,
              fontSize: 14,
              lineHeight: 20,
              fontWeight: "800",
              color: T.slate900,
            }}
          >
            {product.name}
          </Text>
        </Pressable>

        {/* RATING */}

        {rating && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: T.amber100,
                borderRadius: 5,
                paddingHorizontal: 6,
                paddingVertical: 3,
              }}
            >
              <Ionicons
                name="star"
                size={10}
                color={T.amber500}
              />

              <Text
                style={{
                  marginLeft: 3,
                  fontSize: 10,
                  fontWeight: "900",
                  color: "#92400e",
                }}
              >
                {rating}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 10,
                color: T.slate400,
              }}
            >
              {product.reviews.length} reviews
            </Text>
          </View>
        )}

        {/* PRICE */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: T.teal700,
            }}
          >
            ₹{price.toLocaleString("en-IN")}
          </Text>

          {regularPrice > price && (
            <Text
              style={{
                fontSize: 12,
                color: T.slate400,
                textDecorationLine:
                  "line-through",
              }}
            >
              ₹
              {regularPrice.toLocaleString(
                "en-IN"
              )}
            </Text>
          )}
        </View>

        {/* ADD TO CART */}

        <View
          style={{
            marginTop: 14,
            minHeight: 44,
          }}
        >
          <AddToCartButton
            productId={product._id}
            variant={product.sku}
            price={price}
            size="sm"
            style="solid"
          />
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// WISHLIST PAGE
// ─────────────────────────────────────────────

function Wishlist() {
  const router = useRouter();

  const { user, setUser } = useAuth();

  const { width } = useWindowDimensions();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDesktop = width >= 1100;
  const isTablet =
    width >= 700 && width < 1100;
  const isMobile = width < 700;

  const horizontalPadding = isDesktop
    ? 56
    : isTablet
      ? 32
      : 16;

  // ───────────────────────────────────────────
  // FETCH WISHLIST PRODUCTS
  // ───────────────────────────────────────────

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        const wishlistIds =
          user?.wishlist || [];

        if (!wishlistIds.length) {
          setProducts([]);
          return;
        }

        const results = await Promise.all(
          wishlistIds.map(async (id) => {
            try {
              const res = await API.get(
                `/product/getproductwithid/${id}`
              );

              return res.data?.findProduct || null;
            } catch (error) {
              console.log(
                `Wishlist product ${id} error:`,
                error?.response?.data ||
                  error?.message
              );

              return null;
            }
          })
        );

        setProducts(
          results.filter(Boolean)
        );
      } catch (error) {
        console.log(
          "Wishlist fetch error:",
          error?.response?.data ||
            error?.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.wishlist]);

  // ───────────────────────────────────────────
  // REMOVE FROM WISHLIST
  // ───────────────────────────────────────────

  const handleRemove = async (productId) => {
    try {
      const res = await API.put(
        "/product/wishlist",
        {
          prodId: productId,
        }
      );

      // AuthContext update
      setUser(res.data);
    } catch (error) {
      console.log(
        "Remove wishlist error:",
        error?.response?.data ||
          error?.message
      );
    }
  };

  // ───────────────────────────────────────────
  // LOADING
  // ───────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: T.white,
        }}
      >
        {Platform.OS === "web" && (
          <WebHeader />
        )}

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={T.teal700}
          />

          <Text
            style={{
              marginTop: 12,
              fontSize: 13,
              color: T.slate500,
              fontWeight: "600",
            }}
          >
            Loading your wishlist...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ───────────────────────────────────────────
  // PAGE
  // ───────────────────────────────────────────

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: T.white,
      }}
    >
      {/* HEADER */}

      {Platform.OS === "web" && (
        <WebHeader />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // paddingBottom: 70,
        }}
      >
        {/* ─────────────────────────────────────
            HERO
        ───────────────────────────────────── */}

        <View
          style={{
            backgroundColor: T.teal50,
            borderBottomWidth: 1,
            borderBottomColor: T.teal100,
          }}
        >
          <View
            style={{
              maxWidth: 1280,
              width: "100%",
              alignSelf: "center",
              paddingHorizontal:
                horizontalPadding,
              paddingTop: isMobile ? 35 : 52,
              paddingBottom: isMobile ? 35 : 52,
            }}
          >
            {/* BREADCRUMB */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                marginBottom: 25,
              }}
            >
              <Pressable
                onPress={() => router.push("/")}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: T.teal700,
                    fontWeight: "700",
                  }}
                >
                  Home
                </Text>
              </Pressable>

              <Ionicons
                name="chevron-forward"
                size={11}
                color={T.slate400}
              />

              <Text
                style={{
                  fontSize: 11,
                  color: T.slate500,
                }}
              >
                Wishlist
              </Text>
            </View>

            <View
              style={{
                flexDirection: isMobile
                  ? "column"
                  : "row",
                alignItems: isMobile
                  ? "flex-start"
                  : "center",
                justifyContent:
                  "space-between",
                gap: 18,
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 9,
                  }}
                >
                  <View
                    style={{
                      width: 43,
                      height: 43,
                      borderRadius: 13,
                      backgroundColor:
                        T.white,
                      borderWidth: 1,
                      borderColor:
                        T.teal100,
                      alignItems: "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Ionicons
                      name="heart"
                      size={22}
                      color={T.red500}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "900",
                      color: T.teal700,
                      textTransform:
                        "uppercase",
                      letterSpacing: 1.2,
                    }}
                  >
                    Your Collection
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: isMobile
                      ? 30
                      : 38,
                    lineHeight: isMobile
                      ? 37
                      : 45,
                    fontWeight: "900",
                    color: T.slate900,
                    letterSpacing: -1,
                  }}
                >
                  My Wishlist
                </Text>

                <Text
                  style={{
                    marginTop: 7,
                    fontSize: 13,
                    lineHeight: 21,
                    color: T.slate500,
                    maxWidth: 570,
                  }}
                >
                  Save your favourite dental
                  care products and come back
                  to them whenever you're ready.
                </Text>
              </View>

              {/* COUNT */}

              <View
                style={{
                  backgroundColor: T.white,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: T.teal100,
                  paddingHorizontal: 18,
                  paddingVertical: 13,
                  minWidth: 120,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "900",
                    color: T.teal700,
                  }}
                >
                  {products.length}
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    color: T.slate500,
                    fontWeight: "700",
                    marginTop: 2,
                  }}
                >
                  Saved Product
                  {products.length !== 1
                    ? "s"
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────
            PRODUCTS
        ───────────────────────────────────── */}

        <View
          style={{
            maxWidth: 1280,
            width: "100%",
            alignSelf: "center",
            paddingHorizontal:
              horizontalPadding,
            paddingTop: isMobile ? 25 : 38,
          }}
        >
          {products.length === 0 ? (
            // EMPTY STATE
            <View
              style={{
                minHeight: 420,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: 28,
                  backgroundColor: T.teal50,
                  borderWidth: 1,
                  borderColor: T.teal100,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={39}
                  color={T.teal700}
                />
              </View>

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "900",
                  color: T.slate900,
                  textAlign: "center",
                }}
              >
                Your wishlist is empty
              </Text>

              <Text
                style={{
                  maxWidth: 430,
                  fontSize: 13,
                  lineHeight: 21,
                  color: T.slate400,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Looks like you haven't saved
                anything yet. Explore our
                collection and save products
                you love.
              </Text>

              <Pressable
                onPress={() =>
                  router.push("/shop")
                }
                style={{
                  marginTop: 22,
                  backgroundColor: T.teal700,
                  borderRadius: 10,
                  paddingHorizontal: 22,
                  paddingVertical: 13,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    color: T.white,
                    fontSize: 13,
                    fontWeight: "900",
                  }}
                >
                  Explore Products
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={T.white}
                />
              </Pressable>
            </View>
          ) : (
            <>
              {/* TOP BAR */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  marginBottom: 20,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "900",
                      color: T.slate900,
                    }}
                  >
                    Saved for later
                  </Text>

                  <Text
                    style={{
                      fontSize: 11,
                      color: T.slate400,
                      marginTop: 3,
                    }}
                  >
                    Your favourite products in
                    one place
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    router.push("/shop")
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: T.teal700,
                      fontWeight: "800",
                    }}
                  >
                    Continue Shopping
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={T.teal700}
                  />
                </Pressable>
              </View>

              {/* GRID */}

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {products.map((product) => (
                  <View
                    key={product._id}
                    style={{
                      width: isDesktop
                        ? "calc(25% - 12px)"
                        : isTablet
                          ? "calc(33.333% - 11px)"
                          : isMobile
                            ? "100%"
                            : "calc(50% - 8px)",

                      ...(Platform.OS === "web"
                        ? {
                            flexGrow: 0,
                            flexShrink: 0,
                          }
                        : {
                            width: isMobile
                              ? "100%"
                              : "48%",
                          }),
                    }}
                  >
                    <WishlistCard
                      product={product}
                      onRemove={
                        handleRemove
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ─────────────────────────────────────
            TRUST STRIP
        ───────────────────────────────────── */}

        {products.length > 0 && (
          <View
            style={{
              maxWidth: 1280,
              width: "100%",
              alignSelf: "center",
              paddingHorizontal:
                horizontalPadding,
              marginTop: 55,
              marginBottom: 40,
            }}
          >
            <View
              style={{
                backgroundColor: T.slate100,
                borderRadius: 16,
                padding: isMobile
                  ? 18
                  : 22,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 15,
                justifyContent:
                  "space-around",
              }}
            >
              {[
                {
                  icon: "shield-checkmark-outline",
                  title: "Genuine Products",
                  text: "100% authentic",
                },
                {
                  icon: "rocket-outline",
                  title: "Fast Delivery",
                  text: "Quick & reliable",
                },
                {
                  icon: "refresh-outline",
                  title: "Easy Returns",
                  text: "Hassle-free returns",
                },
                {
                  icon: "headset-outline",
                  title: "Need Help?",
                  text: "We're here for you",
                },
              ].map((item) => (
                <View
                  key={item.title}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 9,
                    minWidth: 160,
                  }}
                >
                  <View
                    style={{
                      width: 37,
                      height: 37,
                      borderRadius: 11,
                      backgroundColor:
                        T.white,
                      alignItems: "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={T.teal700}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "900",
                        color: T.slate800,
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        fontSize: 9,
                        color: T.slate400,
                        marginTop: 2,
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Wishlist;