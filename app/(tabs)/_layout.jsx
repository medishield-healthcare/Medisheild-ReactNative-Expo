// app/(tabs)/_layout.jsx  ← TABS layout
//
// Web  → Stack (no tab bar, each page has its own header)
// Native → Tabs with exactly 4 options: Home, Shop, Cart, Profile

import { Stack, Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#CD0F0F';
const PRIMARY_DARK = '#CD0F0F';
const INACTIVE = '#94a3b8';
const WHITE = '#ffffff';

// ── Custom Tab Icon ────────────────────────────────────────────────────────────
function TabIcon({ name, nameActive, label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 4 }}>
      {/* Pill highlight when active */}
      <View
        style={{
          width: 40,
          height: 28,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: focused ? '#ccfbf1' : 'transparent',
        }}>
        <Ionicons
          name={focused ? nameActive : name}
          size={22}
          color={focused ? PRIMARY : INACTIVE}
        />
      </View>
      <Text
        style={{  
          fontSize: 9,
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
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  const insets = useSafeAreaInsets();

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

          // 72 = actual tab content height
          // + Android system navigation safe area
          height: 72 + insets.bottom,

          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',

          paddingTop: 6,

          // System navigation bar ke liye proper space
          paddingBottom: insets.bottom + 6,

          shadowColor: PRIMARY_DARK,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
        },
      }}>
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
            <TabIcon
              name="storefront-outline"
              nameActive="storefront"
              label="Shop"
              focused={focused}
            />
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
      <Tabs.Screen
        name="brands"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="new-arrivals"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="privacy-policy"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="terms-and-conditions"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="track-order"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="help-and-support"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="addresses"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="clinic-setup"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
      
    </Tabs>
  );
}
