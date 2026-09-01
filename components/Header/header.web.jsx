import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useEffect, useRef, useState, useCallback } from 'react';

import { useAuth } from '@/context/AuthContext';
import API from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

// ============================================================================
// COLORS
// ============================================================================

const C = {
  primary: '#09BBAF',
  primaryDark: '#09BBAF',
  primaryLight: '#ccfbf1',
  white: '#ffffff',
  bg: '#f8fafc',
  bgSoft: '#f1f5f9',
  dark: '#0f172a',
  dark2: '#1e293b',
  muted: '#64748b',
  mutedLight: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  hover: '#f0fdfa',
  accent: '#f59e0b',
  accentLight: '#fef3c7',
};

// ============================================================================
// CATEGORY ICONS
// ============================================================================

const ICON_MAP = {
  endodontics: 'medical-outline',
  equipments: 'hardware-chip-outline',
  equipment: 'hardware-chip-outline',
  instruments: 'build-outline',
  materials: 'flask-outline',
  consumables: 'medical-outline',
  hygiene: 'shield-checkmark-outline',
  orthodontics: 'git-branch-outline',
  prosthodontics: 'layers-outline',
  periodontics: 'fitness-outline',
  'oral surgery': 'cut-outline',
  implants: 'construct-outline',
  'general dentistry': 'medkit-outline',
  'clinical problem solvers': 'school-outline',
  'dental brands': 'briefcase-outline',
  pharmacy: 'medkit-outline',
  'offer zone': 'pricetag-outline',
  'student section': 'school-outline',
  restorative: 'medical-outline',
};

const getCategoryIcon = (name = '') => {
  const key = name.trim().toLowerCase();

  return ICON_MAP[key] || 'grid-outline';
};

// ============================================================================
// DEBOUNCE
// ============================================================================

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ============================================================================
// SEARCH DROPDOWN
// ============================================================================

function SearchDropdown({ results, loading, query, onSelect, onClose, onViewAll }) {
  if (!query.trim()) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,

        marginTop: 8,

        backgroundColor: C.white,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: C.border,

        maxHeight: 430,

        overflow: 'hidden',

        zIndex: 999999,

        boxShadow: '0 14px 45px rgba(15,23,42,0.16)',
      }}>
      {/* HEADER */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',

          paddingHorizontal: 16,
          paddingVertical: 12,

          borderBottomWidth: 1,
          borderBottomColor: C.borderLight,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: C.muted,
          }}>
          {loading
            ? 'Searching...'
            : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
        </Text>

        <Pressable onPress={onClose}>
          <Ionicons name="close" size={17} color={C.muted} />
        </Pressable>
      </View>

      {/* LOADING */}

      {loading && (
        <View
          style={{
            paddingVertical: 35,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
          <ActivityIndicator size="small" color={C.primary} />

          <Text
            style={{
              fontSize: 13,
              color: C.muted,
            }}>
            Looking for products...
          </Text>
        </View>
      )}

      {/* NO RESULTS */}

      {!loading && results.length === 0 && (
        <View
          style={{
            paddingVertical: 35,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}>
          <Ionicons name="search-outline" size={32} color={C.border} />

          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: C.dark,
            }}>
            No products found
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: C.muted,
            }}>
            Try different keywords
          </Text>
        </View>
      )}

      {/* RESULTS */}

      {!loading && results.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {results.map((item, index) => (
            <Pressable
              key={item._id}
              onPress={() => onSelect(item)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',

                gap: 12,

                paddingHorizontal: 14,
                paddingVertical: 10,

                backgroundColor: pressed ? C.primaryLight : C.white,

                borderBottomWidth: index < results.length - 1 ? 1 : 0,

                borderBottomColor: C.borderLight,
              })}>
              {/* IMAGE */}

              <View
                style={{
                  width: 52,
                  height: 52,

                  borderRadius: 10,

                  backgroundColor: C.bg,

                  overflow: 'hidden',

                  borderWidth: 1,
                  borderColor: C.border,
                }}>
                <Image
                  source={{
                    uri: item.thumbnail_url,
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="contain"
                />
              </View>

              {/* INFO */}

              <View
                style={{
                  flex: 1,
                  gap: 3,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: C.dark,
                  }}>
                  {item.name}
                </Text>

                {item.short_description && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 11,
                      color: C.muted,
                    }}>
                    {item.short_description}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: C.muted,
                    }}>
                    ₹
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '800',
                      color: C.primary,
                    }}>
                    {item.price?.regularPrice}
                  </Text>

                  {item.manufacturer && (
                    <Text
                      style={{
                        fontSize: 11,
                        color: C.muted,
                        marginLeft: 5,
                      }}>
                      · {item.manufacturer}
                    </Text>
                  )}
                </View>
              </View>

              {/* ARROW */}

              <View
                style={{
                  width: 30,
                  height: 30,

                  borderRadius: 9,

                  backgroundColor: C.primaryLight,

                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="arrow-forward" size={14} color={C.primary} />
              </View>
            </Pressable>
          ))}

          {/* VIEW ALL */}

          <Pressable
            onPress={onViewAll}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',

              gap: 6,

              paddingVertical: 13,

              backgroundColor: C.primaryLight,
            }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: C.primary,
              }}>
              View all results for "{query}"
            </Text>

            <Ionicons name="arrow-forward" size={14} color={C.primary} />
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

// ============================================================================
// CATEGORY MEGA MENU
// ============================================================================

function CategoryMegaMenu({
  categories,
  activeMainCategory,
  setActiveMainCategory,
  activeChildCategory,
  setActiveChildCategory,
  onCategoryPress,
  onClose,
  isMobile,
  menuTop,
}) {
  const activeMain = categories.find((cat) => cat._id === activeMainCategory);

  const children = activeMain?.children || [];

  if (!categories?.length) return null;

  return (
    <View
      style={{
        // Desktop keeps the existing fixed mega-menu.
        // Mobile renders it inside the hamburger menu so child categories
        // can expand/click normally.
        position: isMobile ? 'relative' : 'fixed',

        top: isMobile ? undefined : menuTop,

        left: isMobile ? undefined : '50%',

        transform: isMobile
          ? undefined
          : [
              {
                translateX: '-50%',
              },
            ],

        width: isMobile ? '100%' : 'calc(100vw - 48px)',

        maxWidth: 1500,

        backgroundColor: C.white,

        borderRadius: 18,

        borderWidth: 1,
        borderColor: C.border,

        overflow: 'hidden',

        zIndex: 9999999,

        boxShadow: '0 24px 70px rgba(15,23,42,0.22)',
      }}>
      {/* ================================================================
          HEADER
      ================================================================= */}

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',

          justifyContent: 'space-between',

          paddingHorizontal: isMobile ? 16 : 28,

          paddingVertical: 15,

          borderBottomWidth: 1,

          borderBottomColor: C.borderLight,

          backgroundColor: C.white,
        }}>
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',

            gap: 10,
          }}>
          <View
            style={{
              width: 42,
              height: 42,

              borderRadius: 12,

              backgroundColor: C.primaryLight,

              alignItems: 'center',

              justifyContent: 'center',
            }}>
            <Ionicons name="grid-outline" size={21} color={C.primary} />
          </View>

          <View>
            <Text
              style={{
                fontSize: 17,

                fontWeight: '800',

                color: C.dark,
              }}>
              Shop by Category
            </Text>

            <Text
              style={{
                fontSize: 11,

                color: C.muted,

                marginTop: 2,
              }}>
              Explore dental products
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onClose}
          style={{
            width: 36,
            height: 36,

            borderRadius: 10,

            backgroundColor: C.bg,

            alignItems: 'center',

            justifyContent: 'center',
          }}>
          <Ionicons name="close" size={19} color={C.muted} />
        </Pressable>
      </View>

      {/* ================================================================
          CONTENT
      ================================================================= */}

      <View
        style={{
          flexDirection: isMobile ? 'column' : 'row',

          height: isMobile ? 620 : 500,

          maxHeight: isMobile ? 620 : 500,
        }}>
        {/* ==============================================================
            LEFT CATEGORIES
        =============================================================== */}

        <View
          style={{
            width: isMobile ? '100%' : 285,

            backgroundColor: '#f5f9fc',

            borderRightWidth: isMobile ? 0 : 1,

            borderRightColor: C.border,

            borderBottomWidth: isMobile ? 1 : 0,

            borderBottomColor: C.border,
          }}>
          <View
            style={{
              paddingHorizontal: 20,

              paddingTop: 18,

              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 11,

                fontWeight: '800',

                color: C.muted,

                letterSpacing: 0.7,
              }}>
              CATEGORY
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{
              paddingHorizontal: 10,

              paddingBottom: 20,
            }}>
            {categories.map((cat) => {
              const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;

              const active = activeMainCategory === cat._id;

              return (
                <Pressable
                  key={cat._id}
                  onPress={() => {
                    if (hasChildren) {
                      setActiveMainCategory(cat._id);

                      setActiveChildCategory(null);
                    } else {
                      onCategoryPress(cat);
                    }
                  }}
                  onHoverIn={() => {
                    if (!isMobile && hasChildren) {
                      setActiveMainCategory(cat._id);

                      setActiveChildCategory(null);
                    }
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',

                    alignItems: 'center',

                    paddingHorizontal: 12,

                    paddingVertical: 10,

                    marginVertical: 3,

                    borderRadius: 12,

                    backgroundColor: active || pressed ? '#dcecff' : 'transparent',

                    cursor: 'pointer',
                  })}>
                  <View
                    style={{
                      width: 36,
                      height: 36,

                      borderRadius: 10,

                      backgroundColor: C.white,

                      alignItems: 'center',

                      justifyContent: 'center',

                      marginRight: 10,
                    }}>
                    <Ionicons
                      name={getCategoryIcon(cat.name)}
                      size={17}
                      color={active ? C.primary : C.muted}
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,

                      fontSize: 14,

                      fontWeight: active ? '800' : '600',

                      color: active ? C.dark : '#53657a',
                    }}>
                    {cat.name?.trim()}
                  </Text>

                  {hasChildren && (
                    <Ionicons
                      name="chevron-forward"
                      size={15}
                      color={active ? C.dark : C.mutedLight}
                    />
                  )}
                </Pressable>
              );
            })}

            <Pressable
              onPress={() =>
                onCategoryPress({
                  name: 'All',
                })
              }
              style={{
                flexDirection: 'row',

                alignItems: 'center',

                gap: 8,

                paddingHorizontal: 12,

                paddingVertical: 12,

                marginTop: 6,
              }}>
              <Ionicons name="apps-outline" size={17} color={C.primary} />

              <Text
                style={{
                  fontSize: 13,

                  fontWeight: '700',

                  color: C.primary,
                }}>
                View All Categories
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ==============================================================
            RIGHT SIDE
        =============================================================== */}

        <View
          style={{
            flex: 1,

            paddingHorizontal: isMobile ? 16 : 30,

            paddingVertical: 22,

            backgroundColor: C.white,
          }}>
          {!activeMain ? (
            <View
              style={{
                flex: 1,

                alignItems: 'center',

                justifyContent: 'center',
              }}>
              <Ionicons name="grid-outline" size={45} color={C.border} />

              <Text
                style={{
                  marginTop: 10,

                  fontSize: 14,

                  color: C.muted,
                }}>
                Select a category
              </Text>
            </View>
          ) : (
            <>
              {/* TITLE */}

              <View
                style={{
                  flexDirection: 'row',

                  alignItems: 'center',

                  justifyContent: 'space-between',

                  marginBottom: 18,
                }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center',

                      gap: 9,
                    }}>
                    <Text
                      style={{
                        fontSize: 19,

                        fontWeight: '800',

                        color: C.dark,
                      }}>
                      {activeMain.name?.trim()}
                    </Text>

                    <View
                      style={{
                        paddingHorizontal: 9,

                        paddingVertical: 4,

                        borderRadius: 7,

                        backgroundColor: C.bgSoft,
                      }}>
                      <Text
                        style={{
                          fontSize: 10,

                          fontWeight: '800',

                          color: C.dark2,
                        }}>
                        {children.length} Categories
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 11,

                      color: C.muted,

                      marginTop: 4,
                    }}>
                    Browse products by category
                  </Text>
                </View>

                <Pressable
                  onPress={() => onCategoryPress(activeMain)}
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',

                    gap: 5,

                    paddingHorizontal: 11,

                    paddingVertical: 7,

                    borderRadius: 8,

                    backgroundColor: C.primaryLight,
                  }}>
                  <Text
                    style={{
                      fontSize: 11,

                      fontWeight: '700',

                      color: C.primary,
                    }}>
                    View All
                  </Text>

                  <Ionicons name="arrow-forward" size={12} color={C.primary} />
                </Pressable>
              </View>

              {/* CHILDREN */}

              {children.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',

                      flexWrap: 'wrap',

                      marginHorizontal: -7,
                    }}>
                    {children.map((child) => {
                      const hasChildren =
                        Array.isArray(child.children) && child.children.length > 0;

                      const activeChild = activeChildCategory === child._id;

                      return (
                        <View
                          key={child._id}
                          style={{
                            width: isMobile ? '100%' : '33.3333%',

                            paddingHorizontal: 7,

                            marginBottom: 12,
                          }}>
                          <Pressable
                            onPress={() => {
                              if (hasChildren) {
                                setActiveChildCategory(activeChild ? null : child._id);
                              } else {
                                onCategoryPress(child);
                              }
                            }}
                            onHoverIn={() => {
                              if (!isMobile && hasChildren) {
                                setActiveChildCategory(child._id);
                              }
                            }}
                            style={({ pressed }) => ({
                              minHeight: 64,

                              padding: 11,

                              borderRadius: 11,

                              borderWidth: 1,

                              borderColor: activeChild || pressed ? '#99f6e4' : C.border,

                              backgroundColor: activeChild || pressed ? C.hover : C.white,

                              cursor: 'pointer',

                              transition: 'all 0.15s ease',
                            })}>
                            <View
                              style={{
                                flexDirection: 'row',

                                alignItems: 'center',

                                gap: 9,
                              }}>
                              <View
                                style={{
                                  width: 31,
                                  height: 31,

                                  borderRadius: 8,

                                  backgroundColor: activeChild ? C.primaryLight : C.bg,

                                  alignItems: 'center',

                                  justifyContent: 'center',
                                }}>
                                <Ionicons
                                  name={getCategoryIcon(child.name)}
                                  size={14}
                                  color={activeChild ? C.primary : C.muted}
                                />
                              </View>

                              <View
                                style={{
                                  flex: 1,
                                }}>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontSize: 12,

                                    lineHeight: 17,

                                    fontWeight: '700',

                                    color: C.dark,
                                  }}>
                                  {child.name?.trim()}
                                </Text>

                                {hasChildren && (
                                  <Text
                                    style={{
                                      fontSize: 9,

                                      color: C.muted,

                                      marginTop: 2,
                                    }}>
                                    {child.children.length} sub-categories
                                  </Text>
                                )}
                              </View>

                              {hasChildren && (
                                <Ionicons
                                  name={activeChild ? 'chevron-down' : 'chevron-forward'}
                                  size={13}
                                  color={activeChild ? C.primary : C.mutedLight}
                                />
                              )}
                            </View>
                          </Pressable>

                          {/* GRAND CHILDREN */}

                          {activeChild && hasChildren && (
                            <View
                              style={{
                                marginTop: 6,

                                padding: 8,

                                borderRadius: 9,

                                backgroundColor: '#f8fafc',

                                borderWidth: 1,

                                borderColor: C.border,
                              }}>
                              {child.children.map((grandChild) => (
                                <Pressable
                                  key={grandChild._id}
                                  onPress={() => onCategoryPress(grandChild)}
                                  style={({ pressed }) => ({
                                    flexDirection: 'row',

                                    alignItems: 'center',

                                    paddingVertical: 7,

                                    paddingHorizontal: 5,

                                    borderRadius: 6,

                                    backgroundColor: pressed ? C.primaryLight : 'transparent',

                                    cursor: 'pointer',
                                  })}>
                                  <View
                                    style={{
                                      width: 5,
                                      height: 5,

                                      borderRadius: 5,

                                      backgroundColor: C.primary,

                                      marginRight: 8,
                                    }}
                                  />

                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      flex: 1,

                                      fontSize: 11,

                                      color: C.dark2,
                                    }}>
                                    {grandChild.name?.trim()}
                                  </Text>

                                  <Ionicons name="arrow-forward" size={10} color={C.mutedLight} />
                                </Pressable>
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,

                    alignItems: 'center',

                    justifyContent: 'center',
                  }}>
                  <Ionicons name="cube-outline" size={45} color={C.border} />

                  <Text
                    style={{
                      marginTop: 10,

                      fontSize: 13,

                      color: C.muted,
                    }}>
                    No sub-categories available
                  </Text>

                  <Pressable
                    onPress={() => onCategoryPress(activeMain)}
                    style={{
                      marginTop: 14,

                      backgroundColor: C.primary,

                      paddingHorizontal: 16,

                      paddingVertical: 9,

                      borderRadius: 9,
                    }}>
                    <Text
                      style={{
                        color: C.white,

                        fontSize: 12,

                        fontWeight: '700',
                      }}>
                      Browse Products
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// MAIN HEADER
// ============================================================================

export default function WebHeader() {
  if (Platform.OS !== 'web') {
    return null;
  }
  const router = useRouter();

  const { user } = useAuth();

  const { width } = useWindowDimensions();

  const { category } = useLocalSearchParams();

  // ==========================================================================
  // RESPONSIVE
  // ==========================================================================

  const isMobile = width < 768;

  const isTablet = width >= 768 && width < 1024;

  const isDesktop = width >= 1024;

  const px = isMobile ? 16 : isTablet ? 24 : 40;

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  const [search, setSearch] = useState('');

  const [searchFocused, setSearchFocused] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);

  // ==========================================================================
  // CATEGORY
  // ==========================================================================

  const [categories, setCategories] = useState([]);

  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const [activeMainCategory, setActiveMainCategory] = useState(null);

  const [activeChildCategory, setActiveChildCategory] = useState(null);

  const [categoryMenuTop, setCategoryMenuTop] = useState(0);

  // Mobile hamburger menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [cartCount] = useState(0);

  // ==========================================================================
  // REFS
  // ==========================================================================

  const searchRef = useRef(null);

  const searchDropdownRef = useRef(null);

  const categoryMenuRef = useRef(null);

  const updateCategoryMenuPosition = () => {
    if (Platform.OS !== 'web' || !categoryMenuRef.current) {
      return;
    }

    const element = categoryMenuRef.current;

    if (typeof element.getBoundingClientRect === 'function') {
      const rect = element.getBoundingClientRect();

      setCategoryMenuTop(rect.bottom + 8);
    }
  };
  // ==========================================================================
  // DEBOUNCE
  // ==========================================================================

  const debouncedSearch = useDebounce(search, 350);

  // ==========================================================================
  // FETCH CATEGORY
  // ==========================================================================

  async function fetchCategory() {
    try {
      const { data } = await API.get('/category');

      const result = data?.data || data?.categories || data || [];

      const finalData = Array.isArray(result) ? result : [];

      setCategories(finalData);

      return finalData;
    } catch (error) {
      console.error('Category API error:', error);

      setCategories([]);

      return [];
    }
  }

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategory,
  });

  // ==========================================================================
  // CATEGORY DATA SYNC
  // ==========================================================================

  useEffect(() => {
    if (Array.isArray(categoriesData)) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // ==========================================================================
  // URL CATEGORY
  // ==========================================================================

  useEffect(() => {
    if (!category || !categories.length) {
      return;
    }

    const current = categories.find((cat) => cat.name === category || cat.url_path === category);

    if (current) {
      setActiveMainCategory(current._id);
    }
  }, [category, categories]);

  // ==========================================================================
  // SEARCH API
  // ==========================================================================

  useEffect(() => {
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
      setSearchResults([]);

      setSearchLoading(false);

      return;
    }

    setSearchLoading(true);

    API.get('/product', {
      params: {
        search: debouncedSearch,

        limit: 8,

        page: 1,
      },
    })
      .then(({ data }) => {
        setSearchResults(data?.data || []);
      })
      .catch((error) => {
        console.error('Search error:', error);

        setSearchResults([]);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  }, [debouncedSearch]);

  // ==========================================================================
  // OUTSIDE CLICK
  // ==========================================================================

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const handler = (event) => {
      const target = event.target;

      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(target)
      ) {
        setSearchFocused(false);
      }

      if (categoryMenuRef.current && !categoryMenuRef.current.contains(target)) {
        setCategoryMenuOpen(false);

        setActiveChildCategory(null);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  // ==========================================================================
  // PRODUCT CLICK
  // ==========================================================================

  const handleSelectProduct = useCallback(
    (item) => {
      setSearch('');

      setSearchFocused(false);

      setSearchResults([]);

      router.push(`/product/${item._id}`);
    },
    [router]
  );

  // ==========================================================================
  // SEARCH VIEW ALL
  // ==========================================================================

  const handleViewAllSearch = () => {
    const query = encodeURIComponent(search);

    setSearchFocused(false);

    setSearchResults([]);

    router.push(`/shop?search=${query}`);
  };

  // ==========================================================================
  // CATEGORY NAVIGATION
  // ==========================================================================

  const handleCategoryPress = (cat) => {
    if (!cat) return;

    const name = cat.name?.trim();

    if (!name) return;

    setCategoryMenuOpen(false);

    setActiveMainCategory(null);

    setActiveChildCategory(null);

    if (name.toLowerCase() === 'all') {
      router.push('/shop');

      return;
    }

    // SAME FUNCTIONALITY AS OLD HEADER

    router.push(`/shop?category=${encodeURIComponent(name)}`);
  };

  // ==========================================================================
  // OPEN CATEGORY MENU
  // ==========================================================================

  const openCategoryMenu = () => {
    const next = !categoryMenuOpen;

    if (next) {
      if (!isMobile) {
        updateCategoryMenuPosition();
      }

      setActiveChildCategory(null);

      if (categories.length > 0 && !activeMainCategory) {
        setActiveMainCategory(categories[0]._id);
      }
    }

    setCategoryMenuOpen(next);
  };

  const showSearchDropdown = searchFocused && search.trim().length >= 2;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <View
      style={{
        backgroundColor: C.white,

        borderBottomWidth: 1,

        borderBottomColor: C.border,

        position: 'sticky',

        top: 0,

        zIndex: 100,

        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',

        overflow: 'visible',
      }}>
      {/* =====================================================================
          ANNOUNCEMENT
      ====================================================================== */}

      {!isMobile && (
        <View
          style={{
            backgroundColor: C.primaryDark,

            paddingVertical: 7,

            paddingHorizontal: px,

            flexDirection: 'row',

            justifyContent: 'space-between',

            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#ffffff',

              fontSize: 12,

              fontWeight: '600',
            }}>
            🚚 Free shipping on orders above ₹999
          </Text>

          <View
            style={{
              flexDirection: 'row',

              gap: 20,
            }}>
            {['About', 'Contact', 'Track Order'].map((label) => (
              <Pressable
                key={label}
                onPress={() => router.push(`/${label.toLowerCase().replace(' ', '-')}`)}>
                <Text
                  style={{
                    color: '#ffffff',

                    fontSize: 12,
                  }}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* =====================================================================
          MAIN ROW
      ====================================================================== */}

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',

          paddingHorizontal: px,

          paddingVertical: isMobile ? 10 : 14,

          gap: isMobile ? 10 : 16,

          position: 'relative',

          zIndex: 20,

          overflow: 'visible',
        }}>
        {/* LOGO */}

        <Pressable
          onPress={() => router.push('/')}
          style={{
            flexDirection: 'row',

            alignItems: 'center',

            flexShrink: 0,
          }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: isMobile ? 100 : isTablet ? 115 : 130,

              height: isMobile ? 32 : 42,

              resizeMode: 'contain',
            }}
          />
        </Pressable>

        {/* ===================================================================
            MOBILE HAMBURGER
        ==================================================================== */}

        {/* ===================================================================
            DESKTOP NAV
        ==================================================================== */}

        {/* ===================================================================
            SEARCH
        ==================================================================== */}

        <View
          ref={searchRef}
          style={{
            flex: 1,

            position: 'relative',

            zIndex: 9999,
          }}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              backgroundColor: searchFocused ? C.white : C.bg,

              borderRadius: 13,

              borderWidth: 1.5,

              borderColor: searchFocused ? C.primary : C.border,

              paddingHorizontal: 12,

              paddingVertical: isMobile ? 9 : 10,

              gap: 8,

              boxShadow: searchFocused ? '0 0 0 3px rgba(15,118,110,0.12)' : 'none',
            }}>
            <Ionicons
              name={searchLoading ? 'sync-outline' : 'search-outline'}
              size={17}
              color={searchFocused ? C.primary : C.muted}
            />

            <TextInput
              placeholder={
                isMobile ? 'Search products...' : 'Search dental products, brands, SKUs...'
              }
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setSearchFocused(true)}
              style={{
                flex: 1,

                fontSize: 14,

                color: C.dark,

                outlineStyle: 'none',

                width: '100%',
              }}
            />

            {search.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearch('');

                  setSearchResults([]);
                }}>
                <Ionicons name="close-circle" size={17} color={C.muted} />
              </Pressable>
            )}
          </View>

          {showSearchDropdown && (
            <View ref={searchDropdownRef}>
              <SearchDropdown
                results={searchResults}
                loading={searchLoading}
                query={search}
                onSelect={handleSelectProduct}
                onClose={() => {
                  setSearchFocused(false);

                  setSearch('');

                  setSearchResults([]);
                }}
                onViewAll={handleViewAllSearch}
              />
            </View>
          )}
        </View>

        {/* ===================================================================
            RIGHT ACTIONS
        ==================================================================== */}

        <View
          style={{
            flexDirection: 'row',

            gap: 8,

            alignItems: 'center',
          }}>
          {/* COINS */}

          {isDesktop && (
            <Pressable
              style={{
                flexDirection: 'row',

                alignItems: 'center',

                gap: 5,

                backgroundColor: C.accentLight,

                borderRadius: 10,

                paddingHorizontal: 10,

                paddingVertical: 11,
              }}>
              <Ionicons name="logo-bitcoin" size={15} color={C.accent} />

              <Text
                style={{
                  fontSize: 13,

                  fontWeight: '700',

                  color: '#92400e',
                }}>
                {user?.medishieldcoins ?? 0}
              </Text>
            </Pressable>
          )}

          {/* WISHLIST */}

          {isDesktop && (
            <Pressable
              onPress={() => router.push('/wishlist')}
              style={{
                width: 40,
                height: 40,

                borderRadius: 12,

                backgroundColor: C.bg,

                alignItems: 'center',

                justifyContent: 'center',

                borderWidth: 1,

                borderColor: C.border,
              }}>
              <Ionicons name="heart-outline" size={20} color={C.dark} />
            </Pressable>
          )}

          {/* CART */}

          <Pressable
            onPress={() => router.push('/cart')}
            style={{
              width: isMobile ? 36 : 40,

              height: isMobile ? 36 : 40,

              borderRadius: 12,

              backgroundColor: C.primary,

              alignItems: 'center',

              justifyContent: 'center',

              position: 'relative',
            }}>
            <Ionicons name="bag-outline" size={isMobile ? 17 : 20} color="white" />

            {cartCount > 0 && (
              <View
                style={{
                  position: 'absolute',

                  top: -4,

                  right: -4,

                  backgroundColor: C.accent,

                  borderRadius: 10,

                  width: 17,
                  height: 17,

                  alignItems: 'center',

                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',

                    fontSize: 9,

                    fontWeight: '800',
                  }}>
                  {cartCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* ACCOUNT */}

          {user ? (
            <Pressable
              onPress={() => router.push('/profile')}
              style={{
                width: isMobile ? 36 : 40,

                height: isMobile ? 36 : 40,

                borderRadius: 12,

                backgroundColor: C.primaryLight,

                alignItems: 'center',

                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 13,

                  fontWeight: '800',

                  color: C.primary,
                }}>
                {((user.firstname?.[0] || '') + (user.lastname?.[0] || '')).toUpperCase() || '?'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/auth/login')}
              style={{
                backgroundColor: C.primary,

                borderRadius: 12,

                paddingHorizontal: isMobile ? 12 : 16,

                paddingVertical: isMobile ? 12 : 11,

                flexDirection: 'row',

                alignItems: 'center',

                gap: 5,
              }}>
              {!isMobile && <Ionicons name="person-outline" size={14} color="white" />}

              <Text
                style={{
                  color: 'white',

                  fontSize: isMobile ? 12 : 13,

                  fontWeight: '700',
                }}>
                {isMobile ? 'Login' : 'Sign In'}
              </Text>
            </Pressable>
          )}
          {isMobile && (
            <Pressable
              onPress={() => {
                setMobileMenuOpen((prev) => !prev);

                // Close the category mega menu when the whole mobile menu
                // is toggled closed/open.
                setCategoryMenuOpen(false);
                setActiveChildCategory(null);
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: mobileMenuOpen ? C.primaryLight : C.bg,
                borderWidth: 1,
                borderColor: mobileMenuOpen ? '#99f6e4' : C.border,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              accessibilityRole="button"
              accessibilityLabel={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              <Ionicons
                name={mobileMenuOpen ? 'close' : 'menu'}
                size={21}
                color={mobileMenuOpen ? C.primary : C.primary}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* =====================================================================
          MOBILE HAMBURGER LINKS
          Desktop navigation below remains unchanged.
      ====================================================================== */}

      {isMobile && mobileMenuOpen && (
        <View
          style={{
            marginHorizontal: px,
            marginBottom: 10,
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 14,
            overflow: 'hidden',
            zIndex: 999999,
            boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
          }}>
          {[
            {
              label: 'Home',
              icon: 'home-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/');
              },
            },
            {
              label: 'Products',
              icon: 'cube-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/shop');
              },
            },
            {
              label: 'Offers',
              icon: 'pricetag-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/offers');
              },
            },
            {
              label: 'New Arrivals',
              icon: 'sparkles-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/new-arrivals');
              },
            },
            {
              label: 'Brands',
              icon: 'storefront-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/brands');
              },
            },
            {
              label: 'Wishlist',
              icon: 'heart-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/wishlist');
              },
            },
            {
              label: 'Contact',
              icon: 'call-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/contact');
              },
            },
            {
              label: 'About',
              icon: 'information-circle-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/about');
              },
            },
            {
              label: 'Track Order',
              icon: 'locate-outline',
              onPress: () => {
                setMobileMenuOpen(false);
                setCategoryMenuOpen(false);
                router.push('/track-order');
              },
            },
          ].map((item, index, items) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 12,
                backgroundColor: pressed ? C.bg : C.white,
                borderBottomWidth: index < items.length - 1 ? 1 : 0,
                borderBottomColor: C.borderLight,
              })}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  backgroundColor: C.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 11,
                }}>
                <Ionicons name={item.icon} size={17} color={C.primary} />
              </View>

              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: '700',
                  color: C.dark,
                }}>
                {item.label}
              </Text>

              <Ionicons name="chevron-forward" size={14} color={C.mutedLight} />
            </Pressable>
          ))}

          {/* MOBILE CATEGORY */}
          <Pressable
            onPress={() => {
              if (!categoryMenuOpen) {
                if (categories.length > 0 && !activeMainCategory) {
                  setActiveMainCategory(categories[0]._id);
                }
                setActiveChildCategory(null);
              } else {
                setActiveChildCategory(null);
              }

              setCategoryMenuOpen((prev) => !prev);
            }}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: pressed || categoryMenuOpen ? C.primaryLight : C.white,
              borderTopWidth: 1,
              borderTopColor: C.borderLight,
            })}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                backgroundColor: categoryMenuOpen ? C.white : C.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 11,
              }}>
              <Ionicons name="grid-outline" size={17} color={C.primary} />
            </View>

            <Text
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: '700',
                color: C.dark,
              }}>
              Categories
            </Text>

            <Ionicons
              name={categoryMenuOpen ? 'chevron-up' : 'chevron-down'}
              size={15}
              color={C.muted}
            />
          </Pressable>

          {categoryMenuOpen && (
            <View
              style={{
                padding: 8,
                backgroundColor: C.bg,
                borderTopWidth: 1,
                borderTopColor: C.borderLight,
              }}>
              <CategoryMegaMenu
                categories={categories}
                activeMainCategory={activeMainCategory}
                setActiveMainCategory={setActiveMainCategory}
                activeChildCategory={activeChildCategory}
                setActiveChildCategory={setActiveChildCategory}
                onCategoryPress={(cat) => {
                  handleCategoryPress(cat);
                  setMobileMenuOpen(false);
                }}
                onClose={() => {
                  setCategoryMenuOpen(false);
                  setActiveChildCategory(null);
                }}
                isMobile={true}
              />
            </View>
          )}
        </View>
      )}

      {isDesktop && (
        <View
          style={{
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            borderTopWidth: 1,
            borderTopColor: C.borderLight,
            backgroundColor: C.white,
            position: 'relative',
            zIndex: 9,
          }}>
          {/* HOME */}

          <Pressable
            onPress={() => router.push('/')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,

              paddingVertical: 9,

              borderRadius: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,

              backgroundColor: pressed ? C.bg : 'transparent',

              cursor: 'pointer',
            })}>
            <Ionicons name="home-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,

                fontWeight: '600',

                color: C.dark,
              }}>
              Home
            </Text>
          </Pressable>

          {/* CATEGORY */}

          <View
            ref={categoryMenuRef}
            style={{
              position: 'relative',
              zIndex: 999999,
            }}>
            <Pressable
              onPress={openCategoryMenu}
              onHoverIn={() => {
                setCategoryMenuOpen(true);
                updateCategoryMenuPosition();

                if (categories.length > 0 && !activeMainCategory) {
                  setActiveMainCategory(categories[0]._id);
                }
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingHorizontal: 16,
                paddingVertical: 9,
                borderRadius: 9,
                backgroundColor: categoryMenuOpen || pressed ? C.primaryLight : 'transparent',
                cursor: 'pointer',
              })}>
              <Ionicons
                name="grid-outline"
                size={16}
                color={categoryMenuOpen ? C.primary : C.dark}
              />

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: categoryMenuOpen ? C.primary : C.dark,
                }}>
                Categories
              </Text>

              <Ionicons
                name={categoryMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={13}
                color={categoryMenuOpen ? C.primary : C.muted}
              />
            </Pressable>

            {categoryMenuOpen && (
              <CategoryMegaMenu
                categories={categories}
                activeMainCategory={activeMainCategory}
                setActiveMainCategory={setActiveMainCategory}
                activeChildCategory={activeChildCategory}
                setActiveChildCategory={setActiveChildCategory}
                onCategoryPress={handleCategoryPress}
                onClose={() => setCategoryMenuOpen(false)}
                isMobile={false}
                menuTop={categoryMenuTop}
              />
            )}
          </View>

          {/* PRODUCTS */}

          <Pressable
            onPress={() => router.push('/shop')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              backgroundColor: pressed ? C.bg : 'transparent',
              cursor: 'pointer',
            })}>
            <Ionicons name="cube-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.dark,
              }}>
              Products
            </Text>
          </Pressable>

          {/* OFFERS */}

          <Pressable
            onPress={() => router.push('/offers')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              borderRadius: 9,
              backgroundColor: pressed ? C.bg : 'transparent',
              cursor: 'pointer',
            })}>
            <Ionicons name="pricetag-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.dark,
              }}>
              Offers
            </Text>
          </Pressable>

          {/* EXTRA LINKS */}

          <Pressable
            onPress={() => router.push('/new-arrivals')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              backgroundColor: pressed ? C.bg : 'transparent',
              cursor: 'pointer',
            })}>
            <Ionicons name="sparkles-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.dark,
              }}>
              New Arrivals
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/brands')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,

              paddingVertical: 9,

              borderRadius: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              backgroundColor: pressed ? C.bg : 'transparent',

              cursor: 'pointer',
            })}>
            <Ionicons name="storefront-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,

                fontWeight: '600',

                color: C.dark,
              }}>
              Brands
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/contact')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              borderRadius: 9,
              backgroundColor: pressed ? C.bg : 'transparent',
              cursor: 'pointer',
            })}>
            <Ionicons name="call-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.dark,
              }}>
              Contact
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/contact')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              borderRadius: 9,
              backgroundColor: pressed ? C.bg : 'transparent',
              cursor: 'pointer',
            })}>
            <Ionicons name="calendar-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.dark,
              }}>
              Events
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/contact')}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 9,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              borderRadius: 9,
              backgroundColor: pressed ? C.bg : 'transparent',
              cursor: 'pointer',
            })}>
            <Ionicons name="business-outline" size={16} color={C.dark} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: C.dark,
              }}>
              New Clinic Setup
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
