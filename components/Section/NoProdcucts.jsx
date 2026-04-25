import C from '@/utils/theme'
import React from 'react'
import { Text,View, Pressable } from 'react-native'
import {Ionicons} from '@expo/vector-icons'

export default function NoProdcucts({search,setSearch}) {
  return (
    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: C.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                  <Ionicons name="search-outline" size={32} color={C.muted} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.dark }}>
                  No products found
                </Text>
                <Text style={{ color: C.muted, marginTop: 6, fontSize: 14 }}>
                  Try a different search or category
                </Text>
                {search.length > 0 && (
                  <Pressable
                    onPress={() => setSearch('')}
                    style={{
                      marginTop: 14,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      backgroundColor: C.primaryLight,
                      borderRadius: 12,
                    }}>
                    <Text style={{ color: C.primary, fontWeight: '700' }}>Clear search</Text>
                  </Pressable>
                )}
              </View>
  )
}
