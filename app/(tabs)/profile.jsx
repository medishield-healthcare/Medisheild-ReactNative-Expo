// app/(tabs)/profile.jsx

import { useContext, useState } from "react";
import {
  View, Text, Pressable, ScrollView,
  ActivityIndicator, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import WebHeader from "components/Header/header.web";
import Footer from "components/Footer/Footer";

const C = {
  primary:      '#0f766e',
  primaryDark:  '#0f4f4f',
  primaryLight: '#ccfbf1',
  accent:       '#f59e0b',
  accentLight:  '#fef3c7',
  bg:           '#f0fafa',
  white:        '#ffffff',
  dark:         '#0f172a',
  muted:        '#64748b',
  border:       '#e2e8f0',
  danger:       '#ef4444',
  dangerBg:     '#fef2f2',
};

// ── Menu Row ──────────────────────────────────────────────────────────────────
function MenuItem({ icon, label, value, onPress, danger = false, rightIcon = "chevron-forward" }) {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-70"
      style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 15,
        borderBottomWidth: 1, borderBottomColor: C.border,
        gap: 14,
      }}
    >
      {/* Icon box */}
      <View style={{
        width: 38, height: 38, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: danger ? C.dangerBg : C.primaryLight,
      }}>
        <Ionicons name={icon} size={18} color={danger ? C.danger : C.primary} />
      </View>

      {/* Label */}
      <Text style={{
        flex: 1, fontSize: 15, fontWeight: '600',
        color: danger ? C.danger : C.dark,
      }}>
        {label}
      </Text>

      {/* Value or chevron */}
      {value ? (
        <Text style={{ fontSize: 13, color: C.muted, fontWeight: '500' }}>{value}</Text>
      ) : (
        <Ionicons name={rightIcon} size={16} color={C.muted} />
      )}
    </Pressable>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <View style={{ margin:20,marginBottom: 16 }}>
      {title && (
        <Text style={{
          fontSize: 11, fontWeight: '700', color: C.muted,
          letterSpacing: 1.5, marginBottom: 8,
          paddingHorizontal: 4, textTransform: 'uppercase',
        }}>
          {title}
        </Text>
      )}
      <View style={{
        backgroundColor: C.white, borderRadius: 20,
        borderWidth: 1, borderColor: C.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
      }}>
        {children}
      </View>
    </View>
  );
}

// ── NOT LOGGED IN STATE ───────────────────────────────────────────────────────
function GuestView() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top decoration */}
        <View style={{
          position: 'absolute', width: 300, height: 300, borderRadius: 150,
          backgroundColor: C.primaryLight, opacity: 0.4,
          top: -100, right: -80,
        }} />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, paddingTop: 80 }}>

          {/* Illustration */}
          <View style={{
            width: 110, height: 110, borderRadius: 55,
            backgroundColor: C.primaryLight,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
            borderWidth: 4, borderColor: C.white,
            shadowColor: C.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15, shadowRadius: 20, elevation: 6,
          }}>
            <Ionicons name="person-outline" size={52} color={C.primary} />
          </View>

          <Text style={{
            fontSize: 26, fontWeight: '900', color: C.dark,
            letterSpacing: -0.5, textAlign: 'center',
          }}>
            You're not logged in
          </Text>

          <Text style={{
            fontSize: 15, color: C.muted, textAlign: 'center',
            lineHeight: 22, marginTop: 10, marginBottom: 36, maxWidth: 280,
          }}>
            Sign in to view your profile, orders, wishlist and exclusive member benefits.
          </Text>

          {/* Perks row */}
          <View style={{
            width: '100%', backgroundColor: C.white,
            borderRadius: 20, padding: 20, marginBottom: 32,
            borderWidth: 1, borderColor: C.border,
            gap: 14,
          }}>
            {[
              { icon: 'gift-outline',            text: '50 MediShield coins on signup' },
              { icon: 'bag-check-outline',        text: 'Track your orders easily' },
              { icon: 'heart-outline',            text: 'Save products to wishlist' },
              { icon: 'pricetag-outline',         text: 'Access exclusive member deals' },
            ].map((perk) => (
              <View key={perk.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name={perk.icon} size={17} color={C.primary} />
                </View>
                <Text style={{ fontSize: 14, color: C.dark, fontWeight: '500', flex: 1 }}>
                  {perk.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Sign In button */}
          <Pressable
            onPress={() => router.push('/auth/login')}
            className="active:opacity-80"
            style={{
              width: '100%', backgroundColor: C.primary,
              borderRadius: 18, paddingVertical: 16,
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', gap: 8, marginBottom: 12,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
            }}
          >
            <Ionicons name="log-in-outline" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>
              Sign In
            </Text>
          </Pressable>

          {/* Register link */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, color: C.muted }}>New to MediShield?</Text>
            <Pressable onPress={() => router.push('/auth/registration')}>
              <Text style={{ fontSize: 14, color: C.primary, fontWeight: '700' }}>
                Create account →
              </Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── LOGGED IN STATE ───────────────────────────────────────────────────────────
function ProfileView({ user, logout }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  // Initials avatar
  const initials = [user?.firstname?.[0], user?.lastname?.[0]]
    .filter(Boolean).join('').toUpperCase() || '?';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <WebHeader/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ padding: 20}}
      >

        {/* ── Header card ── */}
        <View style={{
          backgroundColor: C.primaryDark, borderRadius: 24,
          padding: 24, marginBottom: 24,
          margin : 20,
          overflow: 'hidden',
          shadowColor: C.primaryDark,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2, shadowRadius: 20, elevation: 8,
        }}>
          {/* Decorative circle */}
          <View style={{
            position: 'absolute', width: 200, height: 200, borderRadius: 100,
            backgroundColor: 'rgba(255,255,255,0.05)', top: -60, right: -40,
          }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {/* Avatar */}
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: C.primary,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: 'white' }}>
                {initials}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: 'white', letterSpacing: -0.3 }}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Text style={{ fontSize: 13, color: '#5eead4', marginTop: 3 }}>
                {user?.email}
              </Text>
              {/* Role badge */}
              <View style={{
                alignSelf: 'flex-start', marginTop: 6,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
              }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94d8d4', letterSpacing: 1 }}>
                  {(user?.role || 'customer').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Coins strip */}
          <View style={{
            marginTop: 18, paddingTop: 16,
            borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
            flexDirection: 'row', alignItems: 'center', gap: 8,
          }}>
            <View style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="logo-bitcoin" size={16} color={C.accent} />
            </View>
            <View>
              <Text style={{ fontSize: 11, color: '#94d8d4', fontWeight: '600' }}>
                MediShield Coins
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: 'white' }}>
                {user?.medishieldcoins ?? 0} coins
              </Text>
            </View>
            <Pressable style={{
              marginLeft: 'auto',
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <Text style={{ color: '#5eead4', fontSize: 12, fontWeight: '700' }}>Redeem →</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Account section ── */}
        <SectionCard title="Account">
          <MenuItem icon="person-outline"      label="Edit Profile"    onPress={() => router.push('/edit-profile')} />
          <MenuItem icon="bag-outline"          label="My Orders"       onPress={() => router.push('/track-order')} />
          <MenuItem icon="heart-outline"        label="Wishlist"        onPress={() => router.push('/wishlist')} />
          <MenuItem icon="location-outline"     label="Saved Addresses" onPress={() => router.push('/addresses')} />
        </SectionCard>

        {/* ── Referral section ── */}
        <SectionCard title="Referral">
          <MenuItem
            icon="gift-outline"
            label="Refer & Earn"
            value={user?.referralCode || '—'}
            onPress={() => {}}
            rightIcon="copy-outline"
          />
        </SectionCard>

        {/* ── Support section ── */}
        <SectionCard title="Support">
          <MenuItem icon="help-circle-outline"  label="Help & FAQ"      onPress={() => {router.push('/help-and-support')}} />
          <MenuItem icon="chatbubble-outline"   label="Contact Us"      onPress={() => {router.push('/contact')}} />
          <MenuItem icon="document-text-outline" label="Privacy Policy" onPress={() => {router.push('/privacy-policy')}} />
        </SectionCard>

        {/* ── Logout ── */}
        <SectionCard>
          <MenuItem
            icon="log-out-outline"
            label={loggingOut ? "Signing out..." : "Sign Out"}
            onPress={handleLogout}
            danger
            rightIcon={loggingOut ? null : "chevron-forward"}
          />
        </SectionCard>

        {/* App version */}
        <Text style={{ textAlign: 'center', fontSize: 11, color: C.muted, marginVertical: 18 }}>
          MediShield v1.0.0 · Dental Care
        </Text>

      <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Root Export ────────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, loading, logout } = useAuth();

  // Loading state — jab tak auth check ho raha hai
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={{ marginTop: 12, color: C.muted, fontSize: 14 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Not logged in → Guest view with Sign In prompt
  if (!user) return <GuestView />;

  // Logged in → Full profile
  return <ProfileView user={user} logout={logout} />;
}