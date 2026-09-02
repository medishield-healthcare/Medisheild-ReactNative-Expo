import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function HeaderNative() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <View className="h-16 flex-row items-center justify-between px-5 shadow-sm">
      {/* Logo */}
      <Text className="text-xl font-bold text-teal-600">DentCare</Text>

      {/* Auth Button */}
      {user ? (
        <TouchableOpacity
          onPress={() => {
            logout();
            router.push('/auth/login');
          }}
          className="rounded-lg bg-blue-500 px-4 py-2">
          <Text className="font-semibold text-white">Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="rounded-lg bg-teal-600 px-4 py-2">
          <Text className="font-semibold text-white">Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
