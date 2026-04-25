import { View, Text } from "react-native";
import C from "@/utils/theme";
import useBreakpoint from "@/utils/breakpoints";
import { Ionicons } from '@expo/vector-icons';


export default function TrustBar() {
  
  const { isMobile} = useBreakpoint();
  console.log('isMobile',isMobile);
  
  return (
    <View >
          <View style={{
            flexDirection: isMobile ? 'column' : 'row',
            backgroundColor: C.white, borderRadius: 16,
            padding: isMobile ? 16 : 20,
            borderWidth: 1, borderColor: C.border,
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            gap: isMobile ? 12 : 0,
          }}>
            {[
              { icon: 'rocket-outline',           title: 'Fast Delivery',  sub: '2-5 business days' },
              { icon: 'shield-checkmark-outline', title: '100% Authentic', sub: 'Clinically certified' },
              { icon: 'pricetag-outline',         title: 'Best Price',     sub: 'Lowest guaranteed' },
              { icon: 'headset-outline',          title: '24/7 Support',   sub: 'Always here to help' },
            ].map((b, i, arr) => (
              <View key={b.title} style={{
                flex: isMobile ? undefined : 1,
                flexDirection: 'row', alignItems: 'center', gap: 12,
                borderRightWidth: !isMobile && i < arr.length - 1 ? 1 : 0,
                borderRightColor: C.border,
                borderBottomWidth: isMobile && i < arr.length - 1 ? 1 : 0,
                borderBottomColor: C.border,
                paddingRight: !isMobile && i < arr.length - 1 ? 20 : 0,
                paddingLeft: !isMobile && i > 0 ? 20 : 0,
                paddingBottom: isMobile && i < arr.length - 1 ? 12 : 0,
              }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 13,
                  backgroundColor: C.primaryLight,
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ionicons name={b.icon} size={20} color={C.primary} />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.dark }}>{b.title}</Text>
                  <Text style={{ fontSize: 12, color: C.muted }}>{b.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
  )
}
