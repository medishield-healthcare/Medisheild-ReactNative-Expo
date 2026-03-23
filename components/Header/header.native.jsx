import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";

export default function HeaderNative() {
  const { user, logout } = useAuth();
  const router = useRouter()
  return (
    <View className="h-16 px-5 flex-row items-center justify-between shadow-sm">

      {/* Logo */}
      <Text className="text-xl font-bold text-teal-600">
        DentCare
      </Text>

      {/* Auth Button */}
      {user ? (
        <TouchableOpacity
          onPress={()=>{
            logout()
            router.push('/auth/login')
          }
          }
          className="px-4 py-2 rounded-lg bg-blue-500"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="px-4 py-2 rounded-lg bg-teal-600">
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
