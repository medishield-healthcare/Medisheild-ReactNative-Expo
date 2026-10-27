
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import RenderHTML from 'react-native-render-html';

import API from '@/api/axios';
import C from '@/utils/theme';

import WebHeader from 'components/Header/header.web';
import Footer from 'components/Footer/Footer';

const FONT = {
  regular: 'Poppins_400Regular',
};

export default function BlogDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const pagePadding = isMobile ? 16 : isTablet ? 28 : 40;

  const contentWidth = Math.max(
    280,
    Math.min(width - pagePadding * 2 - (isMobile ? 0 : 48), 760)
  );

  async function getData() {
    if (!id || Array.isArray(id)) {
      setBlog(null);
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const { data } = await API.get(`/blog/${id}`);

      // Preserve the existing API response structure.
      setBlog(data);
    } catch (err) {
      console.error('Blog fetch error:', err);
      setBlog(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [id]);

  const metaTitle =
    blog?.blogMetaTitle || blog?.title || 'MediShield Blog';

  const metaDescription =
    blog?.blogMetaDescription ||
    blog?.description?.replace(/<[^>]*>/g, '').slice(0, 160) ||
    'Read the latest dental healthcare articles from MediShield.';

  const canonicalUrl = blog
    ? `https://www.medishieldhealthcare.com/blog/${blog._id}`
    : '';

  const formattedDate = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <View style={styles.page}>
      {/* Dynamic SEO */}
      {blog && (
        <Head>
          <title>{metaTitle}</title>

          <meta name="description" content={metaDescription} />
          <meta name="robots" content="index, follow" />

          <link rel="canonical" href={canonicalUrl} />

          <meta property="og:type" content="article" />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={blog.featuredImage} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:site_name" content="MediShield" />

          <meta
            name="twitter:card"
            content="summary_large_image"
          />
          <meta name="twitter:title" content={metaTitle} />
          <meta
            name="twitter:description"
            content={metaDescription}
          />
          <meta
            name="twitter:image"
            content={blog.featuredImage}
          />
        </Head>
      )}

      {/* Existing website header */}
      <WebHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <View style={styles.breadcrumbSection}>
          <View
            style={[
              styles.breadcrumbContainer,
              { paddingHorizontal: pagePadding },
            ]}
          >
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.breadcrumbLink}>Home</Text>
            </Pressable>

            <Text style={styles.breadcrumbSeparator}>/</Text>

            <Pressable onPress={() => router.back()}>
              <Text style={styles.breadcrumbLink}>Blog</Text>
            </Pressable>

            {blog && (
              <>
                <Text style={styles.breadcrumbSeparator}>/</Text>

                <Text
                  numberOfLines={1}
                  style={styles.breadcrumbCurrent}
                >
                  {blog.title}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.stateContainer}>
            <View style={styles.loaderCircle}>
              <ActivityIndicator size="large" color={C.primary} />
            </View>

            <Text style={styles.stateTitle}>
              Loading article
            </Text>

            <Text style={styles.stateDescription}>
              Please wait while we fetch the article for you.
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loading && (error || !blog) && (
          <View
            style={[
              styles.stateContainer,
              { paddingHorizontal: pagePadding },
            ]}
          >
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>

            <Text style={styles.stateTitle}>
              Article not found
            </Text>

            <Text style={styles.stateDescription}>
              This article may have been removed or the link may
              be incorrect. Please return to the blog section.
            </Text>

            <Pressable
              onPress={() => router.back()}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                ← Go Back
              </Text>
            </Pressable>
          </View>
        )}

        {/* Article */}
        {!loading && !error && blog && (
          <View
            style={[
              styles.mainContainer,
              { paddingHorizontal: pagePadding },
            ]}
          >
            {/* Article Heading */}
            <View style={styles.articleHeading}>
              {/* <View style={styles.categoryBadge}>
                <View style={styles.categoryDot} />

                <Text style={styles.categoryText}>
                  HEALTH & WELLNESS
                </Text>
              </View> */}

              <Text
                accessibilityRole="header"
                style={[
                  styles.articleTitle,
                  {
                    fontSize: isMobile ? 28 : isTablet ? 36 : 44,
                    lineHeight: isMobile ? 39 : isTablet ? 48 : 58,
                  },
                ]}
              >
                {blog.title}
              </Text>

              <Text style={styles.articleSubtitle}>
                {blog.blogMetaDescription ||
                  'Explore healthcare insights and useful information from MediShield.'}
              </Text>

              <View style={styles.articleMeta}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorInitial}>M</Text>
                </View>

                <View style={styles.authorDetails}>
                  <Text style={styles.authorName}>
                    MediShield Team
                  </Text>

                  <Text style={styles.articleDate}>
                    {formattedDate
                      ? `Published on ${formattedDate}`
                      : 'MediShield Blog'}
                  </Text>
                </View>

                <View style={styles.metaDivider} />

                <View style={styles.readingLabel}>
                  <Text style={styles.readingLabelText}>
                    HEALTHCARE ARTICLE
                  </Text>
                </View>
              </View>
            </View>

            {/* Featured Image */}
            {blog.featuredImage ? (
              <View style={styles.featuredImageContainer}>
                <Image
                  source={{ uri: blog.featuredImage }}
                  accessibilityLabel={blog.title}
                  resizeMode="cover"
                  style={[
                    styles.featuredImage,
                    {
                      height: isMobile
                        ? 230
                        : isTablet
                          ? 350
                          : 750,
                    },
                  ]}
                />
              </View>
            ) : null}

            {/* Article Content */}
            <View
              style={[
                styles.articleLayout,
                {
                  flexDirection: isTablet || isMobile ? 'column' : 'row',
                  gap: isMobile ? 24 : 36,
                },
              ]}
            >
              <View style={styles.articleContent}>
                <View style={styles.contentHeading}>
                  <View style={styles.contentHeadingAccent} />

                  <Text style={styles.contentHeadingText}>
                    ARTICLE OVERVIEW
                  </Text>
                </View>

                {blog.description ? (
                  <RenderHTML
                    contentWidth={
                      isMobile || isTablet
                        ? contentWidth
                        : Math.min(width - 2 * pagePadding - 400, 760)
                    }
                    source={{ html: blog.description }}
                    tagsStyles={{
                      body: {
                        fontFamily: FONT.regular,
                        color: C.text,
                        fontSize: isMobile ? 14 : 15,
                        lineHeight: isMobile ? 26 : 29,
                        margin: 0,
                      },
                      p: {
                        fontFamily: FONT.regular,
                        color: C.text,
                        fontSize: isMobile ? 14 : 15,
                        lineHeight: isMobile ? 26 : 29,
                        marginTop: 0,
                        marginBottom: 20,
                      },
                      h1: {
                        fontFamily: FONT.regular,
                        color: C.dark,
                        fontSize: isMobile ? 25 : 32,
                        lineHeight: isMobile ? 34 : 42,
                        fontWeight: '700',
                        marginTop: 28,
                        marginBottom: 16,
                      },
                      h2: {
                        fontFamily: FONT.regular,
                        color: C.dark,
                        fontSize: isMobile ? 21 : 26,
                        lineHeight: isMobile ? 30 : 36,
                        fontWeight: '700',
                        marginTop: 26,
                        marginBottom: 14,
                      },
                      h3: {
                        fontFamily: FONT.regular,
                        color: C.dark,
                        fontSize: 20,
                        lineHeight: 29,
                        fontWeight: '700',
                        marginTop: 22,
                        marginBottom: 12,
                      },
                      a: {
                        color: C.primary,
                        textDecorationLine: 'underline',
                      },
                      li: {
                        fontFamily: FONT.regular,
                        color: C.text,
                        fontSize: isMobile ? 14 : 15,
                        lineHeight: isMobile ? 25 : 28,
                        marginBottom: 10,
                      },
                      strong: {
                        color: C.dark,
                        fontWeight: '700',
                      },
                      blockquote: {
                        borderLeftWidth: 4,
                        borderLeftColor: C.primary,
                        paddingLeft: 16,
                        marginLeft: 0,
                        color: C.text,
                      },
                    }}
                  />
                ) : (
                  <Text style={styles.stateDescription}>
                    No article content is available.
                  </Text>
                )}
              </View>

              {/* Article Sidebar */}
              <View
                style={[
                  styles.articleSidebar,
                  {
                    width: isMobile || isTablet ? '100%' : 260,
                  },
                ]}
              >
                <View style={styles.sidebarCard}>
                  <View style={styles.sidebarIcon}>
                    <Text style={styles.sidebarIconText}>M</Text>
                  </View>

                  <Text style={styles.sidebarTitle}>
                    About MediShield
                  </Text>

                  <Text style={styles.sidebarDescription}>
                    Discover dental products, clinical essentials
                    and healthcare information for modern dental
                    practices.
                  </Text>

                  <View style={styles.sidebarDivider} />

                  <View style={styles.sidebarInfoRow}>
                    <View style={styles.infoDot} />

                    <Text style={styles.sidebarInfoText}>
                      Healthcare insights
                    </Text>
                  </View>

                  <View style={styles.sidebarInfoRow}>
                    <View style={styles.infoDot} />

                    <Text style={styles.sidebarInfoText}>
                      Dental care resources
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => router.push('/')}
                    style={styles.sidebarButton}
                  >
                    <Text style={styles.sidebarButtonText}>
                      Explore MediShield →
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Bottom CTA */}
            <View style={styles.ctaCard}>
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaEyebrow}>
                  MEDISHIELD
                </Text>

                <Text
                  style={[
                    styles.ctaTitle,
                    { fontSize: isMobile ? 22 : 28 },
                  ]}
                >
                  Your trusted dental care partner
                </Text>

                <Text style={styles.ctaDescription}>
                  Explore products and clinical essentials for
                  your dental practice.
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/shop')}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaButtonText}>
                  Explore Products →
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Existing website footer */}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
    backgroundColor: C.bg,
    fontFamily: FONT.regular,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },

  // Breadcrumb
  breadcrumbSection: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  breadcrumbContainer: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 14,
  },

  breadcrumbLink: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: C.muted,
  },

  breadcrumbSeparator: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: C.muted,
  },

  breadcrumbCurrent: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: C.primary,
    fontWeight: '700',
    flexShrink: 1,
  },

  // Main layout
  mainContainer: {
    width: '100%',
    maxWidth: 1320,
    alignSelf: 'center',
    paddingTop: 38,
    paddingBottom: 54,
  },

  // Loading and error
  stateContainer: {
    flex: 1,
    minHeight: 430,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },

  loaderCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: C.border,
  },

  stateTitle: {
    fontFamily: FONT.regular,
    color: C.dark,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  stateDescription: {
    fontFamily: FONT.regular,
    color: C.muted,
    fontSize: 13,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 430,
  },

  errorIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  errorIconText: {
    color: '#D94848',
    fontFamily: FONT.regular,
    fontSize: 28,
    fontWeight: '700',
  },

  primaryButton: {
    backgroundColor: C.primaryDark,
    borderRadius: 9,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 24,
  },

  primaryButtonText: {
    fontFamily: FONT.regular,
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // Article heading
  articleHeading: {
    marginBottom: 30,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 6,
    marginBottom: 20,
    gap: 8,
  },

  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.primary,
  },

  categoryText: {
    fontFamily: FONT.regular,
    color: C.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
  },

  articleTitle: {
    fontFamily: FONT.regular,
    color: C.dark,
    fontWeight: '900',
    letterSpacing: -0.7,
    marginBottom: 18,
    maxWidth: 1000,
  },

  articleSubtitle: {
    fontFamily: FONT.regular,
    color: C.muted,
    fontSize: 14,
    lineHeight: 25,
    maxWidth: 760,
    marginBottom: 24,
  },

  // Author details
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },

  authorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  authorInitial: {
    fontFamily: FONT.regular,
    color: C.white,
    fontSize: 18,
    fontWeight: '700',
  },

  authorDetails: {
    justifyContent: 'center',
  },

  authorName: {
    fontFamily: FONT.regular,
    color: C.dark,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },

  articleDate: {
    fontFamily: FONT.regular,
    color: C.muted,
    fontSize: 10,
  },

  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: C.border,
    marginHorizontal: 5,
  },

  readingLabel: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  readingLabelText: {
    fontFamily: FONT.regular,
    color: C.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Featured image
  featuredImageContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#EEF5F6',
    marginBottom: 38,
    borderWidth: 1,
    borderColor: C.border,
  },

  featuredImage: {
    width: '100%',
  },

  // Article body and sidebar
  articleLayout: {
    alignItems: 'flex-start',
    marginBottom: 44,
  },

  articleContent: {
    flex: 1,
    minWidth: 0,
    width: '100%',
    padding: 0,
  },

  contentHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
  },

  contentHeadingAccent: {
    width: 4,
    height: 20,
    borderRadius: 3,
    backgroundColor: C.primary,
  },

  contentHeadingText: {
    fontFamily: FONT.regular,
    color: C.dark,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  articleSidebar: {
    flexShrink: 0,
  },

  sidebarCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    width: '100%',
  },

  sidebarIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  sidebarIconText: {
    fontFamily: FONT.regular,
    color: C.primary,
    fontSize: 22,
    fontWeight: '800',
  },

  sidebarTitle: {
    fontFamily: FONT.regular,
    color: C.dark,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },

  sidebarDescription: {
    fontFamily: FONT.regular,
    color: C.muted,
    fontSize: 12,
    lineHeight: 22,
  },

  sidebarDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 20,
  },

  sidebarInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 13,
  },

  infoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.primary,
  },

  sidebarInfoText: {
    flex: 1,
    fontFamily: FONT.regular,
    color: C.text,
    fontSize: 11,
    lineHeight: 18,
  },

  sidebarButton: {
    backgroundColor: C.primaryDark,
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  sidebarButtonText: {
    fontFamily: FONT.regular,
    color: C.white,
    fontSize: 11,
    fontWeight: '700',
  },

  // Bottom call to action
  ctaCard: {
    backgroundColor: C.primaryDark,
    borderRadius: 18,
    padding: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    overflow: 'hidden',
  },

  ctaTextContainer: {
    flex: 1,
    minWidth: 220,
  },

  ctaEyebrow: {
    fontFamily: FONT.regular,
    color: '#D6F1F0',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  ctaTitle: {
    fontFamily: FONT.regular,
    color: C.white,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 10,
  },

  ctaDescription: {
    fontFamily: FONT.regular,
    color: '#E2F2F2',
    fontSize: 12,
    lineHeight: 22,
    maxWidth: 520,
  },

  ctaButton: {
    backgroundColor: C.white,
    borderRadius: 9,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  ctaButtonText: {
    fontFamily: FONT.regular,
    color: C.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
});
