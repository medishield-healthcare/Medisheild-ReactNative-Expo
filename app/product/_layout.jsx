import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function ProductLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          headerTitle: 'Medicare',
          headerLeft: () => (
            <Pressable
              className="flex items-center justify-center pl-2"
              onPress={() => router.navigate('/')}>
              <Ionicons name="arrow-back" size={22} color="black" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}

