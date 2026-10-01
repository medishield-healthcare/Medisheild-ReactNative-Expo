import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";

import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import API from "@/api/axios";

// import mediShieldVideo from "../../assets/medishield1.mp4";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

/* =====================================================
   VIDEO CARD
===================================================== */

const VideoCard = ({ item, isPlaying, onPlay }) => {
  const player = useVideoPlayer(item.url, (player) => {
    player.loop = true;
    player.muted = true;
  });

  /*
   * Parent controls which video is playing.
   *
   * isPlaying = true
   * -> play this video
   *
   * isPlaying = false
   * -> pause this video
   *
   * This ensures only one video can play at a time.
   */

  useEffect(() => {
    if (!player) return;

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  const handlePlay = () => {
    if (isPlaying) {
      // Current video -> pause
      onPlay(null);
    } else {
      // This video -> play
      // Previous active video will automatically pause
      onPlay(item.id);
    }
  };

  return (
    <View style={styles.card}>

      {/* =================================================
          VIDEO
      ================================================= */}

      <VideoView
        player={player}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        nativeControls={false}
      />

      {/* =================================================
          DARK OVERLAY
      ================================================= */}

      <View style={styles.overlay} />

      {/* =================================================
          CENTER PLAY / PAUSE BUTTON
          
          Full card wrapper ensures exact center
      ================================================= */}

      <View
        style={styles.centerButtonWrapper}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={handlePlay}
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={30}
            color="#000000"
            style={!isPlaying ? styles.playIcon : undefined}
          />
        </Pressable>
      </View>

      {/* =================================================
          TITLE
      ================================================= */}

      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </View>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const DentalVideos = () => {

  const [videos,setVideos] = useState([]);

  async function getData(){
    let res = await API.get('/video');
    console.log('Videos fetched:', res.data);
    setVideos(res.data.data);
  }

  useEffect(() => {
    getData();

  },[])

  const flatListRef = useRef(null);

  /*
   * Stores the ID of currently playing video.
   *
   * null = no video playing
   * "1" = video 1 playing
   * "2" = video 2 playing
   */

  const [activeVideo, setActiveVideo] = useState(null);

  const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.71, 275);

  const GAP = 16;

  const SNAP_INTERVAL = CARD_WIDTH + GAP;

  /* =====================================================
     PLAY / PAUSE
  ===================================================== */

  const handlePlay = (videoId) => {
    /*
     * If videoId is different from current active video,
     * previous video automatically receives isPlaying=false
     * and pauses.
     *
     * Example:
     *
     * Video 1 playing
     * activeVideo = "1"
     *
     * Click Video 2
     * activeVideo = "2"
     *
     * Video 1 -> false -> pause
     * Video 2 -> true  -> play
     */

    setActiveVideo(videoId);
  };

  /* =====================================================
     NEXT
  ===================================================== */

  const scrollNext = () => {
    flatListRef.current?.scrollToOffset({
      offset: SNAP_INTERVAL,
      animated: true,
    });
  };

  /* =====================================================
     PREVIOUS
  ===================================================== */

  const scrollPrevious = () => {
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADING
      ================================================= */}

      <Text style={styles.heading}>
        Dental Essentials, In{"\n"}Action
      </Text>

      {/* =================================================
          VIDEO SLIDER
      ================================================= */}

      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={{ width: GAP }} />
        )}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            isPlaying={activeVideo === item.id}
            onPlay={handlePlay}
          />
        )}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
      />

      {/* =================================================
          NAVIGATION BUTTONS
      ================================================= */}

     
    </View>
  );
};

export default DentalVideos;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 25,
  },

  /* ===================================================
     HEADING
  =================================================== */

  heading: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: "#101828",
    letterSpacing: -1.2,

    paddingHorizontal: 15,

    marginBottom: 62,
    marginTop: 30,
  },

  /* ===================================================
     LIST
  =================================================== */

  listContent: {
    paddingLeft: 15,
    paddingRight: 15,
  },

  /* ===================================================
     CARD
  =================================================== */

  card: {
    width: Math.min(SCREEN_WIDTH * 0.71, 275),

    height: 335,

    borderRadius: 23,

    overflow: "hidden",

    backgroundColor: "#E5E5E5",

    position: "relative",
  },

  /* ===================================================
     VIDEO OVERLAY
  =================================================== */

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },

  /* ===================================================
     CENTER BUTTON WRAPPER

     This covers the entire card.
     Button is centered using flexbox.
  =================================================== */

  centerButtonWrapper: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 10,
  },

  /* ===================================================
     PLAY / PAUSE BUTTON
  =================================================== */

  playButton: {
    width: 82,
    height: 82,

    borderRadius: 41,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 6,
  },

  playButtonPressed: {
    transform: [{ scale: 0.94 }],
  },

  playIcon: {
    marginLeft: 4,
  },

  /* ===================================================
     TITLE
  =================================================== */

  titleContainer: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 22,

    paddingBottom: 21,

    paddingTop: 55,

    justifyContent: "flex-end",

    zIndex: 5,
  },

  cardTitle: {
    color: "#FFFFFF",

    fontSize: 16,

    lineHeight: 21,

    fontWeight: "500",
  },

  /* ===================================================
     NAVIGATION
  =================================================== */

  navigation: {
    flexDirection: "row",

    justifyContent: "flex-end",

    alignItems: "center",

    gap: 10,

    paddingHorizontal: 15,

    marginTop: 29,
  },

  navButton: {
    width: 48,
    height: 48,

    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#E0E0E0",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  navButtonPressed: {
    backgroundColor: "#F5F5F5",
  },
});