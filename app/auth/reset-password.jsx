
import React, { useState } from "react";
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
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import API from "../../src/api/axios";
import C from "@/utils/theme";

export default function ResetPassword() {
  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetToken = Array.isArray(token) ? token[0] : token;

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!resetToken) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        `/user/reset-password/${encodeURIComponent(resetToken)}`,
        { password }
      );

      setSuccess(
        response?.data?.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to reset your password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (field) =>
    focusedField === field ? "#CD0F0F" : "#E2E8F0";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reset Password",
          headerShown: false,
        }}
      />

      <SafeAreaView className="flex-1 bg-teal-50">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 22,
              paddingVertical: 28,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Background Decoration */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -60,
                right: -70,
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: "#CCFBF1",
                opacity: 0.65,
              }}
            />

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: -50,
                left: -70,
                width: 190,
                height: 190,
                borderRadius: 95,
                backgroundColor: "#D1FAE5",
                opacity: 0.55,
              }}
            />

            <View className="w-full max-w-md self-center">
              {/* Back Button */}
              <Pressable
                onPress={() => router.replace("/auth/login")}
                accessibilityRole="button"
                accessibilityLabel="Back to login"
                hitSlop={10}
                className="mb-5 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons
                  name="arrow-back"
                  size={21}
                  color={C.primaryDark}
                />
              </Pressable>

              {/* Main Card */}
              <View
                className="rounded-[28px] border border-white bg-white p-6"
                style={{
                  shadowColor: "#CD0F0F",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.09,
                  shadowRadius: 24,
                  elevation: 6,
                }}
              >
                {/* Logo */}
                <View className="mb-5 items-center">
                  <Image
                    source={require("../../assets/logo.png")}
                    resizeMode="contain"
                    style={{
                      width: 146,
                      height: 76,
                    }}
                  />
                </View>

                {/* Heading Icon */}
                <View
                  className="mb-5 h-[62px] w-[62px] items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: "#FFF1F2",
                    borderWidth: 1,
                    borderColor: "#FFE4E6",
                  }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={30}
                    color="#CD0F0F"
                  />
                </View>

                {/* Heading */}
                <Text
                  className="text-[27px] font-extrabold leading-9 tracking-tight text-slate-900"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Reset Password
                </Text>

                <Text
                  className="mb-7 mt-3 text-sm leading-6 text-slate-500"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Create a new password for your MediShield account. Choose a
                  strong password to help keep your account secure.
                </Text>

                {/* New Password Label */}
                <Text
                  className="mb-2 text-[13px] font-semibold text-slate-700"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  New Password
                </Text>

                {/* New Password Input */}
                <View
                  className="mb-5 flex-row items-center rounded-2xl border-2 bg-slate-50"
                  style={{
                    borderColor: inputBorder("password"),
                    backgroundColor:
                      focusedField === "password" ? "#FFFFFF" : "#F8FAFC",
                  }}
                >
                  <View className="pl-4">
                    <Ionicons
                      name="lock-closed-outline"
                      size={19}
                      color={
                        focusedField === "password" ? "#CD0F0F" : "#94A3B8"
                      }
                    />
                  </View>

                  <TextInput
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setError("");
                      setSuccess("");
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter new password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    editable={!loading && !success}
                    returnKeyType="next"
                    selectionColor="#CD0F0F"
                    className="h-[54px] flex-1 px-3 text-sm font-medium text-slate-800"
                    style={
                      Platform.OS === "web"
                        ? { outlineStyle: "none" }
                        : {}
                    }
                  />

                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    disabled={loading || !!success}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                    hitSlop={10}
                    className="h-[50px] items-center justify-center px-4"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#64748B"
                    />
                  </Pressable>
                </View>

                {/* Confirm Password Label */}
                <Text
                  className="mb-2 text-[13px] font-semibold text-slate-700"
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  Confirm Password
                </Text>

                {/* Confirm Password Input */}
                <View
                  className="flex-row items-center rounded-2xl border-2 bg-slate-50"
                  style={{
                    borderColor: inputBorder("confirmPassword"),
                    backgroundColor:
                      focusedField === "confirmPassword"
                        ? "#FFFFFF"
                        : "#F8FAFC",
                  }}
                >
                  <View className="pl-4">
                    <Ionicons
                      name="lock-closed-outline"
                      size={19}
                      color={
                        focusedField === "confirmPassword"
                          ? "#CD0F0F"
                          : "#94A3B8"
                      }
                    />
                  </View>

                  <TextInput
                    value={confirmPassword}
                    onChangeText={(value) => {
                      setConfirmPassword(value);
                      setError("");
                      setSuccess("");
                    }}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Confirm new password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    editable={!loading && !success}
                    returnKeyType="done"
                    onSubmitEditing={handleResetPassword}
                    selectionColor="#CD0F0F"
                    className="h-[54px] flex-1 px-3 text-sm font-medium text-slate-800"
                    style={
                      Platform.OS === "web"
                        ? { outlineStyle: "none" }
                        : {}
                    }
                  />

                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    disabled={loading || !!success}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    hitSlop={10}
                    className="h-[50px] items-center justify-center px-4"
                  >
                    <Ionicons
                      name={
                        showConfirmPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={20}
                      color="#64748B"
                    />
                  </Pressable>
                </View>

                {/* Password Hint */}
                <View className="mb-5 mt-3 flex-row items-start">
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#94A3B8"
                    style={{ marginTop: 1 }}
                  />

                  <Text
                    className="ml-2 flex-1 text-xs leading-5 text-slate-500"
                    style={{ fontFamily: "Poppins_400Regular" }}
                  >
                    Your password must contain at least 8 characters.
                  </Text>
                </View>

                {/* Error Message */}
                {!!error && (
                  <View
                    className="mb-4 flex-row items-start rounded-xl border border-red-200 bg-red-50 px-3 py-3"
                    style={{ borderLeftWidth: 3, borderLeftColor: "#DC2626" }}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={19}
                      color="#DC2626"
                    />

                    <Text
                      className="ml-2 flex-1 text-xs leading-5 text-red-600"
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      {error}
                    </Text>
                  </View>
                )}

                {/* Success Message */}
                {!!success && (
                  <View className="mb-4 flex-row items-start rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#059669"
                    />

                    <Text
                      className="ml-2 flex-1 text-xs leading-5 text-emerald-800"
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      {success}
                    </Text>
                  </View>
                )}

                {/* Submit Button */}
                <Pressable
                  onPress={
                    success
                      ? () => router.replace("/auth/login")
                      : handleResetPassword
                  }
                  disabled={loading}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    minHeight: 54,
                    borderRadius: 16,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: C.primaryDark,
                    opacity: loading ? 0.7 : pressed ? 0.9 : 1,
                    ...(Platform.OS === "web"
                      ? {
                          boxShadow: "0 7px 18px rgba(205,15,15,0.20)",
                          cursor: loading ? "not-allowed" : "pointer",
                        }
                      : {
                          shadowColor: "#CD0F0F",
                          shadowOffset: { width: 0, height: 5 },
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          elevation: 4,
                        }),
                  })}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator
                        color="#FFFFFF"
                        size="small"
                        style={{ marginRight: 10 }}
                      />

                      <Text
                        className="text-sm font-bold text-white"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        Resetting Password...
                      </Text>
                    </>
                  ) : success ? (
                    <>
                      <Text
                        className="text-sm font-bold text-white"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        Go to Login
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="#FFFFFF"
                        style={{ marginLeft: 10 }}
                      />
                    </>
                  ) : (
                    <>
                      <Text
                        className="text-sm font-bold text-white"
                        style={{ fontFamily: "Poppins_400Regular" }}
                      >
                        Reset Password
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
                {!success && (
                  <Pressable
                    onPress={() => router.replace("/auth/login")}
                    accessibilityRole="button"
                    className="mt-5 flex-row items-center justify-center py-2"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.65 : 1,
                    })}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={15}
                      color={C.primary}
                    />

                    <Text
                      className="ml-2 text-[13px] font-semibold"
                      style={{
                        color: C.primary,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      Back to Login
                    </Text>
                  </Pressable>
                )}

                {/* Security Footer */}
                <View
                  className="mt-5 flex-row items-center justify-center border-t border-slate-100 pt-5"
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={15}
                    color="#94A3B8"
                  />

                  <Text
                    className="ml-2 text-[11px] font-medium text-slate-400"
                    style={{ fontFamily: "Poppins_400Regular" }}
                  >
                    Secure password recovery · MediShield
                  </Text>
                </View>
              </View>

              {/* Page Footer */}
              <Text
                className="mt-6 text-center text-[11px] text-slate-400"
                style={{ fontFamily: "Poppins_400Regular" }}
              >
                © 2026 MediShield · All rights reserved
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
