import C from "@/utils/theme";
import { View } from "react-native";

// ── Product Grid Skeleton ─────────────────────────────────────────────────────
function GridSkeleton({ cols }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {Array(cols * 2).fill(0).map((_, i) => (
        <View key={i} style={{
          width: `${(100 / cols).toFixed(2)}%`,
          borderRadius: 20, overflow: 'hidden',
          backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
        }}>
          <View style={{ height: 200, backgroundColor: '#e2e8f0' }} />
          <View style={{ padding: 14, gap: 8 }}>
            <View style={{ height: 14, backgroundColor: '#e2e8f0', borderRadius: 6, width: '80%' }} />
            <View style={{ height: 14, backgroundColor: '#e2e8f0', borderRadius: 6, width: '50%' }} />
            <View style={{ height: 36, backgroundColor: '#e2e8f0', borderRadius: 10, marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
}


export default GridSkeleton;