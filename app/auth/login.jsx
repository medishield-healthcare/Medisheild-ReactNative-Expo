import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "src/context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BrandPanel from "./components/BrandPanel";

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT STRATEGY:
//   • Web (width >= 768px) → Full-screen split: Left 50% brand panel + Right 50% form
//   • Mobile              → Centered card (original design)
//   • useWindowDimensions → reactive, works on web resize too
// ─────────────────────────────────────────────────────────────────────────────

// ── Floating Label Input ───────────────────────────────────────────────────────
function FloatingInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType = "default",
  iconName,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActive = focused || value.length > 0;
  const isSecure = secureTextEntry && !showPassword;

  return (
    <View
      className={[
        "relative rounded-2xl border-2",
        focused ? "border-teal-600 bg-white" : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      {/* Left Icon */}
      <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
        <Ionicons
          name={iconName}
          size={18}
          color={focused ? "#0f766e" : "#94a3b8"}
        />
      </View>

      {/* Floating Label */}
      <Text
        className={[
          "absolute left-11 font-medium",
          isActive
            ? "top-2 text-[10px] tracking-widest uppercase"
            : "top-[17px] text-[15px] text-slate-400",
          isActive
            ? focused
              ? "text-teal-700"
              : "text-teal-500"
            : "",
        ].join(" ")}
        style={{ pointerEvents: "none" }}
      >
        {label}
      </Text>

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={isSecure}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        placeholderTextColor="transparent"
        selectionColor="#0f766e"
        className="pl-11 pr-12 pt-6 pb-3 text-[15px] text-slate-800 font-semibold"
        style={Platform.OS === "web" ? { outlineStyle: "none" } : {}}
      />

      {/* Right icon */}
      <View className="absolute right-4 top-0 bottom-0 justify-center">
        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={10} className="p-1">
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#94a3b8"
            />
          </Pressable>
        ) : value.length > 0 ? (
          <Ionicons name="checkmark-circle" size={18} color="#14b8a6" />
        ) : null}
      </View>

      {/* Focus underline */}
      {focused && (
        <View className="absolute bottom-0 left-4 right-4 h-[2px] bg-teal-600 rounded-full" />
      )}
    </View>
  );
}

// // ── Left Brand Panel (web only) ────────────────────────────────────────────────
// function BrandPanel() {
//   const features = [
//     { icon: "sparkles-outline",        text: "Premium dental products" },
//     { icon: "shield-checkmark-outline", text: "Clinically tested & certified" },
//     { icon: "rocket-outline",           text: "Fast nationwide delivery" },
//     { icon: "heart-outline",            text: "Trusted by 50,000+ customers" },
//   ];

//   return (
//     <View
//       className="flex-1 relative overflow-hidden"
//       style={{ backgroundColor: "#0f4f4f" }}
//     >
//       {/* ── Decorative circles ── */}
//       <View
//         style={{
//           position: "absolute", width: 420, height: 420, borderRadius: 210,
//           backgroundColor: "#0d766e", opacity: 0.4,
//           top: -120, right: -100,
//         }}
//       />
//       <View
//         style={{
//           position: "absolute", width: 300, height: 300, borderRadius: 150,
//           backgroundColor: "#14b8a6", opacity: 0.15,
//           bottom: 60, left: -80,
//         }}
//       />
//       <View
//         style={{
//           position: "absolute", width: 180, height: 180, borderRadius: 90,
//           backgroundColor: "#14b8a6", opacity: 0.12,
//           top: "40%", left: "55%",
//         }}
//       />

//       {/* ── Grid dot pattern overlay ── */}
//       <View
//         style={{
//           position: "absolute", inset: 0, opacity: 0.06,
//           backgroundImage: Platform.OS === "web"
//             ? "radial-gradient(circle, #ffffff 1px, transparent 1px)"
//             : undefined,
//           backgroundSize: Platform.OS === "web" ? "28px 28px" : undefined,
//         }}
//       />

//       {/* ── Content ── */}
//       <View className="flex-1 justify-between px-12 py-14">

//         {/* Top: Logo */}
//         <View className="flex-row items-center gap-3">
//           <View className="w-11 h-11 rounded-xl bg-white/15 items-center justify-center">
//             <Ionicons name="medical" size={22} color="white" />
//           </View>
//           <View>
//             <Text className="text-white text-lg font-black tracking-tight">
//               MediShield
//             </Text>
//             <Text style={{ color: "#5eead4", fontSize: 10, fontWeight: "700", letterSpacing: 2 }}>
//               DENTAL CARE
//             </Text>
//           </View>
//         </View>

//         {/* Middle: Hero text */}
//         <View>
//           {/* Eyebrow */}
//           <View
//             className="self-start  mt-2 flex-row items-center gap-2 rounded-full px-3 py-1 mb-5"
//             style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
//           >
//             <View className="w-1.5 h-1.5 rounded-full bg-teal-400" />
//             <Text style={{ color: "#5eead4", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 }}>
//               INDIA'S #1 DENTAL STORE
//             </Text>
//           </View>

//           <Text
//             className="text-white font-black leading-tight mb-4"
//             style={{ fontSize: 40, letterSpacing: -1 }}
//           >
//             Your Smile,{"\n"}
//             <Text style={{ color: "#2dd4bf" }}>Our Priority.</Text>
//           </Text>

//           <Text style={{ color: "#94d8d4", fontSize: 15, lineHeight: 24, maxWidth: 320 }}>
//             Shop clinically approved dental products trusted by dentists and
//             patients across India.
//           </Text>

//           {/* Feature list */}
//           <View className="mt-4 gap-2">
//             {features.map((f) => (
//               <View key={f.text} className="flex-row items-center gap-3">
//                 <View
//                   className="w-9 h-9 rounded-xl items-center justify-center"
//                   style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
//                 >
//                   <Ionicons name={f.icon} size={17} color="#2dd4bf" />
//                 </View>
//                 <Text style={{ color: "#cbd5e1", fontSize: 14, fontWeight: "500" }}>
//                   {f.text}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Bottom: Stats row */}
//         <View className="flex-row mt-3 gap-8">
//           {[
//             { value: "50K+", label: "Customers" },
//             { value: "200+", label: "Products" },
//             { value: "4.9★", label: "Rating" },
//           ].map((s) => (
//             <View key={s.label}>
//               <Text className="text-white font-black text-2xl">{s.value}</Text>
//               <Text style={{ color: "#5eead4", fontSize: 12, fontWeight: "600" }}>
//                 {s.label}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     </View>
//   );
// }

// ── Right Form Panel ───────────────────────────────────────────────────────────
function FormPanel({ isWeb }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return setError("Please enter your email and password.");
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      router.replace("/");
    } catch (err) {
      console.log(err?.response?.data || err.message);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className={isWeb ? "flex-1 bg-white" : "flex-1 bg-teal-50"}
      contentContainerClassName="flex-grow justify-center items-center px-6 py-12"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Mobile: background blobs */}
      {!isWeb && (
        <>
          <View
            style={{
              position: "absolute", top: -80, right: -60,
              width: 240, height: 240, borderRadius: 120,
              backgroundColor: "#ccfbf1", opacity: 0.6,
            }}
          />
          <View
            style={{
              position: "absolute", bottom: -60, left: -50,
              width: 200, height: 200, borderRadius: 100,
              backgroundColor: "#d1fae5", opacity: 0.5,
            }}
          />
        </>
      )}

      {/* ── Form container ── */}
      <View
        style={[
          { width: "100%", maxWidth: isWeb ? 400 : 440 },
          !isWeb && {
            backgroundColor: "white",
            borderRadius: 28,
            padding: 32,
            shadowColor: "#0f766e",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12,
            shadowRadius: 32,
            elevation: 10,
          },
        ]}
      >
        {/* Mobile only: brand logo inside card */}
        {!isWeb && (
          <View className="items-center mb-7">
            {/* <View className="w-[76px] h-[76px] rounded-full bg-teal-50 border-4 border-teal-100 items-center justify-center mb-3">
              <View className="w-14 h-14 rounded-full bg-teal-700 items-center justify-center">
                <Ionicons name="medical" size={26} color="white" />
              </View>
            </View>
            <Text className="text-[22px] font-black text-teal-900 tracking-tight">
              MediShield
            </Text>
            <View className="mt-1.5 px-3 py-0.5 bg-teal-50 border border-teal-200 rounded-full">
              <Text className="text-[10px] font-bold text-teal-700 tracking-[2.5px] uppercase">
                Dental Care
              </Text>
            </View> */}
            <Image 
              source={require('../../assets/logo.png')} 
              style={{
                width: 146,
                height: 76,
                resizeMode: 'contain',
                mixBlendMode: 'multiply',
              }}
            />
          </View>
        )}

        {/* Heading */}
        <View className="mb-7">
          <Text
            className="font-extrabold text-slate-900 tracking-tight leading-tight"
            style={{ fontSize: isWeb ? 32 : 28 }}
          >
            Welcome back 👋
          </Text>
          <Text className="mt-2 text-sm text-slate-500 leading-5">
            Sign in to access your MediShield account
          </Text>
        </View>

        {/* Error */}
        {!!error && (
          <View
            className="flex-row items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
            style={{ borderLeftWidth: 3, borderLeftColor: "#ef4444" }}
          >
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text className="text-sm text-red-600 font-medium flex-1">{error}</Text>
          </View>
        )}

        {/* Inputs */}
        <View className="gap-4">
          <FloatingInput
            label="Email address"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(""); }}
            iconName="mail-outline"
            keyboardType="email-address"
          />
          <FloatingInput
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(""); }}
            iconName="lock-closed-outline"
            secureTextEntry
          />
        </View>

        {/* Forgot */}
        <Pressable
          className="self-end mt-3 mb-1 py-1"
          onPress={() => router.push("/forgot-password")}
        >
          <Text className="text-[13px] text-teal-700 font-semibold">
            Forgot password?
          </Text>
        </Pressable>

        {/* Sign In button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="mt-4 rounded-2xl py-[15px] items-center justify-center flex-row gap-2 bg-teal-700 active:bg-teal-800 active:opacity-90 disabled:opacity-60"
          style={
            Platform.OS === "web"
              ? { boxShadow: "0 8px 24px rgba(15,118,110,0.28)" }
              : {
                  shadowColor: "#0f766e",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }
          }
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text className="text-white text-[15px] font-bold tracking-wide">
                Sign In
              </Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center gap-3 my-6">
          <View className="flex-1 h-px bg-slate-100" />
          <Text className="text-xs text-slate-400 font-semibold tracking-widest">OR</Text>
          <View className="flex-1 h-px bg-slate-100" />
        </View>

        {/* Register */}
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-slate-500">Don't have an account? </Text>
          <Pressable onPress={() => router.push("/auth/registration")}>
            <Text className="text-sm text-teal-700 font-bold">Create account →</Text>
          </Pressable>
        </View>

        {/* Trust badges */}
        <View
          className="flex-row justify-center gap-5 mt-3 pt-5"
          style={{ borderTopWidth: 1, borderTopColor: "#f1f5f9" }}
        >
          {[
            { icon: "shield-checkmark-outline", label: "Secure" },
            { icon: "lock-closed-outline",       label: "Encrypted" },
            { icon: "star-outline",               label: "Trusted" },
          ].map((b) => (
            <View key={b.label} className="flex-row items-center gap-1.5">
              <Ionicons name={b.icon} size={12} color="#94a3b8" />
              <Text className="text-[11px] text-slate-400 font-medium">{b.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text className="mt-8 text-xs text-slate-400 text-center">
        © 2025 MediShield · All rights reserved
      </Text>
    </ScrollView>
  );
}

// ── Root Export ────────────────────────────────────────────────────────────────
export default function Login() {
  const { width } = useWindowDimensions();

  // Breakpoint: >= 768px = web/tablet split layout
  const isWeb = Platform.OS === "web" && width >= 768;

  if (isWeb) {
    // ── SPLIT LAYOUT ──
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <BrandPanel />
        <FormPanel isWeb={true} />
      </View>
    );
  }

  // ── MOBILE LAYOUT ──
  return (
    <SafeAreaView className="flex-1 bg-teal-50">
      <FormPanel isWeb={false} />
    </SafeAreaView>
  );
}