import API from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import WebHeader from 'components/Header/header.web';
import Footer from 'components/Footer/Footer';
import React, { useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  Pressable,
} from 'react-native';

import C from '@/utils/theme';
import { router } from 'expo-router';

function Blog() {
  const { width } = useWindowDimensions();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const pagePadding = isMobile ? 16 : isTablet ? 28 : 40;
  const maxWidth = isMobile ? '100%' : isTablet ? 900 : 1240;

  const columns = isMobile ? 1 : isTablet ? 2 : 3;
  const gap = isMobile ? 14 : 20;

  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['Blogs'],
    queryFn: async () => {
      const res = await API.get('/blog');
      return res.data.data || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const [hoveredId, setHoveredId] = useState(null);

  const getDescription = (description = '') =>
    description
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View
      style={{
        flex: 1,
        minHeight: Platform.OS === 'web' ? '100vh' : undefined,
        backgroundColor: C.bg,
        fontFamily: 'Poppins_400Regular',
      }}>
      <WebHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            maxWidth,
            alignSelf: 'center',
            paddingHorizontal: pagePadding,
            paddingTop: 28,
            paddingBottom: 45,
          }}>
          {/* Breadcrumb */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 24,
            }}>
            <Pressable onPress={() => router.push('/')}>
              <Text style={{ color: C.muted, fontSize: 11 }}>Home</Text>
            </Pressable>

            <Text style={{ color: C.muted, fontSize: 11 }}>/</Text>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 11,
                fontWeight: '700',
                color: C.primary,
              }}>
              Blog
            </Text>
          </View>

          {/* Hero */}

          <View
            style={{
              backgroundColor: C.primaryDark,
              borderRadius: isMobile ? 18 : 24,
              padding: isMobile ? 24 : 40,
              marginBottom: isMobile ? 30 : 42,
              overflow: 'hidden',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 10,
                fontWeight: '800',
                letterSpacing: 1.5,
                color: '#fff',
                marginBottom: 14,
              }}>
              HEALTH & WELLNESS
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: isMobile ? 30 : isTablet ? 36 : 42,
                lineHeight: isMobile ? 39 : 52,
                fontWeight: '900',
                color: C.white,
              }}>
              Our Latest Blogs
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: isMobile ? 12 : 14,
                lineHeight: 23,
                color: '#fff',
                marginTop: 12,
                maxWidth: 550,
              }}>
              Explore helpful articles, healthcare insights and useful information to support your
              health and wellness journey.
            </Text>
          </View>

          {/* Section Heading */}

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: isMobile ? 24 : 30,
                fontWeight: '900',
                color: C.dark,
              }}>
              Latest Articles
            </Text>

            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 12,
                color: C.muted,
                marginTop: 6,
              }}>
              Read our latest healthcare updates and articles.
            </Text>
          </View>

          {/* Loading */}

          {isLoading && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 80,
              }}>
              <ActivityIndicator size="large" color={C.primary} />

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  color: C.muted,
                  fontSize: 13,
                  marginTop: 14,
                }}>
                Loading blogs...
              </Text>
            </View>
          )}

          {/* Error */}

          {isError && (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 50,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 16,
                  fontWeight: '700',
                  color: C.dark,
                }}>
                Unable to load blogs
              </Text>

              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 12,
                  color: C.muted,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                Please try again later.
              </Text>
            </View>
          )}

          {/* Blog Grid */}

          {!isLoading && !isError && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: -gap / 2,
                rowGap: gap,
              }}>
              {blogs.map((blog) => {
                const isHovered = hoveredId === blog._id;

                return (
                  <View
                    onClick={() => router.push(`/blog/${blog._id}`)}
                    key={blog._id}
                    style={{
                      width: `${100 / columns}%`,
                      paddingHorizontal: gap / 2,
                      cursor: 'pointer',
                    }}>
                    <View
                      onMouseEnter={
                        Platform.OS === 'web' ? () => setHoveredId(blog._id) : undefined
                      }
                      onMouseLeave={Platform.OS === 'web' ? () => setHoveredId(null) : undefined}
                      style={{
                        height: '100%',
                        backgroundColor: C.white,
                        borderRadius: isMobile ? 16 : 20,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: isHovered ? C.primary : C.border,
                        ...(Platform.OS === 'web'
                          ? {
                              boxShadow: isHovered
                                ? '0 14px 35px rgba(15,118,110,0.13)'
                                : '0 5px 22px rgba(15,23,42,0.05)',
                              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                              transition: 'all 0.2s ease',
                            }
                          : {
                              shadowColor: C.primaryDark,
                              shadowOffset: { width: 0, height: 3 },
                              shadowOpacity: 0.05,
                              shadowRadius: 8,
                              elevation: 2,
                            }),
                      }}>
                      {/* Blog Image */}

                      {blog.featuredImage ? (
                        <Image
                          source={{ uri: blog.featuredImage }}
                          resizeMode="cover"
                          style={{
                            width: '100%',
                            height: isMobile ? 200 : 210,
                            backgroundColor: '#F1F5F9',
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: '100%',
                            height: isMobile ? 200 : 210,
                            backgroundColor: '#F1F8F7',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins_400Regular',
                              color: C.primary,
                              fontSize: 14,
                            }}>
                            Blog
                          </Text>
                        </View>
                      )}

                      {/* Blog Content */}

                      <View
                        style={{
                          padding: isMobile ? 15 : 18,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 11,
                            color: C.primary,
                            fontWeight: '700',
                            marginBottom: 9,
                          }}>
                          {formatDate(blog.createdAt)}
                        </Text>

                        <Text
                          numberOfLines={2}
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: isMobile ? 18 : 17,
                            lineHeight: 26,
                            fontWeight: '900',
                            color: C.dark,
                            marginBottom: 10,
                          }}>
                          {blog.title}
                        </Text>

                        <Text
                          numberOfLines={3}
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 12,
                            lineHeight: 21,
                            color: C.muted,
                          }}>
                          {getDescription(blog.description)}
                        </Text>

                        <View
                          style={{
                            height: 1,
                            backgroundColor: C.border,
                            marginTop: 18,
                            marginBottom: 14,
                          }}
                        />

                        <Text
                          style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 12,
                            fontWeight: '700',
                            color: C.primary,
                          }}>
                          Read Article →
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {!isLoading && !isError && blogs.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 50,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 16,
                  fontWeight: '700',
                  color: C.dark,
                }}>
                No blogs available
              </Text>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

export default Blog;
