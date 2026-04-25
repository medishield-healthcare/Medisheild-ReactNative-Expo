// app/_layout.jsx  ← ROOT layout
//
// FOLDER STRUCTURE (ye honi chahiye):
//
//   app/
//   ├── _layout.jsx           ← YE FILE (root Stack)
//   ├── login.jsx             ← Tab bar ke bahar
//   ├── register.jsx          ← Tab bar ke bahar
//   ├── product/
//   │   └── [id].jsx          ← Tab bar ke bahar
//   └── (tabs)/               ← Sirf tab screens is folder mein
//       ├── _layout.jsx       ← Tabs layout (doosri file)
//       ├── index.jsx         ← Home  (index.native.jsx / index.web.jsx)
//       ├── shop.jsx          ← Shop
//       ├── cart.jsx          ← Cart
//       └── profile.jsx       ← Profile
//
// Ye structure ensure karta hai ki SIRF (tabs) folder ke screens
// tab bar mein aayein — login/register/product kabhi nahi dikhenge.

import { Stack } from 'expo-router';
import '../global.css';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/context/CartContext';

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Root screens — tab bar ke bahar */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
          </Stack>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
