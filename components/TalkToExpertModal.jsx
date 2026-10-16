
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import C from '@/utils/theme';

export default function TalkToExpertModal({
  visible,
  onClose,
  onSubmit,
  title = 'Talk to an Expert',
  subtitle = 'Tell us about your clinic. Our team will help you find the right solutions.',
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }

    const digits = phone.replace(/\D/g, '');

    if (digits.length < 10 || digits.length > 15) {
      setError('Please enter a valid phone number.');
      return;
    }

    const formData = {
      name: name.trim(),
      phone: phone.trim(),
      requirement: requirement.trim(),
    };

    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Expert enquiry:', formData);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
          accessibilityLabel="Close expert enquiry popup"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View
            style={[
              styles.modal,
              {
                width: isMobile ? '92%' : 460,
                maxHeight: '88%',
              },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <View style={styles.header}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="call-outline"
                    size={23}
                    color={C.primary}
                  />
                </View>

                <Pressable
                  onPress={handleClose}
                  style={styles.closeButton}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close popup"
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={C.text}
                  />
                </Pressable>
              </View>

              <Text style={styles.eyebrow}>
                PERSONALIZED ASSISTANCE
              </Text>

              <Text style={styles.title}>{title}</Text>

              <Text style={styles.subtitle}>{subtitle}</Text>

              <Text style={styles.label}>Your name *</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={C.muted}
                />

                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    setError('');
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>

              <Text style={styles.label}>Phone number *</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={C.muted}
                />

                <TextInput
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    setError('');
                  }}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>

              <Text style={styles.label}>
                How can we help? (Optional)
              </Text>

              <View style={styles.textAreaWrapper}>
                <TextInput
                  value={requirement}
                  onChangeText={setRequirement}
                  placeholder="Tell us about your clinic or requirements..."
                  placeholderTextColor="#94a3b8"
                  style={styles.textArea}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={styles.submitText}>
                  Request a Callback
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color="#ffffff"
                />
              </Pressable>

              <View style={styles.footerNote}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={C.primary}
                />

                <Text style={styles.footerText}>
                  Your details will be used to respond to your enquiry.
                </Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  keyboardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },

  content: {
    padding: 25,
    paddingBottom: 22,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyebrow: {
    fontFamily: 'Poppins_400Regular',
    color: C.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  title: {
    fontFamily: 'Poppins_400Regular',
    color: C.text,
    fontSize: 27,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.7,
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: 'Poppins_400Regular',
    color: C.muted,
    fontSize: 12,
    lineHeight: 21,
    marginBottom: 22,
  },

  label: {
    fontFamily: 'Poppins_400Regular',
    color: C.text,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 14,
  },

  inputWrapper: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },

  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    color: C.text,
    fontSize: 12,
    paddingVertical: 12,
    outlineStyle: 'none',
  },

  textAreaWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },

  textArea: {
    fontFamily: 'Poppins_400Regular',
    minHeight: 88,
    color: C.text,
    fontSize: 12,
    lineHeight: 20,
    paddingVertical: 12,
    outlineStyle: 'none',
  },

  error: {
    fontFamily: 'Poppins_400Regular',
    color: '#dc2626',
    fontSize: 11,
    marginTop: 10,
  },

  submitButton: {
    marginTop: 22,
    minHeight: 49,
    borderRadius: 10,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  submitText: {
    fontFamily: 'Poppins_400Regular',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 15,
  },

  footerText: {
    flexShrink: 1,
    fontFamily: 'Poppins_400Regular',
    color: C.muted,
    fontSize: 10,
    lineHeight: 16,
  },
});
