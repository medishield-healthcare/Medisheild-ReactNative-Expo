import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import API from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import WebHeader from 'components/Header/header.web';

const C = {
  primary: '#09BBAF',
  primaryDark: '#09BBAF',
  primaryLight: '#ccfbf1',

  bg: '#f5fafa',
  white: '#ffffff',

  dark: '#0f172a',
  muted: '#64748b',
  border: '#dbe5e7',

  danger: '#dc2626',
  success: '#059669',
};

const InputField = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
}) => {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: C.dark,
          marginBottom: 8,
        }}>
        {label}
      </Text>

      <View
        style={{
          height: 52,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: C.border,
          backgroundColor: C.white,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.03,
          shadowRadius: 6,
          elevation: 1,

          opacity: editable ? 1 : 0.6,
        }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: C.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}>
          <Ionicons name={icon} size={17} color={C.primary} />
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          style={{
            flex: 1,
            fontSize: 14,
            color: C.dark,
            fontWeight: '500',
          }}
        />
      </View>
    </View>
  );
};

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // ----------------------------------------
  // Populate existing user data
  // ----------------------------------------

  useEffect(() => {
    if (user) {
      setFirstname(user?.firstname || '');
      setLastname(user?.lastname || '');
      setEmail(user?.email || '');
      setMobile(user?.mobile || '');
    }
  }, [user]);

  // ----------------------------------------
  // Validation
  // ----------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    if (!lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (mobile.replace(/\D/g, '').length < 10) {
      newErrors.mobile = 'Enter a valid mobile number';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------------
  // Update Profile
  // ----------------------------------------

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await API.put('/user/edit-user', {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      });

      console.log('PROFILE UPDATED:', response.data);
      setUser({
        ...user,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      });

      Alert.alert('Profile Updated', 'Your profile information has been updated successfully.', [
        {
          text: 'Done',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Edit profile error:', error?.response?.data || error?.message);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to update your profile. Please try again.';

      Alert.alert('Update Failed', message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Initials
  // ----------------------------------------

  const firstInitial = firstname?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastname?.charAt(0)?.toUpperCase() || '';

  const initials = `${firstInitial}${lastInitial}` || 'U';

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: C.bg,
      }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 35,
          }}>
          {/* <WebHeader/> */}
          {/* -------------------------------- */}
          {/* HEADER */}
          {/* -------------------------------- */}

          <View
            style={{
              height: 64,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: C.white,
              borderBottomWidth: 1,
              borderBottomColor: '#edf2f2',
            }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#f1f5f5',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
              <Ionicons name="arrow-back" size={20} color={C.dark} />
            </Pressable>

            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: C.dark,
                }}>
                Edit Profile
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 2,
                }}>
                Update your personal information
              </Text>
            </View>
          </View>

          {/* -------------------------------- */}
          {/* PROFILE INTRO */}
          {/* -------------------------------- */}

          <View
            style={{
              marginHorizontal: 20,
              marginTop: 22,
              marginBottom: 24,
              padding: 20,
              borderRadius: 22,
              backgroundColor: C.primaryDark,
              overflow: 'hidden',
            }}>
            {/* Decorative circle */}

            <View
              style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: 'rgba(255,255,255,0.05)',
                right: -55,
                top: -60,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* Avatar */}

              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: C.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 15,
                }}>
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: '900',
                    color: C.primary,
                  }}>
                  {initials}
                </Text>
              </View>

              {/* Text */}

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#99f6e4',
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}>
                  MEDISHIELD ACCOUNT
                </Text>

                <Text
                  style={{
                    color: C.white,
                    fontSize: 19,
                    fontWeight: '800',
                  }}>
                  {firstname || 'Your'} {lastname}
                </Text>

                <Text
                  style={{
                    color: '#b6e5e1',
                    fontSize: 11,
                    marginTop: 3,
                  }}>
                  Keep your account details up to date
                </Text>
              </View>
            </View>
          </View>

          {/* -------------------------------- */}
          {/* FORM CARD */}
          {/* -------------------------------- */}

          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: C.white,
              borderRadius: 22,
              padding: 20,

              shadowColor: '#0f172a',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.05,
              shadowRadius: 14,
              elevation: 2,
            }}>
            <View
              style={{
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '800',
                  color: C.dark,
                }}>
                Personal Information
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 4,
                }}>
                Make sure your information is accurate.
              </Text>
            </View>

            {/* First Name */}

            <InputField
              label="First Name"
              icon="person-outline"
              value={firstname}
              onChangeText={(value) => {
                setFirstname(value);

                if (errors.firstname) {
                  setErrors((prev) => ({
                    ...prev,
                    firstname: '',
                  }));
                }
              }}
              placeholder="Enter your first name"
            />

            {errors.firstname ? (
              <Text
                style={{
                  color: C.danger,
                  fontSize: 11,
                  marginTop: -12,
                  marginBottom: 12,
                }}>
                {errors.firstname}
              </Text>
            ) : null}

            {/* Last Name */}

            <InputField
              label="Last Name"
              icon="person-outline"
              value={lastname}
              onChangeText={(value) => {
                setLastname(value);

                if (errors.lastname) {
                  setErrors((prev) => ({
                    ...prev,
                    lastname: '',
                  }));
                }
              }}
              placeholder="Enter your last name"
            />

            {errors.lastname ? (
              <Text
                style={{
                  color: C.danger,
                  fontSize: 11,
                  marginTop: -12,
                  marginBottom: 12,
                }}>
                {errors.lastname}
              </Text>
            ) : null}

            {/* Email */}

            <InputField
              label="Email Address"
              icon="mail-outline"
              value={email}
              onChangeText={(value) => {
                setEmail(value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: '',
                  }));
                }
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {errors.email ? (
              <Text
                style={{
                  color: C.danger,
                  fontSize: 11,
                  marginTop: -12,
                  marginBottom: 12,
                }}>
                {errors.email}
              </Text>
            ) : null}

            {/* Mobile */}

            <InputField
              label="Mobile Number"
              icon="call-outline"
              value={mobile}
              onChangeText={(value) => {
                const numericValue = value.replace(/\D/g, '');

                setMobile(numericValue);

                if (errors.mobile) {
                  setErrors((prev) => ({
                    ...prev,
                    mobile: '',
                  }));
                }
              }}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
            />

            {errors.mobile ? (
              <Text
                style={{
                  color: C.danger,
                  fontSize: 11,
                  marginTop: -12,
                  marginBottom: 12,
                }}>
                {errors.mobile}
              </Text>
            ) : null}

            {/* -------------------------------- */}
            {/* UPDATE BUTTON */}
            {/* -------------------------------- */}

            <Pressable
              onPress={handleUpdateProfile}
              disabled={loading}
              style={({ pressed }) => ({
                height: 52,
                borderRadius: 14,
                backgroundColor: pressed ? C.primaryDark : C.primary,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 4,

                shadowColor: C.primary,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3,

                opacity: loading ? 0.7 : 1,
              })}>
              {loading ? (
                <ActivityIndicator size="small" color={C.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={19} color={C.white} />

                  <Text
                    style={{
                      color: C.white,
                      fontSize: 14,
                      fontWeight: '800',
                    }}>
                    Save Changes
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* -------------------------------- */}
          {/* SECURITY NOTE */}
          {/* -------------------------------- */}

          <View
            style={{
              marginHorizontal: 20,
              marginTop: 18,
              padding: 15,
              borderRadius: 16,
              backgroundColor: '#ecfdf5',
              borderWidth: 1,
              borderColor: '#d1fae5',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
            <Ionicons
              name="shield-checkmark-outline"
              size={19}
              color={C.success}
              style={{ marginRight: 10 }}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '800',
                  color: '#065f46',
                  marginBottom: 3,
                }}>
                Your information is secure
              </Text>

              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 15,
                  color: '#047857',
                }}>
                Your account details are securely handled and used only to provide you with a better
                MediShield experience.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
