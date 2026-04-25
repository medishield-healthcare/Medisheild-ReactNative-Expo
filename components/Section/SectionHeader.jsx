import C from "@/utils/theme";
import { Pressable, Text,View } from "react-native";



export default function SectionHeader({ title, onSeeAll }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 20,
        marginBottom: 14,
      }}>
        
      <Text style={{ fontSize: 17, fontWeight: '800', color: C.dark }}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}