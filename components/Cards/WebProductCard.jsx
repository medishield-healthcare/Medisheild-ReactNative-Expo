import C from "@/utils/theme";
import { Image, Pressable, Text, View , useWindowDimensions} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";


function WebProductCard({ item, onBuy, onCart, cols }) {
  const [hovered, setHovered] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  // Calculate card width based on cols and gaps
  const gapTotal = (cols - 1) * 16;
  const cardPct = `${(100 / cols).toFixed(2)}%`;

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width: cardPct,
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: C.card, borderRadius: 20, overflow: 'hidden',
        borderWidth: 1, borderColor: hovered ? C.primary : C.border,
        transform: [{ translateY: hovered ? -4 : 0 }],
        boxShadow: hovered
          ? '0 12px 40px rgba(15,118,110,0.15)'
          : '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Image */}
      <View style={{ position: 'relative', backgroundColor: C.bg }}>
        <Image
          source={{ uri: item.thumbnail_url }}
          style={{ width: '100%', height: isMobile ? 160 : 200 }}
          resizeMode="cover"
        />
        {item.featured && (
          <View style={{
            position: 'absolute', top: 10, left: 10,
            backgroundColor: C.accent, borderRadius: 6,
            paddingHorizontal: 8, paddingVertical: 4,
          }}>
            <Text style={{ color: 'white', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>
              FEATURED
            </Text>
          </View>
        )}
        <Pressable style={{
          position: 'absolute', top: 10, right: 10,
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 20, padding: 6,
        }}>
          <Ionicons name="heart-outline" size={16} color={C.muted} />
        </Pressable>

        {/* Hover overlay */}
        {hovered && (
          <Pressable
            onPress={() => onCart(item)}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              backgroundColor: 'rgba(15,77,77,0.88)',
              padding: 10, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 6,
            }}
          >
            <Ionicons name="bag-add-outline" size={16} color="white" />
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>Quick Add</Text>
          </Pressable>
        )}
      </View>

      {/* Info */}
      <View style={{ padding: isMobile ? 12 : 14 }}>
        <Pressable
         onPress={() => onBuy(item._id)}
         numberOfLines={2} style={{
          fontSize: isMobile ? 11 : 14, fontWeight: '700', color: C.dark,
          lineHeight: 20, marginBottom: 6,
        }}>
          {item.name.slice(0, 35) + (item.name.length > 40 ? '...' : '')}
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Text style={{ fontSize: isMobile ? 15 : 17, fontWeight: '900', color: C.primary }}>
            ₹{item.price?.minimalPrice}
          </Text>
          {item.price?.salePrice && item.price.salePrice < item.price.regularPrice && (
            <Text style={{ fontSize: 12, color: C.muted, textDecorationLine: 'line-through' }}>
              ₹{item.price.salePrice}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => onCart(item)}
            style={{
              flex: 1, borderRadius: 10, borderWidth: 1.5,
              borderColor: C.primary, paddingVertical: 8, alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.primary }}>Add to Cart</Text>
          </Pressable>
          {/* <Pressable
            onPress={() => onBuy(item._id)}
            style={{
              flex: 1, borderRadius: 10, backgroundColor: C.primary,
              paddingVertical: 8, alignItems: 'center',
              boxShadow: '0 4px 14px rgba(15,118,110,0.3)',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: 'white' }}>Buy Now</Text>
          </Pressable> */}
        </View>
      </View>
    </Pressable>
  );
}


export default WebProductCard