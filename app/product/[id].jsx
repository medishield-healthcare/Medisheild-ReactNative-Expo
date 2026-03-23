import API from '@/api/axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/product/getproductwithid/${id}`)
      .then(res => {
        setProduct(res.data.findProduct);
        console.log(res);
        
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  if (!product) return <Text className="text-center mt-20 text-xl">Loading...</Text>;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-5">

        {/* MAIN CONTAINER */}
        <View className="lg:flex-row flex-col bg-white rounded-2xl  p-4 gap-6">

          {/* IMAGE */}
          <View className="lg:w-1/2 w-full bg-gray-100 rounded-xl p-3">
            <Image
              source={{ uri: product.thumbnail_url }}
              className="w-full h-80 rounded-xl"
              resizeMode="contain"
            />
          </View>

          {/* DETAILS */}
          <View className="lg:w-1/2 w-full gap-3">

            <Text className="text-sm text-gray-500 tracking-widest">{product.manufacturer}</Text>
            <Text className="text-3xl font-bold text-gray-900">{product.name}</Text>

            {/* RATING */}
            <View className="flex-row items-center gap-2">
              <Text className="text-yellow-500 text-lg">⭐ {product?.rating}</Text>
              <Text className="text-gray-500">({product.reviews.length} Reviews)</Text>
            </View>

            {/* DESCRIPTION */}
            <Text className="text-gray-600 text-base mt-2">{product.product_specs.description}</Text>

            {/* COLOR SELECT */}
            <View className="flex-row items-center gap-2 mt-4">
              <Text className="font-medium">Color:</Text>
              <View className="w-6 h-6 rounded-full border border-gray-300" />
              <View className="w-6 h-6 rounded-full bg-gray-700" />
              <View className="w-6 h-6 rounded-full bg-blue-500" />
            </View>

            {/* SIZE SELECT */}
            <View className="flex-row items-center gap-2 mt-4">
              <Text className="font-medium">Size:</Text>
              <View className="border border-gray-300 px-4 py-2 rounded-lg">
                <Text>SM</Text>
              </View>
              <View className="border border-gray-300 px-4 py-2 rounded-lg">
                <Text>M</Text>
              </View>
              <View className="border border-gray-300 px-4 py-2 rounded-lg">
                <Text>L</Text>
              </View>
            </View>

            {/* PRICE + BUTTONS */}
            <View className="flex-row items-center mt-6 gap-4">
              <Text dangerouslySetInnerHTML={{ __html: `₹${product.price.regularPrice}` }} className="text-3xl font-bold text-gray-900" />

              <Pressable className="bg-indigo-600 px-6 py-3 rounded-xl ml-auto">
                <Text className="text-white font-bold">Buy Now</Text>
              </Pressable>

              <Pressable className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
                <Text className="text-xl">❤️</Text>
              </Pressable>
            </View>

          </View>
        </View>

        {/* REVIEWS SECTION */}
        <View className="mt-10 bg-white p-4 rounded-2xl">
          <Text className="text-2xl font-bold mb-4">Customer Reviews</Text>

          {product.reviews.map((r, i) => (
            <View key={i} className="border-b border-gray-200 py-3">
              <Text className="font-semibold">{r.reviewerName}</Text>
              <Text className="text-yellow-500">⭐ {r.rating}</Text>
              <Text className="text-gray-600">{r.comment}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}