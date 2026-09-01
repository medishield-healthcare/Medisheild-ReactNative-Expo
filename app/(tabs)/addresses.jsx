import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import API from '@/api/axios';

const C = {
  primary: '#0f766e',
  primaryDark: '#0f4f4f',
  primaryLight: '#ccfbf1',

  bg: '#f5fafa',
  white: '#ffffff',

  dark: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',

  danger: '#dc2626',
  dangerLight: '#fef2f2',

  success: '#059669',
  successLight: '#ecfdf5',
};

const initialForm = {
  name: '',
  address: '',
  mobile: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
};

// =====================================================
// INPUT COMPONENT
// =====================================================

function FormInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  error,
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: C.dark,
          marginBottom: 7,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          minHeight: multiline ? 88 : 50,
          borderRadius: 13,
          borderWidth: 1,
          borderColor: error ? '#fca5a5' : C.border,
          backgroundColor: C.white,
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          paddingHorizontal: 13,
          paddingVertical: multiline ? 11 : 0,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: C.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 9,
            marginTop: multiline ? 2 : 0,
          }}
        >
          <Ionicons
            name={icon}
            size={16}
            color={C.primary}
          />
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={{
            flex: 1,
            fontSize: 13,
            color: C.dark,
            fontWeight: '500',
            minHeight: multiline ? 65 : undefined,
          }}
        />
      </View>

      {error ? (
        <Text
          style={{
            color: C.danger,
            fontSize: 10,
            marginTop: 5,
            marginLeft: 2,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

// =====================================================
// ADDRESS CARD
// =====================================================

function AddressCard({ item, onEdit, onDelete }) {
  return (
    <View
      style={{
        backgroundColor: C.white,
        borderRadius: 20,
        marginBottom: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: C.border,

        shadowColor: '#0f172a',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {/* Top Accent */}

      <View
        style={{
          height: 4,
          backgroundColor: C.primary,
        }}
      />

      <View style={{ padding: 17 }}>
        {/* Header */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                backgroundColor: C.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 11,
              }}
            >
              <Ionicons
                name="location-outline"
                size={21}
                color={C.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontWeight: '800',
                  color: C.dark,
                }}
              >
                {item.name || 'Saved Address'}
              </Text>

              <Text
                style={{
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 3,
                }}
              >
                Delivery Address
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: C.successLight,
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: '800',
                color: C.success,
              }}
            >
              SAVED
            </Text>
          </View>
        </View>

        {/* Address Details */}

        <View
          style={{
            marginTop: 16,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              color: '#475569',
            }}
          >
            {item.address}
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              color: '#475569',
            }}
          >
            {item.city}, {item.state}
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              color: '#475569',
            }}
          >
            {item.country} - {item.pincode}
          </Text>
        </View>

        {/* Mobile */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Ionicons
            name="call-outline"
            size={14}
            color={C.primary}
          />

          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: C.muted,
              marginLeft: 7,
            }}
          >
            {item.mobile}
          </Text>
        </View>

        {/* Actions */}

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 16,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
          }}
        >
          <Pressable
            onPress={() => onEdit(item)}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 11,
              borderWidth: 1,
              borderColor: C.border,
              backgroundColor: '#f8fafc',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Ionicons
              name="create-outline"
              size={15}
              color={C.primary}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: C.primary,
              }}
            >
              Edit
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onDelete(item)}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 11,
              backgroundColor: C.dangerLight,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Ionicons
              name="trash-outline"
              size={15}
              color={C.danger}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: C.danger,
              }}
            >
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================

export default function SavedAddresses() {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  // ===================================================
  // GET ADDRESSES
  // ===================================================

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await API.get('/user/address');

      setAddresses(response?.data?.data || []);
    } catch (error) {
      console.log(
        'GET ADDRESS ERROR:',
        error?.response?.data || error?.message
      );

      Alert.alert(
        'Unable to Load',
        error?.response?.data?.message ||
          'Something went wrong while loading your addresses.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // ===================================================
  // VALIDATION
  // ===================================================

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Address name is required.';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Complete address is required.';
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[0-9]{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required.';
    }

    if (!form.country.trim()) {
      newErrors.country = 'Country is required.';
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^[0-9]{5,6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Enter a valid pincode.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===================================================
  // ADD ADDRESS
  // ===================================================

  const openAddModal = () => {
    setEditingAddress(null);
    setForm(initialForm);
    setErrors({});
    setModalVisible(true);
  };

  // ===================================================
  // EDIT ADDRESS
  // ===================================================

  const openEditModal = (address) => {
    setEditingAddress(address);

    setForm({
      name: address?.name || '',
      address: address?.address || '',
      mobile: address?.mobile || '',
      city: address?.city || '',
      state: address?.state || '',
      country: address?.country || '',
      pincode: address?.pincode || '',
    });

    setErrors({});
    setModalVisible(true);
  };

  // ===================================================
  // SAVE / UPDATE ADDRESS
  // ===================================================

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        mobile: form.mobile.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        pincode: form.pincode.trim(),
      };

      if (editingAddress) {
        await API.put(
          `/user/update-address/${editingAddress._id}`,
          payload
        );

        Alert.alert(
          'Address Updated',
          'Your address has been updated successfully.'
        );
      } else {
        await API.put('/user/save-address', payload);

        Alert.alert(
          'Address Saved',
          'Your new address has been saved successfully.'
        );
      }

      setModalVisible(false);
      setEditingAddress(null);
      setForm(initialForm);
      setErrors({});

      await fetchAddresses();
    } catch (error) {
      console.log(
        'ADDRESS SAVE ERROR:',
        error?.response?.data || error?.message
      );

      Alert.alert(
        'Unable to Save',
        error?.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE ADDRESS
  // ===================================================

  const confirmDelete = (address) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address?.name || 'this address'}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(address),
        },
      ]
    );
  };

  const handleDelete = async (address) => {
    try {
      await API.delete(`/user/address/${address._id}`);

      setAddresses((prev) =>
        prev.filter((item) => item._id !== address._id)
      );

      Alert.alert(
        'Address Deleted',
        'The address has been removed successfully.'
      );
    } catch (error) {
      console.log(
        'DELETE ADDRESS ERROR:',
        error?.response?.data || error?.message
      );

      Alert.alert(
        'Unable to Delete',
        error?.response?.data?.message ||
          'Something went wrong while deleting the address.'
      );
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: C.bg,
        }}
      >
        <View
          style={{
            height: 64,
            backgroundColor: C.white,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: '#e2e8f0',
            }}
          />

          <View style={{ marginLeft: 12 }}>
            <View
              style={{
                width: 150,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#e2e8f0',
              }}
            />

            <View
              style={{
                width: 210,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#e2e8f0',
                marginTop: 7,
              }}
            />
          </View>
        </View>

        <View style={{ padding: 20 }}>
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              style={{
                height: 190,
                backgroundColor: C.white,
                borderRadius: 20,
                marginBottom: 14,
                padding: 18,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  backgroundColor: '#e2e8f0',
                }}
              />

              <View
                style={{
                  width: '90%',
                  height: 12,
                  backgroundColor: '#e2e8f0',
                  borderRadius: 6,
                  marginTop: 20,
                }}
              />

              <View
                style={{
                  width: '70%',
                  height: 12,
                  backgroundColor: '#e2e8f0',
                  borderRadius: 6,
                  marginTop: 9,
                }}
              />

              <View
                style={{
                  width: '85%',
                  height: 12,
                  backgroundColor: '#e2e8f0',
                  borderRadius: 6,
                  marginTop: 9,
                }}
              />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: C.bg,
      }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View
        style={{
          height: 64,
          backgroundColor: C.white,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 18,
          borderBottomWidth: 1,
          borderBottomColor: '#eef2f2',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#f1f5f5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={C.dark}
          />
        </Pressable>

        <View style={{ marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: C.dark,
            }}
          >
            Saved Addresses
          </Text>

          <Text
            style={{
              fontSize: 10,
              color: C.muted,
              marginTop: 2,
            }}
          >
            Manage your delivery locations
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 35,
        }}
      >
        {/* ================================================= */}
        {/* INTRO */}
        {/* ================================================= */}

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 20,
            padding: 18,
            borderRadius: 20,
            backgroundColor: C.primaryDark,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: 130,
              height: 130,
              borderRadius: 65,
              right: -45,
              top: -55,
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons
                name="location"
                size={22}
                color="#5eead4"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: C.white,
                  fontSize: 16,
                  fontWeight: '800',
                }}
              >
                Your Delivery Addresses
              </Text>

              <Text
                style={{
                  color: '#a7d8d4',
                  fontSize: 10,
                  lineHeight: 15,
                  marginTop: 3,
                }}
              >
                Save your clinic, home or office address
                for faster checkout.
              </Text>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* TITLE + ADD BUTTON */}
        {/* ================================================= */}

        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '800',
                color: C.dark,
              }}
            >
              My Addresses
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: C.muted,
                marginTop: 3,
              }}
            >
              {addresses.length}{' '}
              {addresses.length === 1
                ? 'address'
                : 'addresses'}{' '}
              saved
            </Text>
          </View>

          <Pressable
            onPress={openAddModal}
            style={{
              height: 40,
              paddingHorizontal: 13,
              borderRadius: 11,
              backgroundColor: C.primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Ionicons
              name="add"
              size={17}
              color={C.white}
            />

            <Text
              style={{
                color: C.white,
                fontSize: 11,
                fontWeight: '800',
              }}
            >
              Add New
            </Text>
          </Pressable>
        </View>

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {addresses.length === 0 ? (
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: C.white,
              borderRadius: 22,
              paddingHorizontal: 25,
              paddingVertical: 45,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 22,
                backgroundColor: C.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="location-outline"
                size={32}
                color={C.primary}
              />
            </View>

            <Text
              style={{
                marginTop: 18,
                fontSize: 17,
                fontWeight: '800',
                color: C.dark,
              }}
            >
              No Saved Addresses
            </Text>

            <Text
              style={{
                marginTop: 7,
                fontSize: 11,
                lineHeight: 17,
                color: C.muted,
                textAlign: 'center',
              }}
            >
              Add your clinic, home or office address
              to make your next order faster.
            </Text>

            <Pressable
              onPress={openAddModal}
              style={{
                marginTop: 20,
                height: 44,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: C.primary,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <Ionicons
                name="add"
                size={18}
                color={C.white}
              />

              <Text
                style={{
                  color: C.white,
                  fontSize: 12,
                  fontWeight: '800',
                }}
              >
                Add Address
              </Text>
            </Pressable>
          </View>
        ) : (
          /* ================================================= */
          /* ADDRESS LIST */
          /* ================================================= */

          <View style={{ paddingHorizontal: 20 }}>
            {addresses.map((item) => (
              <AddressCard
                key={item._id}
                item={item}
                onEdit={openEditModal}
                onDelete={confirmDelete}
              />
            ))}
          </View>
        )}

        {/* Security Note */}

        <View
          style={{
            marginHorizontal: 20,
            marginTop: 8,
            padding: 14,
            borderRadius: 15,
            backgroundColor: C.successLight,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={C.success}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 9,
              fontSize: 10,
              lineHeight: 15,
              color: '#047857',
            }}
          >
            Your saved addresses are securely linked to
            your MediShield account and can be used during
            checkout.
          </Text>
        </View>
      </ScrollView>

      {/* ================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: 'rgba(15,23,42,0.5)',
            justifyContent: 'flex-end',
          }}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <View
            style={{
              maxHeight: '92%',
              backgroundColor: C.bg,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}

            <View
              style={{
                backgroundColor: C.white,
                paddingHorizontal: 20,
                paddingVertical: 17,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '800',
                    color: C.dark,
                  }}
                >
                  {editingAddress
                    ? 'Edit Address'
                    : 'Add New Address'}
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    marginTop: 3,
                  }}
                >
                  {editingAddress
                    ? 'Update your delivery information'
                    : 'Enter your delivery information'}
                </Text>
              </View>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  backgroundColor: '#f1f5f5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={C.dark}
                />
              </Pressable>
            </View>

            {/* Form */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 30,
              }}
            >
              <FormInput
                label="Address Name"
                icon="bookmark-outline"
                value={form.name}
                onChangeText={(value) =>
                  updateField('name', value)
                }
                placeholder="e.g. Clinic, Home, Office"
                error={errors.name}
              />

              <FormInput
                label="Mobile Number"
                icon="call-outline"
                value={form.mobile}
                onChangeText={(value) =>
                  updateField(
                    'mobile',
                    value.replace(/\D/g, '')
                  )
                }
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                error={errors.mobile}
              />

              <FormInput
                label="Complete Address"
                icon="location-outline"
                value={form.address}
                onChangeText={(value) =>
                  updateField('address', value)
                }
                placeholder="House, building, street, area..."
                multiline
                error={errors.address}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="City"
                    icon="business-outline"
                    value={form.city}
                    onChangeText={(value) =>
                      updateField('city', value)
                    }
                    placeholder="City"
                    error={errors.city}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <FormInput
                    label="State"
                    icon="map-outline"
                    value={form.state}
                    onChangeText={(value) =>
                      updateField('state', value)
                    }
                    placeholder="State"
                    error={errors.state}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Country"
                    icon="globe-outline"
                    value={form.country}
                    onChangeText={(value) =>
                      updateField('country', value)
                    }
                    placeholder="Country"
                    error={errors.country}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Pincode"
                    icon="navigate-outline"
                    value={form.pincode}
                    onChangeText={(value) =>
                      updateField(
                        'pincode',
                        value.replace(/\D/g, '')
                      )
                    }
                    placeholder="Pincode"
                    keyboardType="number-pad"
                    error={errors.pincode}
                  />
                </View>
              </View>

              {/* Submit */}

              <Pressable
                onPress={handleSubmit}
                disabled={saving}
                style={{
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: C.primary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 3,
                  opacity: saving ? 0.7 : 1,

                  shadowColor: C.primary,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                {saving ? (
                  <ActivityIndicator
                    size="small"
                    color={C.white}
                  />
                ) : (
                  <>
                    <Ionicons
                      name={
                        editingAddress
                          ? 'checkmark-circle-outline'
                          : 'location-outline'
                      }
                      size={19}
                      color={C.white}
                    />

                    <Text
                      style={{
                        color: C.white,
                        fontSize: 13,
                        fontWeight: '800',
                      }}
                    > 
                      {editingAddress
                        ? 'Update Address'
                        : 'Save Address'}
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}