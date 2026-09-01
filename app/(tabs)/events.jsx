import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useBreakpoint from '@/utils/breakpoints';
import C from '@/utils/theme';

// ============================================================
// STATIC EVENTS DATA
// ============================================================

const EVENTS = [
  {
    id: '1',
    title: 'Advanced Endodontics Masterclass',
    shortTitle: 'Endodontics Masterclass',
    category: 'Workshop',
    type: 'LIVE',
    date: '12',
    month: 'SEP',
    fullDate: '12 September 2026',
    day: 'Saturday',
    time: '10:00 AM – 2:00 PM',
    location: 'New Delhi • India',
    mode: 'Offline',
    speaker: 'Dr. Ankit Sharma',
    designation: 'Endodontist & Clinical Educator',
    description:
      'A hands-on learning experience covering modern endodontic techniques, instrumentation, clinical decision making and practical workflow.',
    seats: 'Limited seats',
    color: '#09BBAF',
  },

  {
    id: '2',
    title: 'Modern Dental Materials: What Every Dentist Should Know',
    shortTitle: 'Dental Materials',
    category: 'Webinar',
    type: 'ONLINE',
    date: '18',
    month: 'SEP',
    fullDate: '18 September 2026',
    day: 'Friday',
    time: '6:00 PM – 7:30 PM',
    location: 'Online Event',
    mode: 'Online',
    speaker: 'Dr. Riya Mehta',
    designation: 'Clinical Consultant',
    description:
      'Explore the latest dental materials, their clinical applications and how to select the right material for different procedures.',
    seats: 'Open registration',
    color: '#09BBAF',
  },

  {
    id: '3',
    title: 'Dental Photography for Better Clinical Documentation',
    shortTitle: 'Dental Photography',
    category: 'Workshop',
    type: 'LIVE',
    date: '26',
    month: 'SEP',
    fullDate: '26 September 2026',
    day: 'Saturday',
    time: '11:00 AM – 3:00 PM',
    location: 'Mumbai • India',
    mode: 'Offline',
    speaker: 'Dr. Karan Malhotra',
    designation: 'Cosmetic & Restorative Dentist',
    description:
      'Learn practical dental photography techniques to improve clinical documentation, patient communication and case presentation.',
    seats: '24 seats available',
    color: '#09BBAF',
  },

  {
    id: '4',
    title: 'Digital Dentistry & The Future of Dental Practice',
    shortTitle: 'Digital Dentistry',
    category: 'Conference',
    type: 'HYBRID',
    date: '04',
    month: 'OCT',
    fullDate: '04 October 2026',
    day: 'Sunday',
    time: '9:30 AM – 5:00 PM',
    location: 'Bengaluru • India',
    mode: 'Hybrid',
    speaker: 'Multiple Speakers',
    designation: 'Industry Experts',
    description:
      'A full-day event exploring digital workflows, modern technologies and the future of technology-driven dental practices.',
    seats: 'Early bird available',
    color: '#09BBAF',
  },

  {
    id: '5',
    title: 'Clinical Infection Control Essentials',
    shortTitle: 'Infection Control',
    category: 'Seminar',
    type: 'ONLINE',
    date: '10',
    month: 'OCT',
    fullDate: '10 October 2026',
    day: 'Saturday',
    time: '5:00 PM – 6:30 PM',
    location: 'Online Event',
    mode: 'Online',
    speaker: 'Dr. Neha Kapoor',
    designation: 'Dental Healthcare Professional',
    description:
      'Understand practical infection control protocols, sterilization workflows and safety practices for modern dental clinics.',
    seats: 'Open registration',
    color: '#09BBAF',
  },

  {
    id: '6',
    title: 'Restorative Dentistry: From Planning to Practice',
    shortTitle: 'Restorative Dentistry',
    category: 'Webinar',
    type: 'ONLINE',
    date: '17',
    month: 'OCT',
    fullDate: '17 October 2026',
    day: 'Saturday',
    time: '6:30 PM – 8:00 PM',
    location: 'Online Event',
    mode: 'Online',
    speaker: 'Dr. Arjun Verma',
    designation: 'Restorative Dentist',
    description:
      'A practical session focused on treatment planning, restorative workflows and clinical considerations for predictable outcomes.',
    seats: 'Open registration',
    color: '#09BBAF',
  },

  {
    id: '7',
    title: 'Dental Practice Management Summit',
    shortTitle: 'Practice Management',
    category: 'Conference',
    type: 'LIVE',
    date: '24',
    month: 'OCT',
    fullDate: '24 October 2026',
    day: 'Saturday',
    time: '10:00 AM – 4:30 PM',
    location: 'Hyderabad • India',
    mode: 'Offline',
    speaker: 'Industry Leaders',
    designation: 'Dental Practice Experts',
    description:
      'Learn strategies for building efficient dental practices, improving patient experience and managing day-to-day operations.',
    seats: 'Limited seats',
    color: '#09BBAF',
  },

  {
    id: '8',
    title: 'Future of Preventive Dental Care',
    shortTitle: 'Preventive Care',
    category: 'Seminar',
    type: 'ONLINE',
    date: '31',
    month: 'OCT',
    fullDate: '31 October 2026',
    day: 'Saturday',
    time: '5:30 PM – 7:00 PM',
    location: 'Online Event',
    mode: 'Online',
    speaker: 'Dr. Priya Nair',
    designation: 'Preventive Dentistry Specialist',
    description:
      'An informative session on preventive dental care, patient education and modern approaches to maintaining oral health.',
    seats: 'Open registration',
    color: '#09BBAF',
  },
];

// ============================================================
// CATEGORY DATA
// ============================================================

const CATEGORIES = [
  {
    name: 'All',
    icon: 'apps-outline',
  },
  {
    name: 'Workshop',
    icon: 'construct-outline',
  },
  {
    name: 'Webinar',
    icon: 'videocam-outline',
  },
  {
    name: 'Conference',
    icon: 'people-outline',
  },
  {
    name: 'Seminar',
    icon: 'school-outline',
  },
];

// ============================================================
// EVENT CARD
// ============================================================

function EventCard({ event, onPress, isMobile }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: C.white,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: isMobile ? 20 : 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: isMobile ? 15 : 22,
      }}>
      {/* DATE */}

      <View
        style={{
          width: isMobile ? 58 : 70,
          alignItems: 'center',
          flexShrink: 0,
        }}>
        <Text
          style={{
            fontSize: isMobile ? 26 : 32,
            lineHeight: isMobile ? 30 : 36,
            fontWeight: '900',
            color: C.primaryDark,
            letterSpacing: -1,
          }}>
          {event.date}
        </Text>

        <Text
          style={{
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 1.3,
            color: C.primary,
            marginTop: 2,
          }}>
          {event.month}
        </Text>

        <View
          style={{
            width: 1,
            height: 22,
            backgroundColor: '#cbd5e1',
            marginTop: 10,
          }}
        />
      </View>

      {/* CONTENT */}

      <View
        style={{
          flex: 1,
          minWidth: 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 7,
            marginBottom: 7,
          }}>
          <View
            style={{
              backgroundColor: C.primaryLight,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: '900',
                color: C.primary,
                letterSpacing: 0.7,
              }}>
              {event.category.toUpperCase()}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 9,
              fontWeight: '800',
              color: C.muted,
              letterSpacing: 0.8,
            }}>
            {event.type}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: isMobile ? 16 : 19,
            lineHeight: isMobile ? 22 : 25,
            fontWeight: '800',
            color: C.text,
            marginBottom: 7,
          }}>
          {event.title}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            lineHeight: 19,
            color: C.muted,
            marginBottom: 10,
            maxWidth: 650,
          }}>
          {event.description}
        </Text>

        {/* META */}

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <Ionicons name="time-outline" size={14} color={C.primary} />

            <Text
              style={{
                fontSize: 11,
                color: C.textSecondary,
                fontWeight: '600',
              }}>
              {event.time}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <Ionicons
              name={event.mode === 'Online' ? 'globe-outline' : 'location-outline'}
              size={14}
              color={C.primary}
            />

            <Text
              style={{
                fontSize: 11,
                color: C.textSecondary,
                fontWeight: '600',
              }}>
              {event.location}
            </Text>
          </View>
        </View>
      </View>

      {/* ARROW */}

      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
        }}>
        <Ionicons name="arrow-forward" size={15} color={C.primary} />
      </View>
    </Pressable>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function Events() {
  const { isMobile, isTablet, isDesktop, px } = useBreakpoint();

  const [activeCategory, setActiveCategory] = useState('All');

  const [search, setSearch] = useState('');

  const [selectedEvent, setSelectedEvent] = useState(null);

  // ==========================================================
  // FEATURED EVENT
  // ==========================================================

  const featuredEvent = EVENTS[0];

  // ==========================================================
  // FILTER EVENTS
  // ==========================================================

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return EVENTS.filter((event) => {
      const matchesCategory = activeCategory === 'All' || event.category === activeCategory;

      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.speaker.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f8fafc',
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 70,
        }}>
        {/* ====================================================
            HERO
        ===================================================== */}

        <View
          style={{
            backgroundColor: C.primaryDark,
            paddingHorizontal: px,
            paddingTop: isMobile ? 38 : 58,
            paddingBottom: isMobile ? 34 : 48,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth: 1180,
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 13,
              }}>
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: '#ffffff',
                }}
              />

              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: '900',
                  letterSpacing: 1.8,
                }}>
                MEDISHIELD EVENTS
              </Text>
            </View>

            <Text
              style={{
                color: '#fff',

                fontSize: isMobile ? 34 : isTablet ? 42 : 50,

                lineHeight: isMobile ? 41 : isTablet ? 50 : 58,

                fontWeight: '900',

                letterSpacing: -1.5,

                maxWidth: 700,

                marginBottom: 12,
              }}>
              Learn. Connect.
              {'\n'}
              Grow your practice.
            </Text>

            <Text
              style={{
                color: '#a9d4d1',
                fontSize: 14,
                lineHeight: 23,
                maxWidth: 650,
              }}>
              Discover workshops, webinars and dental events designed to keep you ahead of modern
              clinical practice.
            </Text>

            {/* SEARCH */}

            <View
              style={{
                marginTop: 25,
                height: 50,
                maxWidth: 600,
                backgroundColor: '#fff',
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <Ionicons name="search-outline" size={19} color="#64748b" />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search events..."
                placeholderTextColor="#94a3b8"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 13,
                  color: '#0f172a',
                  outlineStyle: 'none',
                }}
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* ====================================================
            FEATURED EVENT
        ===================================================== */}

        <View
          style={{
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',
            paddingHorizontal: px,
            marginTop: isMobile ? 25 : 38,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: isMobile ? 18 : 22,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              flexDirection: isMobile ? 'column' : 'row',
            }}>
            {/* FEATURED INFO */}

            <View
              style={{
                flex: 1,
                padding: isMobile ? 22 : isTablet ? 30 : 38,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: C.primary,
                  paddingHorizontal: 9,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginBottom: 14,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: '900',
                    letterSpacing: 1,
                  }}>
                  FEATURED EVENT
                </Text>
              </View>

              <Text
                style={{
                  color: C.text,
                  fontSize: isMobile ? 25 : isTablet ? 29 : 34,
                  lineHeight: isMobile ? 31 : 40,
                  fontWeight: '900',
                  letterSpacing: -0.8,
                  marginBottom: 11,
                }}>
                {featuredEvent.title}
              </Text>

              <Text
                style={{
                  color: C.muted,
                  fontSize: 13,
                  lineHeight: 21,
                  maxWidth: 600,
                  marginBottom: 18,
                }}>
                {featuredEvent.description}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 14,
                  marginBottom: 22,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <Ionicons name="calendar-outline" size={15} color={C.primary} />

                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: C.textSecondary,
                    }}>
                    {featuredEvent.fullDate}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <Ionicons name="location-outline" size={15} color={C.primary} />

                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: C.textSecondary,
                    }}>
                    {featuredEvent.location}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setSelectedEvent(featuredEvent)}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: C.primaryDark,
                  paddingHorizontal: 19,
                  paddingVertical: 11,
                  borderRadius: 9,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: '800',
                  }}>
                  View Event
                </Text>

                <Ionicons name="arrow-forward" size={15} color="#fff" />
              </Pressable>
            </View>

            {/* DATE VISUAL */}

            <View
              style={{
                width: isMobile ? '100%' : isTablet ? 220 : 270,

                minHeight: isMobile ? 125 : 260,

                backgroundColor: C.primary,

                alignItems: 'center',
                justifyContent: 'center',

                position: 'relative',

                overflow: 'hidden',
              }}>
              <View
                style={{
                  position: 'absolute',
                  width: 250,
                  height: 250,
                  borderRadius: 125,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.15)',
                  right: -100,
                  top: -90,
                }}
              />

              <Text
                style={{
                  color: '#a7f3ed',
                  fontSize: 10,
                  fontWeight: '900',
                  letterSpacing: 2,
                }}>
                {featuredEvent.month}
              </Text>

              <Text
                style={{
                  color: '#fff',
                  fontSize: isMobile ? 55 : 76,
                  lineHeight: isMobile ? 60 : 80,
                  fontWeight: '900',
                  letterSpacing: -4,
                }}>
                {featuredEvent.date}
              </Text>

              <Text
                style={{
                  color: '#d5fffb',
                  fontSize: 11,
                  fontWeight: '700',
                }}>
                {featuredEvent.day}
              </Text>
            </View>
          </View>
        </View>

        {/* ====================================================
            EVENTS SECTION
        ===================================================== */}

        <View
          style={{
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',
            paddingHorizontal: px,
            marginTop: isMobile ? 40 : 55,
          }}>
          {/* SECTION HEADER */}

          <View
            style={{
              flexDirection: isMobile ? 'column' : 'row',

              alignItems: isMobile ? 'flex-start' : 'flex-end',

              justifyContent: 'space-between',

              gap: 16,

              marginBottom: 20,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 11,
                  color: C.primary,
                  fontWeight: '900',
                  letterSpacing: 1.5,
                  marginBottom: 7,
                }}>
                UPCOMING
              </Text>

              <Text
                style={{
                  fontSize: isMobile ? 25 : 31,
                  lineHeight: 36,
                  fontWeight: '900',
                  color: C.text,
                  letterSpacing: -0.7,
                }}>
                Upcoming events
              </Text>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: C.muted,
              }}>
              {filteredEvents.length} events available
            </Text>
          </View>

          {/* CATEGORY FILTER */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 8,
              paddingBottom: 18,
            }}>
            {CATEGORIES.map((category) => {
              const active = activeCategory === category.name;

              return (
                <Pressable
                  key={category.name}
                  onPress={() => {
                    setActiveCategory(category.name);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,

                    paddingHorizontal: 13,
                    paddingVertical: 9,

                    borderRadius: 8,

                    backgroundColor: active ? C.primary : '#fff',

                    borderWidth: 1,

                    borderColor: active ? C.primary : '#e2e8f0',
                  }}>
                  <Ionicons name={category.icon} size={15} color={active ? '#fff' : C.primary} />

                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: active ? '#fff' : C.textSecondary,
                    }}>
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* EVENTS LIST */}

          <View
            style={{
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e2e8f0',
            }}>
            {filteredEvents.length === 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 70,
                }}>
                <Ionicons name="calendar-outline" size={34} color="#94a3b8" />

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '800',
                    color: C.text,
                    marginTop: 13,
                    marginBottom: 5,
                  }}>
                  No events found
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: C.muted,
                    textAlign: 'center',
                  }}>
                  Try another search or category.
                </Text>
              </View>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isMobile={isMobile}
                  onPress={() => setSelectedEvent(event)}
                />
              ))
            )}
          </View>
        </View>

        {/* ====================================================
            WHY ATTEND
        ===================================================== */}

        <View
          style={{
            width: '100%',
            maxWidth: 1180,
            alignSelf: 'center',
            paddingHorizontal: px,
            marginTop: isMobile ? 48 : 65,
          }}>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#e2e8f0',
              paddingTop: 30,
            }}>
            <Text
              style={{
                fontSize: 11,
                color: C.primary,
                fontWeight: '900',
                letterSpacing: 1.5,
                marginBottom: 8,
              }}>
              WHY ATTEND
            </Text>

            <Text
              style={{
                fontSize: isMobile ? 24 : 30,
                fontWeight: '900',
                color: C.text,
                letterSpacing: -0.6,
                marginBottom: 25,
              }}>
              More than just an event.
            </Text>

            <View
              style={{
                flexDirection: isMobile ? 'column' : 'row',

                gap: isMobile ? 22 : 45,
              }}>
              {[
                {
                  icon: 'school-outline',
                  title: 'Learn from experts',
                  text: 'Gain practical insights from experienced clinicians and industry professionals.',
                },
                {
                  icon: 'people-outline',
                  title: 'Build your network',
                  text: 'Meet dentists, professionals and people shaping the future of dental care.',
                },
                {
                  icon: 'trending-up-outline',
                  title: 'Stay ahead',
                  text: 'Discover new techniques, technologies and ideas for your practice.',
                },
              ].map((item) => (
                <View
                  key={item.title}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    gap: 13,
                  }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: C.primaryLight,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                    <Ionicons name={item.icon} size={18} color={C.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '800',
                        color: C.text,
                        marginBottom: 5,
                      }}>
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 19,
                        color: C.muted,
                      }}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ======================================================
          EVENT DETAILS MODAL
      ======================================================= */}

      <Modal
        visible={!!selectedEvent}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEvent(null)}>
        <View
          style={{
            flex: 1,

            backgroundColor: 'rgba(15,23,42,0.55)',

            alignItems: 'center',
            justifyContent: 'center',

            padding: 20,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth: 620,

              maxHeight: Platform.OS === 'web' ? '85%' : '90%',

              backgroundColor: '#fff',

              borderRadius: 18,

              overflow: 'hidden',
            }}>
            {selectedEvent && (
              <>
                {/* MODAL TOP */}

                <View
                  style={{
                    backgroundColor: C.primaryDark,

                    padding: 24,

                    position: 'relative',
                  }}>
                  <Pressable
                    onPress={() => setSelectedEvent(null)}
                    style={{
                      position: 'absolute',

                      right: 16,
                      top: 16,

                      width: 32,
                      height: 32,

                      borderRadius: 16,

                      backgroundColor: 'rgba(255,255,255,0.12)',

                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="close" size={18} color="#fff" />
                  </Pressable>

                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: '900',
                      letterSpacing: 1.3,
                      marginBottom: 10,
                    }}>
                    {selectedEvent.category.toUpperCase()}
                  </Text>

                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 25,
                      lineHeight: 31,
                      fontWeight: '900',
                      letterSpacing: -0.6,
                      paddingRight: 35,
                    }}>
                    {selectedEvent.title}
                  </Text>
                </View>

                {/* MODAL CONTENT */}

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    padding: 24,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 23,
                      color: C.textSecondary,
                      marginBottom: 22,
                    }}>
                    {selectedEvent.description}
                  </Text>

                  {/* EVENT DETAILS */}

                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#e2e8f0',
                    }}>
                    {[
                      {
                        icon: 'calendar-outline',
                        label: 'Date',
                        value: `${selectedEvent.fullDate} • ${selectedEvent.day}`,
                      },
                      {
                        icon: 'time-outline',
                        label: 'Time',
                        value: selectedEvent.time,
                      },
                      {
                        icon:
                          selectedEvent.mode === 'Online' ? 'globe-outline' : 'location-outline',
                        label: 'Location',
                        value: selectedEvent.location,
                      },
                      {
                        icon: 'person-outline',
                        label: 'Speaker',
                        value: `${selectedEvent.speaker} • ${selectedEvent.designation}`,
                      },
                    ].map((item) => (
                      <View
                        key={item.label}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          gap: 13,
                          paddingVertical: 14,
                          borderBottomWidth: 1,
                          borderBottomColor: '#e2e8f0',
                        }}>
                        <Ionicons name={item.icon} size={18} color={C.primary} />

                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text
                            style={{
                              fontSize: 10,
                              color: C.muted,
                              fontWeight: '700',
                              marginBottom: 3,
                            }}>
                            {item.label.toUpperCase()}
                          </Text>

                          <Text
                            style={{
                              fontSize: 13,
                              color: C.text,
                              fontWeight: '700',
                              lineHeight: 19,
                            }}>
                            {item.value}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* SEATS */}

                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                    <Ionicons name="ticket-outline" size={17} color={C.primary} />

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: C.primary,
                      }}>
                      {selectedEvent.seats}
                    </Text>
                  </View>

                  {/* REGISTER */}

                  <Pressable
                    onPress={() => {
                      // Add your registration
                      // navigation/API here
                      setSelectedEvent(null);
                    }}
                    style={{
                      marginTop: 22,

                      height: 48,

                      backgroundColor: C.primary,

                      borderRadius: 9,

                      alignItems: 'center',
                      justifyContent: 'center',

                      flexDirection: 'row',
                      gap: 8,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: '900',
                      }}>
                      Register for Event
                    </Text>

                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </Pressable>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
