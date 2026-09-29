
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import C from "@/utils/theme";
import API from "@/api/axios";

/* -------------------------------------------------------
   LOCAL VIDEO
------------------------------------------------------- */

// const mediShieldVideo = "https://files.edgestore.dev/2jnl8faw37wc6ly2/videos/_public/b7a4efb4-ad0b-4143-887a-c1eac693e450/403bae70-08fb-4bdc-a396-52d2873320be.mp4";

/* -------------------------------------------------------
   VIDEO DATA
------------------------------------------------------- */

// const videos = [
//   {
//     id: "1",
//     video: mediShieldVideo,
//     title: "Better care starts here",
//   },

//   {
//     id: "2",
//     video: mediShieldVideo,
//     title: "Built for dental professionals",
//   },

//   {
//     id: "3",
//     video: mediShieldVideo,
//     title: "Tools that make a difference",
//   },

//   {
//     id: "4",
//     video: mediShieldVideo,
//     title: "Made for modern clinics",
//   },

//   {
//     id: "5",
//     video: mediShieldVideo,
//     title: "Designed around you",
//   },
// ];

/* -------------------------------------------------------
   VIDEO CARD
------------------------------------------------------- */

const VideoCard = ({
  item,
  width,
  height,
  isMobile,
  onPlay,
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const player = useVideoPlayer(item.url, (player) => {
    player.loop = true;
  });

  /* -------------------------------------------------------
     PLAYER STATE SYNC
  ------------------------------------------------------- */

  useEffect(() => {
    const subscription = player.addListener(
      "playingChange",
      ({ isPlaying }) => {
        setIsPlaying(isPlaying);

        if (isPlaying) {
          setShowVideo(true);
        } else {
          setShowVideo(false);
        }
      }
    );

    return () => subscription.remove();
  }, [player]);

  /* -------------------------------------------------------
     PLAY / PAUSE
  ------------------------------------------------------- */

  const handlePlayPause = () => {
    setVideoError(false);

    /*
      If this video is already playing,
      simply pause it.
    */
    if (player.playing) {
      player.pause();

      setIsPlaying(false);
      setShowVideo(false);

      return;
    }

    /*
      Tell the parent that this video wants to play.

      The parent will pause whichever video was
      previously playing before allowing this one to play.
    */
    onPlay(player, item.id);

    setShowVideo(true);
    setIsPlaying(true);

    player.play();
  };

  /* -------------------------------------------------------
     RETRY
  ------------------------------------------------------- */

  const handleRetry = () => {
    setVideoError(false);

    /*
      Retry also goes through the parent so that
      another playing video gets paused.
    */
    onPlay(player, item.id);

    setShowVideo(true);
    setIsPlaying(true);

    player.play();
  };

  return (
    <Pressable
      style={({ hovered, pressed }) => [
        styles.card,
        {
          width,
          height,
        },
        hovered && styles.cardHover,
        pressed && styles.cardPressed,
      ]}
      onPress={videoError ? handleRetry : handlePlayPause}
    >
      {/* -------------------------------------------------
          VIDEO
      ------------------------------------------------- */}

      <VideoView
        player={player}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        nativeControls={false}
        playsInline
        pointerEvents="none"
      />

      {/* -------------------------------------------------
          DARK OVERLAY
      ------------------------------------------------- */}

      <View
        pointerEvents="none"
        style={styles.overlay}
      />

      {/* -------------------------------------------------
          ERROR
      ------------------------------------------------- */}

      {videoError && (
        <View
          pointerEvents="none"
          style={styles.errorContainer}
        >
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={28}
              color="#000"
            />
          </View>

          <Text style={styles.errorText}>
            Video couldn't be loaded
          </Text>

          <Text style={styles.retryText}>
            Tap to retry
          </Text>
        </View>
      )}

      {/* -------------------------------------------------
          PLAY BUTTON
      ------------------------------------------------- */}

      {!showVideo && !videoError && (
        <View
          pointerEvents="none"
          style={styles.playButton}
        >
          <Ionicons
            name="play"
            size={isMobile ? 23 : 28}
            color="#000"
            style={{
              marginLeft: 3,
            }}
          />
        </View>
      )}

      {/* -------------------------------------------------
          PAUSE BUTTON
      ------------------------------------------------- */}

      {showVideo && isPlaying && !videoError && (
        <View
          pointerEvents="none"
          style={styles.playButton}
        >
          <Ionicons
            name="pause"
            size={isMobile ? 23 : 28}
            color="#000"
          />
        </View>
      )}

      {/* -------------------------------------------------
          TITLE
      ------------------------------------------------- */}

      <View
        pointerEvents="none"
        style={styles.bottomContent}
      >
        <Text style={styles.cardTitle}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
};

/* -------------------------------------------------------
   MAIN SECTION
------------------------------------------------------- */

const CircularVideoSection = () => {
  const [videos,setVideos] = useState([]);

  async function getData(){
    let res = await API.get('/video');
    console.log('Videos fetched:', res.data);
    setVideos(res.data.data);
  }

  useEffect(() => {
    getData();

  },[])
  const scrollRef = useRef(null);

  /*
    This ref keeps track of the video that is currently
    playing.

    Whenever another video starts:
      1. Previous player gets paused
      2. New player becomes active
  */
  const activePlayerRef = useRef(null);
  const activeVideoIdRef = useRef(null);

  const { width } = useWindowDimensions();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  /* -------------------------------------------------------
     SINGLE VIDEO PLAY HANDLER
  ------------------------------------------------------- */

  const handleVideoPlay = (newPlayer, videoId) => {
    /*
      If another video is currently playing,
      pause it first.
    */
    if (
      activePlayerRef.current &&
      activePlayerRef.current !== newPlayer
    ) {
      activePlayerRef.current.pause();
    }

    /*
      Store the newly active player.
    */
    activePlayerRef.current = newPlayer;
    activeVideoIdRef.current = videoId;
  };

  /* -------------------------------------------------------
     RESPONSIVE PADDING
  ------------------------------------------------------- */

  const horizontalPadding = isMobile
    ? 16
    : isTablet
      ? 24
      : 40;

  /* -------------------------------------------------------
     GAP
  ------------------------------------------------------- */

  const gap = isMobile
    ? 14
    : isTablet
      ? 18
      : 22;

  /* -------------------------------------------------------
     RESPONSIVE CONTAINER
  ------------------------------------------------------- */

  const containerWidth = Math.min(
    width - horizontalPadding * 2,
    1200
  );

  /* -------------------------------------------------------
     CARD WIDTH
  ------------------------------------------------------- */

  const cardWidth = isMobile
    ? Math.min(width * 0.72, 280)
    : isTablet
      ? (containerWidth - gap * 2) / 3
      : (containerWidth - gap * 3) / 4;

  /* -------------------------------------------------------
     CARD HEIGHT
  ------------------------------------------------------- */

  const cardHeight = isMobile
    ? Math.min(cardWidth * 1.30, 350)
    : isTablet
      ? Math.min(cardWidth * 1.28, 340)
      : Math.min(cardWidth * 1.25, 330);

  /* -------------------------------------------------------
     SCROLL LEFT
  ------------------------------------------------------- */

  const scrollLeft = () => {
    scrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  };

  /* -------------------------------------------------------
     SCROLL RIGHT
  ------------------------------------------------------- */

  const scrollRight = () => {
    scrollRef.current?.scrollToEnd({
      animated: true,
    });
  };

  return (
    <View
      style={[
        styles.section,
        {
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
      <View style={styles.container}>

        {/* -------------------------------------------------
            HEADING
        ------------------------------------------------- */}

        <View style={styles.headingRow}>
          <Text
            style={[
              styles.heading,
              {
                fontSize: isMobile
                  ? 30
                  : isTablet
                    ? 40
                    : 40,

                lineHeight: isMobile
                  ? 40
                  : isTablet
                    ? 52
                    : 62,

                fontFamily: "Poppins_400Regular",
                fontWeight: "700",
              },
            ]}
          >
            Dental Essentials, In Action
          </Text>

          {/* -------------------------------------------------
              DESKTOP NAVIGATION
          ------------------------------------------------- */}

          {isDesktop && (
            <View style={styles.navigation}>
              <Pressable
                onPress={scrollLeft}
                style={({ hovered, pressed }) => [
                  styles.navButton,
                  hovered && styles.navButtonHover,
                  pressed && styles.navButtonPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={C.dark}
                />
              </Pressable>

              <Pressable
                onPress={scrollRight}
                style={({ hovered, pressed }) => [
                  styles.navButton,
                  hovered && styles.navButtonHover,
                  pressed && styles.navButtonPressed,
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={C.dark}
                />
              </Pressable>
            </View>
          )}
        </View>

        {/* -------------------------------------------------
            CAROUSEL
        ------------------------------------------------- */}

        <View style={styles.carouselWrapper}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap,
              paddingVertical: 8,
              paddingRight: horizontalPadding,
            }}
          >
            {videos.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                width={cardWidth}
                height={cardHeight}
                isMobile={isMobile}
                onPlay={handleVideoPlay}
              />
            ))}
          </ScrollView>

          {/* -------------------------------------------------
              FLOATING ARROWS
          ------------------------------------------------- */}

          {!isMobile && (
            <>
              <Pressable
                onPress={scrollLeft}
                style={({ pressed }) => [
                  styles.floatingArrow,
                  styles.leftArrow,
                  pressed && styles.arrowPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color="#fff"
                />
              </Pressable>

              <Pressable
                onPress={scrollRight}
                style={({ pressed }) => [
                  styles.floatingArrow,
                  styles.rightArrow,
                  pressed && styles.arrowPressed,
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#fff"
                />
              </Pressable>
            </>
          )}
        </View>

        {/* -------------------------------------------------
            MOBILE NAVIGATION
        ------------------------------------------------- */}

        {isMobile && (
          <View style={styles.mobileNavigation}>
            <Pressable
              onPress={scrollLeft}
              style={styles.mobileNavButton}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={C.dark}
              />
            </Pressable>

            <Pressable
              onPress={scrollRight}
              style={styles.mobileNavButton}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={C.dark}
              />
            </Pressable>
          </View>
        )}

      </View>
    </View>
  );
};

export default CircularVideoSection;

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },

  section: {
    width: "100%",
    paddingTop: 70,
    paddingBottom: 80,
    backgroundColor: C.white,
  },

  headingRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 42,
  },

  heading: {
    color: C.dark,
    letterSpacing: -1.5,
  },

  navigation: {
    flexDirection: "row",
    gap: 10,
  },

  navButton: {
    width: 46,
    height: 46,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  navButtonHover: {
    backgroundColor: "#F3F3F3",
  },

  navButtonPressed: {
    transform: [{ scale: 0.94 }],
  },

  carouselWrapper: {
    position: "relative",
    width: "100%",
  },

  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: "#E9E9E9",
    justifyContent: "center",
    alignItems: "center",
  },

  cardHover: {
    transform: [{ scale: 0.985 }],
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  /* -------------------------------------------------------
     PLAY / PAUSE BUTTON
  ------------------------------------------------------- */

  playButton: {
    width: 72,
    height: 72,
    borderRadius: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.16,
    shadowRadius: 12,

    elevation: 5,
  },

  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 100,
    backgroundColor: "#fff",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.16,
    shadowRadius: 12,

    elevation: 5,
  },

  errorText: {
    marginTop: 12,
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",

    textShadowColor: "rgba(0,0,0,0.5)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 4,
  },

  retryText: {
    marginTop: 4,
    fontSize: 12,
    color: "#fff",
    textAlign: "center",

    textShadowColor: "rgba(0,0,0,0.5)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 4,
  },

  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  bottomContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
  },

  cardTitle: {
    fontSize: 15,
    color: "#fff",

    textShadowColor: "rgba(0,0,0,0.4)",

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 4,
  },

  /* -------------------------------------------------------
     FLOATING ARROWS
  ------------------------------------------------------- */

  floatingArrow: {
    position: "absolute",
    top: "50%",
    marginTop: -36,

    width: 50,
    height: 50,

    borderRadius: 100,

    backgroundColor: "rgba(0,0,0,0.52)",

    alignItems: "center",
    justifyContent: "center",
  },

  leftArrow: {
    left: 6,
  },

  rightArrow: {
    right: 6,
  },

  arrowPressed: {
    transform: [{ scale: 0.92 }],
  },

  /* -------------------------------------------------------
     MOBILE NAVIGATION
  ------------------------------------------------------- */

  mobileNavigation: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 18,
  },

  mobileNavButton: {
    width: 42,
    height: 42,

    borderRadius: 100,

    borderWidth: 1,
    borderColor: "#D9D9D9",

    alignItems: "center",
    justifyContent: "center",
  },
});