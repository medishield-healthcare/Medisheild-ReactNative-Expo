import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import API from '../../src/api/axios';
import C from '@/utils/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await API.post('/user/forgot-password-token', {
        email: normalizedEmail,
      });

      setMessage(
        response.data?.message || 'If your account exists, you will receive a password reset email.'
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Unable to send the reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Forgot Password',
          headerShown: false,
        }}
      />

      <SafeAreaView className="flex-1 bg-teal-50">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Background Decorations */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -70,
                right: -70,
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: '#CCFBF1',
                opacity: 0.65,
              }}
            />

            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                bottom: -50,
                left: -60,
                width: 190,
                height: 190,
                borderRadius: 95,
                backgroundColor: '#D1FAE5',
                opacity: 0.5,
              }}
            />

            <View className="w-full max-w-md self-center">
              {/* Back Button */}
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                className="mb-7 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}>
                <Ionicons name="arrow-back" size={21} color={C.primaryDark} />
              </Pressable>

              {/* Main Card */}
              <View
                className="rounded-[28px] border border-white bg-white p-6"
                style={{
                  shadowColor: C.primaryDark,
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.1,
                  shadowRadius: 28,
                  elevation: 7,
                }}>
                {/* Brand Logo */}
                <View className="mb-7 items-center">
                  <Image
                    source={require('../../assets/logo.png')}
                    resizeMode="contain"
                    style={{
                      width: 146,
                      height: 76,
                    }}
                  />
                </View>

                {/* Icon */}
                <View
                  className="mb-5 h-[66px] w-[66px] items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: '#F0FDFA',
                    borderWidth: 1,
                    borderColor: '#CCFBF1',
                  }}>
                  <Ionicons name="lock-closed-outline" size={30} color={C.primary} />
                </View>

                {/* Heading */}
                <Text
                  className="text-[28px] font-extrabold leading-9 tracking-tight text-slate-900"
                  style={{ fontFamily: 'Poppins_400Regular' }}>
                  Forgot password?
                </Text>

                <Text
                  className="mb-7 mt-3 text-sm leading-6 text-slate-500"
                  style={{ fontFamily: 'Poppins_400Regular' }}>
                  No worries! Enter the email address linked to your MediShield account, and
                  we&apos;ll send you a secure password reset link.
                </Text>

                {/* Email Label */}
                <Text
                  className="mb-2 text-[13px] font-semibold text-slate-700"
                  style={{ fontFamily: 'Poppins_400Regular' }}>
                  Email address
                </Text>

                {/* Email Input */}
                <View
                  className={`flex-row items-center rounded-2xl border-2 ${
                    focused ? 'border-red-600 bg-white' : 'border-slate-200 bg-slate-50'
                  }`}>
                  <View className="pl-4">
                    <Ionicons
                      name="mail-outline"
                      size={19}
                      color={focused ? '#CD0F0F' : '#94A3B8'}
                    />
                  </View>

                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      setError('');
                      setMessage('');
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="you@example.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    editable={!loading}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                    selectionColor="#CD0F0F"
                    className="h-[54px] flex-1 px-3 text-[14px] font-medium text-slate-800"
                    style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                  />

                  {!!email.trim() && (
                    <View className="pr-4">
                      <Ionicons name="checkmark-circle" size={19} color="#14B8A6" />
                    </View>
                  )}
                </View>

                {/* Error Message */}
                {!!error && (
                  <View
                    className="mt-4 flex-row items-start rounded-xl border border-red-200 bg-red-50 px-3 py-3"
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: '#EF4444',
                    }}>
                    <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />

                    <Text className="ml-2 flex-1 text-[12px] leading-5 text-red-600">{error}</Text>
                  </View>
                )}

                {/* Success Message */}
                {!!message && (
                  <View className="mt-4 flex-row items-start rounded-xl border border-teal-100 bg-teal-50 p-4">
                    <Ionicons name="checkmark-circle-outline" size={20} color={C.primary} />

                    <Text className="ml-2 flex-1 text-[12px] leading-5 text-teal-800">
                      {message}
                    </Text>
                  </View>
                )}

                {/* Submit Button */}
                <Pressable
                  onPress={handleSubmit}
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel="Send password reset link"
                  className="mt-6 w-full flex-row bg-red-600 p-4 items-center justify-center rounded-2xl px-5"
                  style={({ pressed }) => ({
                    minHeight: 54,
                    background: C.primary,
                    opacity: loading ? 0.7 : pressed ? 0.9 : 1,
                    ...(Platform.OS === 'web'
                      ? {
                          boxShadow: pressed
                            ? '0 3px 10px rgba(205, 15, 15, 0.18)'
                            : '0 7px 18px rgba(205, 15, 15, 0.22)',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'opacity 150ms ease, box-shadow 150ms ease',
                        }
                      : {
                          shadowColor: C.primaryDark,
                          shadowOffset: { width: 0, height: 5 },
                          shadowOpacity: pressed ? 0.12 : 0.2,
                          shadowRadius: 8,
                          elevation: pressed ? 2 : 4,
                        }),
                  })}>
                  {loading ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 10 }} />

                      <Text
                        className="text-sm font-bold text-white"
                        style={{ fontFamily: 'Poppins_400Regular' }}>
                        Sending Reset Link...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        className="text-sm font-bold tracking-wide text-white"
                        style={{ fontFamily: 'Poppins_400Regular' }}>
                        Send Reset Link
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="#FFFFFF"
                        style={{ marginLeft: 10 }}
                      />
                    </>
                  )}
                </Pressable>

                {/* Back to Login */}
                <Pressable
                  onPress={() => router.replace('/auth/login')}
                  className="mt-5 flex-row items-center  justify-center py-2">
                  <Ionicons name="arrow-back" size={15} color={C.primary} />
                  <Text
                    className="ml-2 text-[13px] font-semibold"
                    style={{
                      color: C.primary,
                      fontFamily: 'Poppins_400Regular',
                    }}>
                    Back to Login
                  </Text>
                </Pressable>

                {/* Security Footer */}
                <View className="mt-5 flex-row items-center justify-center border-t border-slate-100 pt-5">
                  <Ionicons name="shield-checkmark-outline" size={15} color="#94A3B8" />
                  <Text className="ml-2 text-[11px] font-medium text-slate-400">
                    Secure password recovery · MediShield
                  </Text>
                </View>
              </View>

              {/* Page Footer */}
              <Text className="mt-6 text-center text-[11px] text-slate-400">
                © 2026 MediShield · All rights reserved
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
