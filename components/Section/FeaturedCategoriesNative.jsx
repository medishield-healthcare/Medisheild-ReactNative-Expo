import React from "react";

import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

// ======================================================
// CATEGORY DATA
// ======================================================

const categories = [
  {
    id: "articulating-paper",

    name: "Articulating Paper",

    image:
      "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/articulating%20paper%20dt.jpg",

    category: "Articulating Paper",
  },

  {
    id: "dental-gifts",

    name: "Dental Gifts",

    image:
      "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/dental%20gift%20dt.jpg",

    category: "Dental Gifts",
  },

  {
    id: "crown-preparation",

    name: "Crown Preparation Burs & Kits",

    image:
      "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/crown%20dt%20%281%29.jpg",

    category: "Crown Preparation Burs & Kits",
  },

  {
    id: "paper-points",

    name: "Paper Points",

    image:
      "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/paper%20point%20dt%20%281%29.jpg",

    category: "Paper Points",
  },

  {
    id: "prophy-cups-brushes",

    name: "Prophy Cups & Brushes",

    image:
      "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/prophy%20dt.jpg",

    category: "Prophy Cups & Brushes",
  },
];

// ======================================================
// CATEGORY CARD
// ======================================================

function CategoryCard({
  item,
  onPress,
  isLast,
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: "rgba(0,0,0,0.08)",
      }}
      style={({ pressed }) => [
        styles.cardWrapper,

        !isLast && {
          marginBottom: 14,
        },

        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.card}>
        {/* IMAGE */}

        <Image
          source={item.image}
          style={styles.categoryImage}
          contentFit="cover"
          contentPosition="top"
          transition={250}
          cachePolicy="memory-disk"
          recyclingKey={item.id}
          onError={(error) => {
            console.log(
              "Image loading error:",
              item.name,
              error
            );
          }}
        />

        {/* BOTTOM DARK OVERLAY */}

        <View
          pointerEvents="none"
          style={styles.overlay}
        />

        {/* CATEGORY TITLE */}

        {/* <View
          pointerEvents="none"
          style={styles.categoryTitleBox}
        >
          <Text
            style={styles.categoryTitle}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View> */}
      </View>
    </Pressable>
  );
}

// ======================================================
// HOME SCREEN
// ======================================================

export default function FeaturedCategoriesNative() {
  const router = useRouter();

  // ====================================================
  // HANDLE CATEGORY CLICK
  // ====================================================

  const handleCategoryPress = (item) => {
    if (!item) return;

    const selectedCategory =
      item.category ||
      item.name;

    if (!selectedCategory) return;

    router.push({
      pathname: "/shop",

      params: {
        category: selectedCategory,
      },
    });
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================= */}
        {/* FEATURED CATEGORY SECTION */}
        {/* ============================================= */}

        <View style={styles.section}>
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.heading}>
              Featured Categories
            </Text>

            <View style={styles.redLine} />
          </View>

          {/* CATEGORY CARDS */}

          <View style={styles.categoriesContainer}>
            {categories.map(
              (item, index) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  isLast={
                    index ===
                    categories.length - 1
                  }
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
      </ScrollView>
    </View>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  // ====================================================
  // MAIN SCREEN
  // ====================================================

  screen: {
    flex: 1,

    backgroundColor: "#F5FBFC",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 35,
  },

  // ====================================================
  // SECTION
  // ====================================================

  section: {
    width: "100%",

    paddingHorizontal: 16,

    paddingTop: 18,
  },

  // ====================================================
  // HEADER
  // ====================================================

  header: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 26,

    lineHeight: 32,

    fontWeight: "900",

    color: "#122B45",

    letterSpacing: -0.7,
  },

  redLine: {
    width: 42,

    height: 4,

    borderRadius: 100,

    backgroundColor: "#CD0F0F",

    marginTop: 8,
  },

  // ====================================================
  // CATEGORIES
  // ====================================================

  categoriesContainer: {
    width: "100%",
  },

  // ====================================================
  // CARD WRAPPER
  // ====================================================

  cardWrapper: {
    width: "100%",
    marginBottom: 14,

    borderRadius: 15,

    ...Platform.select({
      ios: {
        shadowColor: "#000",

        shadowOffset: {
          width: 0,
          height: 3,
        },

        shadowOpacity: 0.1,

        shadowRadius: 7,
      },

      android: {
        elevation: 4,
      },

      web: {
        shadowColor: "#000",

        shadowOffset: {
          width: 0,
          height: 3,
        },

        shadowOpacity: 0.08,

        shadowRadius: 7,
      },
    }),
  },

  // ====================================================
  // CARD
  // ====================================================

  card: {
    width: "100%",
    marginBottom: 14,

    /*
      IMPORTANT

      Don't use:

      height: 210

      because it can make the banner too tall
      on some mobile devices.

      This keeps the banner responsive.
    */

    aspectRatio: 1.9,

    borderRadius: 15,

    overflow: "hidden",

    backgroundColor: "#E4EAEE",

    position: "relative",
  },

  cardPressed: {
    opacity: 0.92,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  // ====================================================
  // IMAGE
  // ====================================================

  categoryImage: {
    position: "absolute",

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    width: "100%",

    height: "100%",
  },

  // ====================================================
  // BOTTOM OVERLAY
  // ====================================================

  overlay: {
    position: "absolute",

    left: 0,

    right: 0,

    bottom: 0,

    height: "45%",

    backgroundColor:
      "rgba(0,0,0,0.12)",
  },

  // ====================================================
  // CATEGORY TITLE BOX
  // ====================================================

  categoryTitleBox: {
    position: "absolute",

    left: 12,

    right: 12,

    bottom: 12,

    backgroundColor:
      "rgba(0,0,0,0.64)",

    borderRadius: 10,

    paddingHorizontal: 13,

    paddingVertical: 10,
  },

  categoryTitle: {
    color: "#FFFFFF",

    fontSize: 14,

    lineHeight: 19,

    fontWeight: "800",
  },
});