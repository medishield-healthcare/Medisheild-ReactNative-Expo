import C from "@/utils/theme";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    // product grid columns
    cols: width < 480 ? 1 : width < 768 ? 2 : width < 1024 ? 3 : 4,
    px: width < 640 ? 16 : width < 1024 ? 24 : 40,
  };
}
export default function Footer() {
    const { isMobile,px } = useBreakpoint();
  return (
   <View style={{ backgroundColor: C.primaryDark, paddingHorizontal: px, paddingTop: isMobile ? 32 : 48, paddingBottom: 24 }}>
          <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 28 : 40, marginBottom: 32 }}>
            {/* Brand */}
            <View style={{ flex: isMobile ? undefined : 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="medical" size={17} color="white" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>MediShield</Text>
              </View>
              <Text style={{ color: '#94d8d4', fontSize: 14, lineHeight: 22, maxWidth: 240 }}>
                India's trusted dental products store. Quality you can count on.
              </Text>
            </View>

            {/* Link columns */}
            <View style={{ flexDirection: 'row', flex: isMobile ? undefined : 3, gap: 20, flexWrap: 'wrap' }}>
              {[
                { heading: 'Shop',    links: ['All Products', 'Instruments', 'Materials', 'Equipment'] },
                { heading: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
                { heading: 'Support', links: ['FAQ', 'Shipping', 'Returns', 'Track Order'] },
              ].map(col => (
                <View key={col.heading} style={{ flex: 1, minWidth: 100 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 1.5, marginBottom: 14 }}>
                    {col.heading.toUpperCase()}
                  </Text>
                  {col.links.map(l => (
                    <Pressable key={l} style={{ marginBottom: 10 }}>
                      <Text style={{ color: '#94d8d4', fontSize: 13 }}>{l}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Footer bottom */}
          <View style={{
            borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
            paddingTop: 18,
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 10 : 0,
          }}>
            <Text style={{ color: '#5eead4', fontSize: 12 }}>© 2025 MediShield · All rights reserved.</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {['Privacy', 'Terms', 'Cookies'].map(l => (
                <Pressable key={l}><Text style={{ color: '#5eead4', fontSize: 12 }}>{l}</Text></Pressable>
              ))}
            </View>
          </View>
        </View>
  )
}
