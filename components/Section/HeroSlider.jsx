import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ═══════════════════════════════════════════════════════════════
// SLIDES
// ═══════════════════════════════════════════════════════════════

const slides = [
  {
    id: "prime-dental",
    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Prime-Dental-DT.jpg",
    },
    route: "/shop",
  },

  {
    id: "setup-kit",
    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Setup-Kit-DT%20(1).jpg",
    },
    route: "/shop",
  },

  {
    id: "whatsapp",
    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/WhatsApp%20Image%202026-08-21%20at%207.11.39%20PM.jpeg",
    },
    route: "/shop",
  },

  {
    id: "intravue",
    image: {
      uri: "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Intravue-DT.jpg",
    },
    route: "/shop",
  },
];

// ═══════════════════════════════════════════════════════════════
// HERO SLIDER
// ═══════════════════════════════════════════════════════════════

export default function HeroSlider() {
  const router = useRouter();

  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });

  const intervalRef = useRef(null);

  const isMobile = width < 640;

  const currentSlide = slides[activeIndex];

  // ═══════════════════════════════════════════════════════════════
  // GET ACTUAL IMAGE SIZE
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!currentSlide?.image?.uri) return;

    Image.getSize(
      currentSlide.image.uri,
      (imageWidth, imageHeight) => {
        setImageSize({
          width: imageWidth,
          height: imageHeight,
        });
      },
      (error) => {
        console.log("Hero image size error:", error);
      }
    );
  }, [currentSlide]);

  // ═══════════════════════════════════════════════════════════════
  // CALCULATE ACTUAL HEIGHT
  // ═══════════════════════════════════════════════════════════════

  const imageRatio =
    imageSize.width > 0
      ? imageSize.height / imageSize.width
      : 0.35;

  const heroHeight = width * imageRatio;

  // ═══════════════════════════════════════════════════════════════
  // AUTO SLIDE
  // ═══════════════════════════════════════════════════════════════

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        return (prev + 1) % slides.length;
      });
    }, 4500);
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // PREVIOUS
  // ═══════════════════════════════════════════════════════════════

  const handlePrevious = () => {
    setActiveIndex((prev) => {
      return prev === 0
        ? slides.length - 1
        : prev - 1;
    });

    startAutoSlide();
  };

  // ═══════════════════════════════════════════════════════════════
  // NEXT
  // ═══════════════════════════════════════════════════════════════

  const handleNext = () => {
    setActiveIndex((prev) => {
      return (prev + 1) % slides.length;
    });

    startAutoSlide();
  };

  // ═══════════════════════════════════════════════════════════════
  // DOT
  // ═══════════════════════════════════════════════════════════════

  const goToSlide = (index) => {
    setActiveIndex(index);

    startAutoSlide();
  };

  // ═══════════════════════════════════════════════════════════════
  // HERO
  // ═══════════════════════════════════════════════════════════════

  return (
    <View
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: isMobile ? 12 : 18,
        backgroundColor: "#ffffff",

        ...(Platform.OS === "web"
          ? {
              boxShadow:
                "0 8px 30px rgba(15, 23, 42, 0.08)",
            }
          : {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }),
      }}
    >
      {/* ═══════════════════════════════════════════════════════ */}
      {/* IMAGE */}
      {/* ═══════════════════════════════════════════════════════ */}

      <Pressable
        onPress={() => {
          if (currentSlide?.route) {
            router.push(currentSlide.route);
          }
        }}
        style={{
          width: "100%",
        }}
      >
        <Image
          source={currentSlide.image}
          resizeMode="contain"
          style={{
            width: "100%",
            height: heroHeight,

            backgroundColor: "#ffffff",
          }}
        />
      </Pressable>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* WEB ONLY — PREVIOUS */}
      {/* ═══════════════════════════════════════════════════════ */}

      {Platform.OS === "web" && (
        <Pressable
          onPress={handlePrevious}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Previous slide"
          style={({ pressed }) => ({
            position: "absolute",

            left: 18,
            top: "50%",

            transform: [
              {
                translateY: -21,
              },
            ],

            width: 42,
            height: 42,

            borderRadius: 999,

            alignItems: "center",
            justifyContent: "center",

            backgroundColor: pressed
              ? "#ffffff"
              : "rgba(255,255,255,0.92)",

            cursor: "pointer",

            boxShadow:
              "0 4px 16px rgba(0,0,0,0.16)",
          })}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#122b45"
          />
        </Pressable>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* WEB ONLY — NEXT */}
      {/* ═══════════════════════════════════════════════════════ */}

      {Platform.OS === "web" && (
        <Pressable
          onPress={handleNext}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Next slide"
          style={({ pressed }) => ({
            position: "absolute",

            right: 18,
            top: "50%",

            transform: [
              {
                translateY: -21,
              },
            ],

            width: 42,
            height: 42,

            borderRadius: 999,

            alignItems: "center",
            justifyContent: "center",

            backgroundColor: pressed
              ? "#ffffff"
              : "rgba(255,255,255,0.92)",

            cursor: "pointer",

            boxShadow:
              "0 4px 16px rgba(0,0,0,0.16)",
          })}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#122b45"
          />
        </Pressable>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DOTS */}
      {/* ═══════════════════════════════════════════════════════ */}

      <View
        style={{
          position: "absolute",

          left: 0,
          right: 0,

          bottom: isMobile ? 10 : 14,

          flexDirection: "row",

          alignItems: "center",
          justifyContent: "center",

          gap: 6,
        }}
      >
        {slides.map((slide, index) => {
          const active = index === activeIndex;

          return (
            <Pressable
              key={slide.id}
              onPress={() => goToSlide(index)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Go to slide ${
                index + 1
              }`}
              style={{
                width: active
                  ? isMobile
                    ? 18
                    : 22
                  : 7,

                height: 7,

                borderRadius: 999,

                backgroundColor: active
                  ? "#CD0F0F"
                  : "rgba(255,255,255,0.95)",
              }}
            />
          );
        })}
      </View>
    </View>
  );
}