import React from "react";
import {
  View,
  Text,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ── Left Brand Panel (web only) ────────────────────────────────────────────────
export default function BrandPanel() {
  const features = [
    { icon: "sparkles-outline",        text: "Premium dental products" },
    { icon: "shield-checkmark-outline", text: "Clinically tested & certified" },
    { icon: "rocket-outline",           text: "Fast nationwide delivery" },
    { icon: "heart-outline",            text: "Trusted by 50,000+ customers" },
  ];

  return (
    <View
      className="flex-1 relative overflow-hidden"
      style={{ backgroundColor: "#09BBAF" }}
    >
      {/* ── Decorative circles ── */}
      <View
        style={{
          position: "absolute", width: 420, height: 420, borderRadius: 210,
          backgroundColor: "#0d766e", opacity: 0.4,
          top: -120, right: -100,
        }}
      />
      <View
        style={{
          position: "absolute", width: 300, height: 300, borderRadius: 150,
          backgroundColor: "#14b8a6", opacity: 0.15,
          bottom: 60, left: -80,
        }}
      />
      <View
        style={{
          position: "absolute", width: 180, height: 180, borderRadius: 90,
          backgroundColor: "#14b8a6", opacity: 0.12,
          top: "40%", left: "55%",
        }}
      />

      {/* ── Grid dot pattern overlay ── */}
      <View
        style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: Platform.OS === "web"
            ? "radial-gradient(circle, #ffffff 1px, transparent 1px)"
            : undefined,
          backgroundSize: Platform.OS === "web" ? "28px 28px" : undefined,
        }}
      />

      {/* ── Content ── */}
      <View className="flex-1 justify-between px-12 py-14">

        {/* Top: Logo */}
        {/* <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-white/15 items-center justify-center">
            <Ionicons name="medical" size={22} color="white" />
          </View>
          <View>
            <Text className="text-white text-lg font-black tracking-tight">
              MediShield
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 10, fontWeight: "700", letterSpacing: 2 }}>
              DENTAL CARE
            </Text>
          </View>
        </View> */}
        <Image source={require("../../../assets/medisheild-white.png")} style={{ width: 200, height: 100, resizeMode : "contain" }} />

        {/* Middle: Hero text */}
        <View>
          {/* Eyebrow */}
          <View
            className="self-start  mt-2 flex-row items-center gap-2 rounded-full px-3 py-1 mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <View className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 }}>
              INDIA'S #1 DENTAL STORE
            </Text>
          </View>

          <Text
            className="text-white font-black leading-tight mb-4"
            style={{ fontSize: 40, letterSpacing: -1 }}
          >
            Your Smile,{"\n"}
            <Text style={{ color: "#2dd4bf" }}>Our Priority.</Text>
          </Text>

          <Text style={{ color: "#ffffff", fontSize: 15, lineHeight: 24, maxWidth: 320 }}>
            Shop clinically approved dental products trusted by dentists and
            patients across India.
          </Text>

          {/* Feature list */}
          <View className="mt-4 gap-2">
            {features.map((f) => (
              <View key={f.text} className="flex-row items-center gap-3">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Ionicons name={f.icon} size={17} color="#2dd4bf" />
                </View>
                <Text style={{ color: "#cbd5e1", fontSize: 14, fontWeight: "500" }}>
                  {f.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom: Stats row */}
        <View className="flex-row mt-3 gap-8">
          {[
            { value: "50K+", label: "Customers" },
            { value: "200+", label: "Products" },
            { value: "4.9★", label: "Rating" },
          ].map((s) => (
            <View key={s.label}>
              <Text className="text-white font-black text-2xl">{s.value}</Text>
              <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "600" }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}