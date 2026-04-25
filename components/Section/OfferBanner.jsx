
import { View, Text,Pressable } from 'react-native'
import C from '@/utils/theme'
import { Ionicons } from '@expo/vector-icons';
import useBreakpoint from '@/utils/breakpoints';


export default function OfferBanner() {
  const {isMobile} = useBreakpoint()
  return (
    <View >
          <View style={{
            borderRadius: isMobile ? 20 : 24,
            backgroundColor: C.accentLight,
            padding: isMobile ? 24 : 40,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            borderWidth: 1, borderColor: '#fde68a', overflow: 'hidden',
          }}>
            <View style={{ position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#fde68a', opacity: 0.25, right: -60, top: -80 }} />
            <View>
              <View style={{ alignSelf: 'flex-start', backgroundColor: C.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: '800' }}>LIMITED TIME OFFER</Text>
              </View>
              <Text style={{ fontSize: isMobile ? 28 : 38, fontWeight: '900', color: C.dark, letterSpacing: -0.5 }}>Flat 20% OFF</Text>
              <Text style={{ fontSize: isMobile ? 13 : 15, color: C.muted, marginTop: 6, marginBottom: 20 }}>
                On all dental materials this week. Code:{' '}
                <Text style={{ fontWeight: '800', color: C.dark }}>DENTAL20</Text>
              </Text>
              <Pressable style={{
                alignSelf: 'flex-start', backgroundColor: C.dark,
                borderRadius: 14, paddingHorizontal: isMobile ? 18 : 24,
                paddingVertical: isMobile ? 11 : 13,
                flexDirection: 'row', alignItems: 'center', gap: 8,
              }}>
                <Text style={{ color: 'white', fontSize: isMobile ? 13 : 14, fontWeight: '800' }}>Claim Offer</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </Pressable>
            </View>
            {!isMobile && (
              <Text style={{ fontSize: 100, fontWeight: '900', color: C.accent, opacity: 0.2 }}>20%</Text>
            )}
          </View>
        </View>
  )
}
