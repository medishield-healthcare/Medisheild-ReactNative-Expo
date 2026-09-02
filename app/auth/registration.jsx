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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from 'src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import API from '@/api/axios';
import C from '@/utils/theme';

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND FIELDS (from createUser controller):
//   firstname, lastname, email, mobile, password, referralCode (optional)
//   → On success: 50 MediShield coins rewarded
//   → Referrer gets 100 coins if valid referralCode provided
// ─────────────────────────────────────────────────────────────────────────────

// ── Floating Label Input ───────────────────────────────────────────────────────
function FloatingInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'words',
  keyboardType = 'default',
  iconName,
  optional = false,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActive = focused || value.length > 0;
  const isSecure = secureTextEntry && !showPassword;

  return (
    <View
      className={[
        'relative rounded-2xl border-2',
        focused ? 'border-teal-600 bg-white' : 'border-slate-200 bg-slate-50',
      ].join(' ')}>
      {/* Left Icon */}
      <View className="absolute bottom-0 left-4 top-0 z-10 justify-center">
        <Ionicons name={iconName} size={17} color={focused ? '#CD0F0F' : '#94a3b8'} />
      </View>

      {/* Floating Label */}
      <Text
        className={[
          'absolute left-11 font-medium',
          isActive
            ? 'top-[7px] text-[10px] uppercase tracking-widest'
            : 'top-[16px] text-[14px] text-slate-400',
          isActive ? (focused ? 'text-teal-700' : 'text-teal-500') : '',
        ].join(' ')}
        style={{ pointerEvents: 'none' }}>
        {label}
        {optional && !isActive && <Text className="text-slate-300"> (optional)</Text>}
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
        className="pb-[10px] pl-11 pr-12 pt-[22px] text-[14px] font-semibold text-slate-800"
        style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
      />

      {/* Right icon */}
      <View className="absolute bottom-0 right-4 top-0 justify-center">
        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={10} className="p-1">
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={17}
              color="#94a3b8"
            />
          </Pressable>
        ) : value.length > 0 ? (
          <Ionicons name="checkmark-circle" size={17} color="#14b8a6" />
        ) : null}
      </View>

      {/* Focus underline */}
      {focused && (
        <View className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-teal-600" />
      )}
    </View>
  );
}

// ── Section label ──────────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <Text className="mb-2 mt-1 text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
      {text}
    </Text>
  );
}

// ── Left Brand Panel (web only) ────────────────────────────────────────────────
function BrandPanel() {
  const perks = [
    { icon: 'gift-outline', text: '50 MediShield coins on signup' },
    { icon: 'people-outline', text: 'Refer friends & earn 100 coins' },
    { icon: 'bag-check-outline', text: 'Exclusive member-only deals' },
    { icon: 'shield-checkmark-outline', text: 'Clinically certified products' },
  ];

  return (
    <View className="relative flex-1 overflow-hidden" style={{ backgroundColor: '#CD0F0F' }}>
      {/* Decorative circles */}
      <View
        style={{
          position: 'absolute',
          width: 460,
          height: 460,
          borderRadius: 230,
          backgroundColor: '#0d766e',
          opacity: 0.35,
          top: -140,
          right: -120,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: '#14b8a6',
          opacity: 0.12,
          bottom: 40,
          left: -100,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: '#2dd4bf',
          opacity: 0.1,
          top: '45%',
          left: '60%',
        }}
      />
      {/* Dot grid */}
      <View
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            Platform.OS === 'web'
              ? 'radial-gradient(circle, #ffffff 1px, transparent 1px)'
              : undefined,
          backgroundSize: Platform.OS === 'web' ? '28px 28px' : undefined,
        }}
      />

      {/* Content */}
      <View className="flex-1 justify-between px-12 py-14">
        {/* Logo */}
        {/* <View className="flex-row items-center gap-3">
          <View
            className="h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Ionicons name="medical" size={22} color="white" />
          </View>
          <View>
            <Text className="text-lg font-black tracking-tight text-white">MediShield</Text>
            <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '700', letterSpacing: 2 }}>
              DENTAL CARE
            </Text>
          </View>
        </View> */}
<Image
              source={require('../../assets/logo-img.png')} 
              style={{
                width: 146,
                height: 76,
                resizeMode: 'contain',
                mixBlendMode: 'multiply',
              }}
            />
        {/* Hero */}
        <View>
          {/* Eyebrow pill */}
          <View
            className="mb-5 flex-row items-center gap-2 self-start rounded-full px-3 py-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <View className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
              JOIN 50,000+ MEMBERS
            </Text>
          </View>

          <Text
            className="mb-4 font-black leading-tight text-white"
            style={{ fontSize: 38, letterSpacing: -1 }}>
            Start Your{'\n'}
            <Text style={{ color: '#ffffff' }}>Dental Journey.</Text>
          </Text>

          <Text style={{ color: '#ffffff', fontSize: 15, lineHeight: 24, maxWidth: 300 }}>
            Create your free account and get instant access to premium dental products delivered to
            your door.
          </Text>

          {/* Perks */}
          <View className="mt-8 gap-4">
            {perks.map((p) => (
              <View key={p.text} className="flex-row items-center gap-3">
                <View
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Ionicons name={p.icon} size={17} color="#fff" />
                </View>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>{p.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Coins callout */}
        <View
          className="flex-row items-center gap-4 rounded-2xl p-4"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
          }}>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20">
            <Ionicons name="logo-bitcoin" size={24} color="#fbbf24" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-white">🎉 Get 50 Free Coins!</Text>
            <Text style={{ color: '#ffffff', fontSize: 12, marginTop: 2 }}>
              Instantly credited on signup. Use them on your first order.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Register Form ──────────────────────────────────────────────────────────────
function RegisterForm({ isWeb }) {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const router = useRouter();

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setError('');
  };

  const validate = () => {
    if (!form.firstname.trim()) return 'First name is required.';
    if (!form.lastname.trim()) return 'Last name is required.';
    if (!form.email.trim()) return 'Email address is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.mobile.trim()) return 'Mobile number is required.';
    if (form.mobile.length < 10) return 'Enter a valid 10-digit mobile number.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) return setError(err);

    try {
      setLoading(true);
      setError('');
      const payload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: form.password,
        ...(form.referralCode.trim() && { referralCode: form.referralCode.trim() }),
      };
      // const res = await API.post("/user/register", payload);
      await register(
        payload.firstname,
        payload.lastname,
        payload.email,
        payload.mobile,
        payload.password,
        payload.referralCode
      );
      // On success → save token & redirect
      //   await saveTokens(res.data.token);
      setSuccess(true);
      setTimeout(() => router.replace('/'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──
  if (success) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-teal-50">
          <Ionicons name="checkmark-circle" size={48} color="#CD0F0F" />
        </View>
        <Text className="text-center text-2xl font-black text-slate-900">Account Created!</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
          Welcome to MediShield. You've received 50 coins! 🎉
        </Text>
        <ActivityIndicator color="#CD0F0F" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <ScrollView
      className={isWeb ? 'flex-1 bg-white' : 'flex-1 bg-teal-50'}
      contentContainerClassName="flex-grow justify-center items-center px-6 py-10"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* Mobile blobs */}
      {!isWeb && (
        <>
          <View
            style={{
              position: 'absolute',
              top: -80,
              right: -60,
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: '#ccfbf1',
              opacity: 0.55,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -60,
              left: -50,
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: '#d1fae5',
              opacity: 0.45,
            }}
          />
        </>
      )}

      <View
        style={[
          { width: '100%', maxWidth: isWeb ? 420 : 440 },
          !isWeb && {
            backgroundColor: 'white',
            borderRadius: 28,
            padding: 28,
            shadowColor: '#CD0F0F',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.12,
            shadowRadius: 32,
            elevation: 10,
          },
        ]}>
        {/* Mobile: mini logo */}
        {!isWeb && (
          // <View className="mb-6 items-center">
          //   <View className="mb-2 h-16 w-16 items-center justify-center rounded-full border-4 border-teal-100 bg-teal-50">
          //     <View className="h-12 w-12 items-center justify-center rounded-full bg-teal-700">
          //       <Ionicons name="medical" size={22} color="white" />
          //     </View>
          //   </View>
          //   <Text className="text-xl font-black tracking-tight text-teal-900">MediShield</Text>
          //   <View className="mt-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-0.5">
          //     <Text className="text-[10px] font-bold uppercase tracking-[2px] text-teal-700">
          //       Dental Care
          //     </Text>
          //   </View>
          // </View>
          <Image 
                        source={require('../../assets/logo.png')} 
                        style={{
                          width: 146,
                          height: 76,
                          resizeMode: 'contain',
                          mixBlendMode: 'multiply',
                          marginHorizontal : 'auto',
                          marginBottom : 24,
                        }}
                      />
        )}

        {/* Heading */}
        <View className="mb-5">
          <Text
            className="font-extrabold leading-tight tracking-tight text-slate-900"
            style={{ fontSize: isWeb ? 30 : 26 }}>
            Create account ✨
          </Text>
          <Text className="mt-1.5 text-sm leading-5 text-slate-500">
            Join MediShield and get 50 coins instantly
          </Text>
        </View>

        {/* Coins banner */}
        <View
          className="mb-5 flex-row items-center gap-3 rounded-2xl px-4 py-3"
          style={{ backgroundColor: '#fef9c3', borderWidth: 1, borderColor: '#fde68a' }}>
          <Ionicons name="logo-bitcoin" size={20} color="#d97706" />
          <Text className="flex-1 text-sm font-semibold" style={{ color: '#92400e' }}>
            🎉 You'll receive <Text className="font-black">50 MediShield coins</Text> for signing
            up!
          </Text>
        </View>

        {/* Error */}
        {!!error && (
          <View
            className="mb-4 flex-row items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text className="flex-1 text-sm font-medium text-red-600">{error}</Text>
          </View>
        )}

        {/* ── Personal Info ── */}
        <SectionLabel text="Personal Info" />
        <View className="gap-3">
          {/* Name row */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FloatingInput
                label="First name"
                value={form.firstname}
                onChangeText={set('firstname')}
                iconName="person-outline"
                autoCapitalize="words"
              />
            </View>
            <View className="flex-1">
              <FloatingInput
                label="Last name"
                value={form.lastname}
                onChangeText={set('lastname')}
                iconName="person-outline"
                autoCapitalize="words"
              />
            </View>
          </View>

          <FloatingInput
            label="Email address"
            value={form.email}
            onChangeText={set('email')}
            iconName="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FloatingInput
            label="Mobile number"
            value={form.mobile}
            onChangeText={(t) => set('mobile')(t.replace(/[^0-9]/g, ''))}
            iconName="call-outline"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        {/* ── Security ── */}
        <SectionLabel text="Security" />
        <View className="gap-3">
          <FloatingInput
            label="Password"
            value={form.password}
            onChangeText={set('password')}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />
          <FloatingInput
            label="Confirm password"
            value={form.confirmPassword}
            onChangeText={set('confirmPassword')}
            iconName="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Password strength hint */}
          {form.password.length > 0 && (
            <View className="flex-row items-center gap-2 px-1">
              {[1, 2, 3, 4].map((i) => {
                const strength =
                  form.password.length >= 8 &&
                  /[A-Z]/.test(form.password) &&
                  /[0-9]/.test(form.password)
                    ? 4
                    : form.password.length >= 8
                      ? 3
                      : form.password.length >= 6
                        ? 2
                        : 1;
                return (
                  <View
                    key={i}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        i <= strength
                          ? strength <= 1
                            ? '#ef4444'
                            : strength === 2
                              ? '#f59e0b'
                              : strength === 3
                                ? '#84cc16'
                                : '#14b8a6'
                          : '#e2e8f0',
                    }}
                  />
                );
              })}
              <Text className="ml-1 text-[11px] text-slate-400">
                {form.password.length < 6
                  ? 'Too short'
                  : form.password.length < 8
                    ? 'Weak'
                    : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password)
                      ? 'Strong'
                      : 'Good'}
              </Text>
            </View>
          )}
        </View>

        {/* ── Referral Code (collapsible) ── */}
        <Pressable
          className="mb-1 mt-4 flex-row items-center gap-2 self-start py-1"
          onPress={() => setShowReferral((p) => !p)}>
          <Ionicons
            name={showReferral ? 'chevron-down' : 'chevron-forward'}
            size={14}
            color="#CD0F0F"
          />
          <Text style={{color: C.primary}} className="text-[13px] font-semibold">
            {showReferral
              ? 'Hide referral code'
              : 'Have a referral code? +100 bonus coins for your friend!'}
          </Text>
        </Pressable>

        {showReferral && (
          <View className="mb-1">
            <FloatingInput
              label="Referral code"
              value={form.referralCode}
              onChangeText={set('referralCode')}
              iconName="gift-outline"
              autoCapitalize="none"
              optional
            />
          </View>
        )}

        {/* ── Register Button ── */}
        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className="mt-5 flex-row items-center justify-center gap-2 rounded-2xl  py-[15px] active:bg-teal-800 active:opacity-90 disabled:opacity-60"
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
              <Text className="text-[15px] font-bold tracking-wide text-white">Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </>
          )}
        </Pressable>

        {/* Terms */}
        <Text className="mt-3 text-center text-[11px] leading-4 text-slate-400">
          By creating an account you agree to our{' '}
          <Text className="font-semibold" style={{ color: C.primaryDark }}>Terms of Service</Text> and{' '}
          <Text className="font-semibold " style={{ color: C.primaryDark }}>
            Privacy Policy
          </Text>
        </Text>

        {/* Divider */}
        <View className="my-5 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-slate-100" />
          <Text className="text-xs font-semibold tracking-widest text-slate-400">OR</Text>
          <View className="h-px flex-1 bg-slate-100" />
        </View>

        {/* Login link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-sm text-slate-500">Already have an account? </Text>
          <Pressable onPress={() => router.push('/auth/login')}>
            <Text className="text-sm font-bold " style={{ color: C.primary }}>
              Sign in →
            </Text>
          </Pressable>
        </View>

        {/* Trust badges */}
        <View
          className="mt-6 flex-row justify-center gap-5 pt-5"
          style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
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

      <Text className="mt-8 text-center text-xs text-slate-400">
        © 2025 MediShield · All rights reserved
      </Text>
    </ScrollView>
  );
}

// ── Root Export ────────────────────────────────────────────────────────────────
export default function Register() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;

  if (isWeb) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <BrandPanel />
        <RegisterForm isWeb={true} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-teal-50">
      <RegisterForm isWeb={false} />
    </SafeAreaView>
  );
}
