// app/(tabs)/_layout.jsx  ← TABS layout
//
// Web  → Stack (no tab bar, each page has its own header)
// Native → Tabs with exactly 4 options: Home, Shop, Cart, Profile

import { Stack, Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY      = '#0f766e';
const PRIMARY_DARK = '#0f4f4f';
const INACTIVE     = '#94a3b8';
const WHITE        = '#ffffff';

// ── Custom Tab Icon ────────────────────────────────────────────────────────────
function TabIcon({ name, nameActive, label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 4 }}>
      {/* Pill highlight when active */}
      <View style={{
        width: 44, height: 28, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: focused ? '#ccfbf1' : 'transparent',
      }}>
        <Ionicons
          name={focused ? nameActive : name}
          size={22}
          color={focused ? PRIMARY : INACTIVE}
        />
      </View>
      <Text style={{
        fontSize: 10,
        fontWeight: focused ? '600' : '500',
        color: focused ? PRIMARY : INACTIVE,
        letterSpacing: 0.2,
      }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  // Web pe tab bar nahi — Stack use karo
  if (Platform.OS === 'web') {
    return (
      <Stack screenOptions={{ headerShown: false }} />
    );
  }

  // Native pe sirf 4 tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: WHITE,
          height: 72,
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingTop: 6,
          paddingBottom: 10,
          shadowColor: PRIMARY_DARK,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" nameActive="home" label="Home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="storefront-outline" nameActive="storefront" label="Shop" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="bag-outline" nameActive="bag" label="Cart" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" nameActive="person" label="Profile" focused={focused} />
          ),
        }}
      />

    </Tabs>
  );
}