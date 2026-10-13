import React, { useState, useContext } from 'react';
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
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from 'src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BrandPanel from './components/BrandPanel';
import C from '@/utils/theme';

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
  autoCapitalize = 'none',
  keyboardType = 'default',
  iconName,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActive = focused || value.length > 0;
  const isSecure = secureTextEntry && !showPassword;

  return (
    <View
      className={[
        'relative rounded-2xl border-2',
        focused ? 'border-red-600 bg-white' : 'border-slate-200 bg-slate-50',
      ].join(' ')}>
      {/* Left Icon */}
      <View className="absolute bottom-0 left-4 top-0 z-10 justify-center">
        <Ionicons name={iconName} size={18} color={focused ? '#CD0F0F' : '#94a3b8'} />
      </View>

      {/* Floating Label */}
      <Text
        className={[
          'absolute left-11 font-medium',
          isActive
            ? 'top-2 text-[10px] uppercase tracking-widest'
            : 'top-[17px] text-[15px] text-slate-400',
          isActive ? (focused ? 'text-red-700' : 'text-red-500') : '',
        ].join(' ')}
        style={{ fontFamily : 'Poppins_400Regular', pointerEvents: 'none' }}>
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
        selectionColor="#CD0F0F"
        className="pb-3 pl-11 pr-12 pt-6 text-[15px] font-semibold text-slate-800"
        style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
      />

      {/* Right icon */}
      <View className="absolute bottom-0 right-4 top-0 justify-center">
        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={10} className="p-1">
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
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
        <View className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-red-600" />
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
//       style={{ fontFamily : 'Poppins_400Regular', backgroundColor: "#CD0F0F" }}
//     >
//       {/* ── Decorative circles ── */}
//       <View
//         style={{ fontFamily : 'Poppins_400Regular',
//           position: "absolute", width: 420, height: 420, borderRadius: 210,
//           backgroundColor: "#0d766e", opacity: 0.4,
//           top: -120, right: -100,
//         }}
//       />
//       <View
//         style={{ fontFamily : 'Poppins_400Regular',
//           position: "absolute", width: 300, height: 300, borderRadius: 150,
//           backgroundColor: "#14b8a6", opacity: 0.15,
//           bottom: 60, left: -80,
//         }}
//       />
//       <View
//         style={{ fontFamily : 'Poppins_400Regular',
//           position: "absolute", width: 180, height: 180, borderRadius: 90,
//           backgroundColor: "#14b8a6", opacity: 0.12,
//           top: "40%", left: "55%",
//         }}
//       />

//       {/* ── Grid dot pattern overlay ── */}
//       <View
//         style={{ fontFamily : 'Poppins_400Regular',
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
//             <Text style={{ fontFamily : 'Poppins_400Regular', color: "#ffffff", fontSize: 10, fontWeight: "700", letterSpacing: 2 }}>
//               DENTAL CARE
//             </Text>
//           </View>
//         </View>

//         {/* Middle: Hero text */}
//         <View>
//           {/* Eyebrow */}
//           <View
//             className="self-start  mt-2 flex-row items-center gap-2 rounded-full px-3 py-1 mb-5"
//             style={{ fontFamily : 'Poppins_400Regular', backgroundColor: "rgba(255,255,255,0.1)" }}
//           >
//             <View className="w-1.5 h-1.5 rounded-full bg-teal-400" />
//             <Text style={{ fontFamily : 'Poppins_400Regular', color: "#ffffff", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 }}>
//               INDIA'S #1 DENTAL STORE
//             </Text>
//           </View>

//           <Text
//             className="text-white font-black leading-tight mb-4"
//             style={{ fontFamily : 'Poppins_400Regular', fontSize: 40, letterSpacing: -1 }}
//           >
//             Your Smile,{"\n"}
//             <Text style={{ fontFamily : 'Poppins_400Regular', color: "#2dd4bf" }}>Our Priority.</Text>
//           </Text>

//           <Text style={{ fontFamily : 'Poppins_400Regular', color: "#ffffff", fontSize: 15, lineHeight: 24, maxWidth: 320 }}>
//             Shop clinically approved dental products trusted by dentists and
//             patients across India.
//           </Text>

//           {/* Feature list */}
//           <View className="mt-4 gap-2">
//             {features.map((f) => (
//               <View key={f.text} className="flex-row items-center gap-3">
//                 <View
//                   className="w-9 h-9 rounded-xl items-center justify-center"
//                   style={{ fontFamily : 'Poppins_400Regular', backgroundColor: "rgba(255,255,255,0.1)" }}
//                 >
//                   <Ionicons name={f.icon} size={17} color="#2dd4bf" />
//                 </View>
//                 <Text style={{ fontFamily : 'Poppins_400Regular', color: "#cbd5e1", fontSize: 14, fontWeight: "500" }}>
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
//               <Text style={{ fontFamily : 'Poppins_400Regular', color: "#ffffff", fontSize: 12, fontWeight: "600" }}>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return setError('Please enter your email and password.');
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      router.replace('/');
    } catch (err) {
      console.log(err?.response?.data || err.message);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className={isWeb ? 'flex-1 bg-white' : 'flex-1 bg-teal-50'}
      contentContainerClassName="flex-grow justify-center items-center px-6 py-12"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* Mobile: background blobs */}
      {!isWeb && (
        <>
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              position: 'absolute',
              top: -80,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: 120,
              backgroundColor: '#ccfbf1',
              opacity: 0.6,
            }}
          />
          <View
            style={{ fontFamily : 'Poppins_400Regular',
              position: 'absolute',
              bottom: -60,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: '#d1fae5',
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* ── Form container ── */}
      <View
        style={[
          { width: '100%', maxWidth: isWeb ? 400 : 440 },
          !isWeb && {
            backgroundColor: 'white',
            borderRadius: 28,
            padding: 32,
            shadowColor: '#CD0F0F',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12,
            shadowRadius: 32,
            elevation: 10,
          },
        ]}>
        {/* Mobile only: brand logo inside card */}
        {!isWeb && (
          <View className="mb-7 items-center">
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
              style={{ fontFamily : 'Poppins_400Regular',
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
            className="font-extrabold leading-tight tracking-tight text-slate-900"
            style={{ fontFamily : 'Poppins_400Regular', fontSize: isWeb ? 32 : 28 }}>
            Welcome back 👋
          </Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">
            Sign in to access your MediShield account
          </Text>
        </View>

        {/* Error */}
        {!!error && (
          <View
            className="mb-5 flex-row items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            style={{ fontFamily : 'Poppins_400Regular', borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text className="flex-1 text-sm font-medium text-red-600">{error}</Text>
          </View>
        )}

        {/* Inputs */}
        <View className="gap-4">
          <FloatingInput
            label="Email address"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError('');
            }}
            iconName="mail-outline"
            keyboardType="email-address"
          />
          <FloatingInput
            label="Password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError('');
            }}
            iconName="lock-closed-outline"
            secureTextEntry
          />
        </View>

        {/* Forgot */}
        {/* <Pressable
          className="mb-1 mt-3 self-end py-1"
          onPress={() => router.push('/forgot-password')}>
          <Text className="text-[13px] font-semibold text-teal-700">Forgot password?</Text>
        </Pressable> */}

        {/* Sign In button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl py-[15px] active:bg-teal-800 active:opacity-90 disabled:opacity-60"
          style={
            Platform.OS === 'web'
              ? { boxShadow: '0 8px 24px rgba(15,118,110,0.28)', backgroundColor: C.primaryDark }
              : {
                  shadowColor: '#CD0F0F',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                  backgroundColor: C.primaryDark,
                }
          }>
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text className="text-[15px] font-bold tracking-wide text-white">Sign In</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

        {/* Divider */}
        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-slate-100" />
          <Text className="text-xs font-semibold tracking-widest text-slate-400">OR</Text>
          <View className="h-px flex-1 bg-slate-100" />
        </View>

        {/* Register */}
        <View className="flex-row items-center justify-center">
          <Text className="text-sm text-slate-500">Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/registration')}>
            <Text style={{ fontFamily : 'Poppins_400Regular', color: C.primary }} className="text-sm font-bold ">Create account →</Text>
          </Pressable>
        </View>

        {/* Trust badges */}
        <View
          className="mt-3 flex-row justify-center gap-5 pt-5"
          style={{ fontFamily : 'Poppins_400Regular', borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
          {[
            { icon: 'shield-checkmark-outline', label: 'Secure' },
            { icon: 'lock-closed-outline', label: 'Encrypted' },
            { icon: 'star-outline', label: 'Trusted' },
          ].map((b) => (
            <View key={b.label} className="flex-row items-center gap-1.5">
              <Ionicons name={b.icon} size={12} color="#94a3b8" />
              <Text className="text-[11px] font-medium text-slate-400">{b.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <Text className="mt-8 text-center text-xs text-slate-400">
        © 2026 MediShield · All rights reserved
      </Text>
       <View
                  style={{
                    fontFamily: 'Poppins_400Regular',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    // borderTopWidth: 1,
                    borderTopColor: 'rgba(0,0,0,0.06)',
                    width: '100%',
                    // marginTop: 20,
                  }}>
                  <Pressable
                    onPress={() => Linking.openURL('https://www.infoseeksoftwaresystems.com/')}
                    style={({ pressed }) => ({
                      flex: 1,
                      fontFamily: 'Poppins_400Regular',
                      flexDirection: 'row',
                      alignItems: 'center',
                      opacity: pressed ? 0.6 : 1,
                    })}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 10,
                        fontWeight: '500',
                        color: C.primary,
                        letterSpacing: 0.2,
                      }}>
                      Powered by{' '}
                    </Text>
      
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 10,
                        fontWeight: '500',
                        color: '#111827',
                        letterSpacing: 0.3,
                        textAlign: 'center',
                      }}>
                      Infoseek
                    </Text>
                  </Pressable>
                </View>
    </ScrollView>
  );
}

// ── Root Export ────────────────────────────────────────────────────────────────
export default function Login() {
  const { width } = useWindowDimensions();

  // Breakpoint: >= 768px = web/tablet split layout
  const isWeb = Platform.OS === 'web' && width >= 768;

  if (isWeb) {
    // ── SPLIT LAYOUT ──
    return (
      <View style={{ fontFamily : 'Poppins_400Regular', flex: 1, flexDirection: 'row' }}>
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
