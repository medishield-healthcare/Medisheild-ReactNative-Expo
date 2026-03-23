import { View, Text, Pressable } from "react-native";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";

export default function Search() {
  const C = {
  primary:     '#0f766e',
  primaryDark: '#0f4f4f',
  primaryLight:'#ccfbf1',
  accent:      '#f59e0b',
  accentLight: '#fef3c7',
  bg:          '#f0fafa',
  white:       '#ffffff',
  dark:        '#0f172a',
  muted:       '#64748b',
  border:      '#e2e8f0',
  card:        '#ffffff',
};
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Search Page</Text>
   
    </View>
  );
}