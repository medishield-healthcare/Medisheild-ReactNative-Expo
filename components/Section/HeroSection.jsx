import React from 'react';
import { Image, View, Text, Pressable } from 'react-native';
import C from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBreakpoint from '@/utils/breakpoints';

export default function HeroSection() {
  const { px, isMobile, isTablet } = useBreakpoint();
  const router = useRouter();
  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          borderRadius: isMobile ? 20 : 28,
          overflow: 'hidden',
          backgroundColor: C.primaryDark,
          padding: isMobile ? 24 : isTablet ? 40 : 60,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          boxShadow: '0 20px 60px rgba(15,77,77,0.25)',
          gap: isMobile ? 20 : 0,
        }}>
        {/* Decorative circles */}
        <View
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: 'rgba(255,255,255,0.04)',
            top: -120,
            right: -80,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: 'rgba(45,212,191,0.1)',
            bottom: -60,
            right: 160,
          }}
        />
        <View
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Copy */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 30,
              paddingHorizontal: 12,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
            }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2dd4bf' }} />
            <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
              INDIA'S TRUSTED DENTAL STORE
            </Text>
          </View>

          <Text
            style={{
              fontSize: isMobile ? 32 : isTablet ? 40 : 52,
              fontWeight: '900',
              color: '#fff',
              letterSpacing: -1,
              lineHeight: isMobile ? 38 : isTablet ? 48 : 60,
              marginBottom: 14,
            }}>
            Your Smile,{'\n'}
            <Text style={{ color: '#2dd4bf' }}>Our Priority.</Text>
          </Text>

          <Text
            style={{
              color: '#ffffff',
              fontSize: isMobile ? 14 : 16,
              lineHeight: 24,
              maxWidth: 440,
              marginBottom: isMobile ? 20 : 32,
            }}>
            Shop clinically approved dental tools, materials and equipment trusted by dentists and
            patients across India.
          </Text>

          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Pressable
              onClick={() => router.push('/shop')}
              style={{
                backgroundColor: C.white,
                borderRadius: 14,
                paddingHorizontal: isMobile ? 20 : 28,
                paddingVertical: isMobile ? 12 : 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
              <Text
                onClick={() => router.push('/shop')}
                style={{ fontSize: isMobile ? 14 : 15, fontWeight: '800', color: C.primary }}>
                Shop Now
              </Text>
              <Ionicons name="arrow-forward" size={16} color={C.primary} />
            </Pressable>

            {!isMobile && (
              <Pressable
                style={{
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.25)',
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>
                  View Catalogue
                </Text>
              </Pressable>
            )}
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              gap: isMobile ? 20 : 40,
              marginTop: isMobile ? 24 : 40,
              flexWrap: 'wrap',
            }}>
            {[
              { val: '50K+', label: 'Customers' },
              { val: '200+', label: 'Products' },
              { val: '4.9★', label: 'Rating' },
              { val: '2-5d', label: 'Delivery' },
            ].map((s) => (
              <View key={s.label}>
                <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: '900', color: '#fff' }}>
                  {s.val}
                </Text>
                <Text style={{ fontSize: 12, color: '#ffffff', fontWeight: '600' }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hero image — hidden on mobile */}
        {!isMobile && (
          <View style={{ width: isTablet ? 180 : 260, alignItems: 'center' }}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png' }}
              style={{ width: isTablet ? 160 : 220, height: isTablet ? 160 : 220, opacity: 0.9 }}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
}
