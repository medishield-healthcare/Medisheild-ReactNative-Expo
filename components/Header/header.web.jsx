import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext, useAuth } from "../../src/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "expo-router";

export default function HeaderWeb() {
  const data = useContext(AuthContext);
  console.log('header',data)
  const router = useRouter()

  const { logout } = useAuth();

  return (
    <View className="w-6xl py-4  flex-row items-center justify-between bg-white border-b border-gray-200">   
      {/* Logo */}
      <Text className="text-2xl font-bold text-teal-600">
        DentCare
      </Text>
      {/* Nav */}
      <View className="flex-row items-center gap-8">
        <Text className="text-gray-600 hover:text-teal-600 cursor-pointer">
          Home
        </Text>
        <Text className="text-gray-600 hover:text-teal-600 cursor-pointer">
          Services
        </Text>
        <Text className="text-gray-600 hover:text-teal-600 cursor-pointer">
          Contact
        </Text>
        {/* Auth Button */}
        {data?.isAuthenticated ? (
          <TouchableOpacity
            onPress={logout}
            className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-red-600"
          >
            <Text className=" font-semibold">Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={()=>router.push('/auth/login')} className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700">
            <Text className=" font-semibold">Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
