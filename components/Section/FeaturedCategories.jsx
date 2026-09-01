// components/Section/FeaturedCategories.jsx

import React from "react";

import {
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";


// ═══════════════════════════════════════════════════════════════
// CATEGORY DATA
// ═══════════════════════════════════════════════════════════════

const categories = [
  {
    id: "articulating-paper",
    name: "Articulating Paper",

    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/articulating%20paper%20dt.jpg",
    },

    route: "/shop?category=Articulating%20Paper",
  },

  {
    id: "dental-gifts",
    name: "Dental Gifts",

    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/dental%20gift%20dt.jpg",
    },

    route: "/shop?category=Dental%20Gifts",
  },

  {
    id: "crown-preparation",
    name: "Crown Preparation Burs & Kits",

    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/crown%20dt%20%281%29.jpg",
    },

    route: "/shop?category=Crown%20Preparation%20Burs%20%26%20Kits",
  },

  {
    id: "paper-points",
    name: "Paper Points",

    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/paper%20point%20dt%20%281%29.jpg",
    },

    route: "/shop?category=Paper%20Points",
  },

  {
    id: "prophy-cups-brushes",
    name: "Prophy Cups & Brushes",

    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/prophy%20dt.jpg",
    },

    route: "/shop?category=Prophy%20Cups%20%26%20Brushes",
  },
];


// ═══════════════════════════════════════════════════════════════
// CATEGORY CARD
// ═══════════════════════════════════════════════════════════════

function CategoryCard({
  item,
  large = false,
  isMobile,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: "100%",

        height: isMobile
          ? 210
          : large
            ? 500
            : 240,

        borderRadius:
          isMobile ? 15 : 17,

        overflow: "hidden",

        backgroundColor:
          "#e9eef0",

        transform: [
          {
            scale:
              pressed ? 0.985 : 1,
          },
        ],

        opacity:
          pressed ? 0.92 : 1,

        ...(Platform.OS === "web"
          ? {
              cursor: "pointer",

              transition:
                "transform 0.2s ease, opacity 0.2s ease",

              boxShadow:
                "0 5px 18px rgba(15, 23, 42, 0.08)",
            }
          : {
              shadowColor:
                "#000",

              shadowOffset: {
                width: 0,
                height: 3,
              },

              shadowOpacity:
                0.08,

              shadowRadius:
                8,

              elevation: 3,
            }),
      })}
    >
      {/* IMAGE */}

      <Image
        source={item.image}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* SUBTLE OVERLAY */}

      <View
        pointerEvents="none"
        style={{
          position: "absolute",

          left: 0,
          right: 0,
          bottom: 0,

          height: 70,

          backgroundColor:
            "rgba(0,0,0,0.06)",
        }}
      />

      {/* MOBILE LABEL */}

      {isMobile && (
        <View
          style={{
            position: "absolute",

            left: 12,
            right: 12,
            bottom: 12,

            backgroundColor:
              "rgba(0,0,0,0.62)",

            borderRadius: 10,

            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: "#fff",

              fontSize: 12,

              fontWeight: "800",
            }}
          >
            {item.name}
          </Text>
        </View>
      )}
    </Pressable>
  );
}


// ═══════════════════════════════════════════════════════════════
// FEATURED CATEGORIES
// ═══════════════════════════════════════════════════════════════

export default function FeaturedCategories({
  items = categories,
}) {
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const isMobile =
    width < 640;

  const isTablet =
    width >= 640 &&
    width < 1024;


  // Safety fallback

  const safeItems =
    Array.isArray(items) &&
    items.length >= 5
      ? items
      : categories;


  // ═══════════════════════════════════════
  // CATEGORY NAVIGATION
  // ═══════════════════════════════════════

  const handleCategoryPress = (
    item
  ) => {
    if (!item) return;

    if (item.route) {
      router.push(item.route);

      return;
    }

    if (item.categoryId) {
      router.push(
        `/shop?category=${encodeURIComponent(
          item.categoryId
        )}`
      );
    }
  };


  // ═══════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════

  if (isMobile) {
    return (
      <View
        style={{
          width: "100%",
        }}
      >
        {/* HEADER */}

        <View
          style={{
            marginBottom: 17,
          }}
        >
          <Text
            style={{
              fontSize: 23,

              fontWeight: "900",

              color: "#122b45",

              letterSpacing: -0.6,
            }}
          >
            Featured Categories
          </Text>

          <View
            style={{
              width: 38,

              height: 3,

              borderRadius: 4,

              backgroundColor:
                "#09BBAF",

              marginTop: 7,
            }}
          />
        </View>


        {/* CARDS */}

        <View
          style={{
            gap: 12,
          }}
        >
          {safeItems.map(
            (item) => (
              <CategoryCard
                key={item.id}
                item={item}
                isMobile={true}
                onPress={() =>
                  handleCategoryPress(
                    item
                  )
                }
              />
            )
          )}
        </View>
      </View>
    );
  }


  // ═══════════════════════════════════════
  // DESKTOP / TABLET
  // ═══════════════════════════════════════

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      {/* SECTION HEADER */}

      <View
        style={{
          marginBottom:
            isTablet
              ? 17
              : 20,
        }}
      >
        <Text
          style={{
            fontSize:
              isTablet
                ? 25
                : 30,

            fontWeight: "900",

            color: "#122b45",

            letterSpacing: -0.7,
          }}
        >
          Featured Categories
        </Text>

        <View
          style={{
            width: 42,

            height: 3,

            borderRadius: 4,

            backgroundColor:
              "#09BBAF",

            marginTop: 7,
          }}
        />
      </View>


      {/* ═══════════════════════════════ */}
      {/* GRID */}
      {/* ═══════════════════════════════ */}

      <View
        style={{
          flexDirection: "row",

          width: "100%",

          gap:
            isTablet
              ? 12
              : 14,

          alignItems:
            "stretch",
        }}
      >
        {/* LEFT COLUMN */}

        <View
          style={{
            flex: 1,

            gap:
              isTablet
                ? 12
                : 14,
          }}
        >
          <CategoryCard
            item={safeItems[0]}
            isMobile={false}
            onPress={() =>
              handleCategoryPress(
                safeItems[0]
              )
            }
          />

          <CategoryCard
            item={safeItems[3]}
            isMobile={false}
            onPress={() =>
              handleCategoryPress(
                safeItems[3]
              )
            }
          />
        </View>


        {/* CENTER COLUMN */}

        <View
          style={{
            flex: 1,

            gap:
              isTablet
                ? 12
                : 14,
          }}
        >
          <CategoryCard
            item={safeItems[1]}
            isMobile={false}
            onPress={() =>
              handleCategoryPress(
                safeItems[1]
              )
            }
          />

          <CategoryCard
            item={safeItems[4]}
            isMobile={false}
            onPress={() =>
              handleCategoryPress(
                safeItems[4]
              )
            }
          />
        </View>


        {/* RIGHT LARGE CARD */}

        <View
          style={{
            flex: 0.65,

            minWidth:
              isTablet
                ? 230
                : 300,
          }}
        >
          <CategoryCard
            item={safeItems[2]}
            large
            isMobile={false}
            onPress={() =>
              handleCategoryPress(
                safeItems[2]
              )
            }
          />
        </View>
      </View>
    </View>
  );
}