import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Linking,
  Image,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import fonts from "../constants/fonts";

export default function Quest_meditation() {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { width, height } = useWindowDimensions();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const mainVideo = {
    id: "5qap5aO4i9A",
    title: "[Playlist] 차분하게 즐기는 플레이리스트 | 인센스 음악 | WOODLAND Playlist",
  };

  const videoRecommendations = [
    {
      id: "DWcJFNfaw9c",
      title: "명상과 함께하는 자연 속 음악",
      channel: "Calm Sound",
      duration: "1:03:22",
      thumbnail: "https://img.youtube.com/vi/DWcJFNfaw9c/0.jpg",
    },
    {
      id: "6zD3acN2RfY",
      title: "마음이 차분해지는 피아노 선율 모음",
      channel: "Healing Piano",
      duration: "52:10",
      thumbnail: "https://img.youtube.com/vi/6zD3acN2RfY/0.jpg",
    },
    {
      id: "hHW1oY26kxQ",
      title: "편안한 재즈로 명상 타임 즐기기",
      channel: "Jazz Relax",
      duration: "45:00",
      thumbnail: "https://img.youtube.com/vi/hHW1oY26kxQ/0.jpg",
    },
  ];

  const dynamicStyles = StyleSheet.create({
    timerText: {
      fontSize: width * 0.22,
      color: "#fff94f",
      fontFamily: fonts.laundryBold,
      marginVertical: width * 0.05,
      textShadowColor: "#fff",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
    },
    youtubeWrapper: {
      width: width * 0.9,
      height: width * 0.5,
      marginBottom: width * 0.05,
      borderRadius: 12,
      overflow: "hidden",
    },
    button: {
      backgroundColor: "#6c63ff",
      paddingHorizontal: width * 0.15,
      paddingVertical: width * 0.04,
      borderRadius: 20,
      alignSelf: "center",
      position: "absolute",
      bottom: width * 0.1,
      zIndex: 1,
    },
    buttonText: {
      color: "#fff",
      fontSize: width * 0.045,
      fontFamily: fonts.laundryBold,
    },
    missionTitle: {
      fontSize: width * 0.045,
      fontFamily: fonts.laundryBold,
      color: "#fff",
      marginTop: width * 0.03,
    },
    mainText: {
      fontSize: width * 0.06,
      fontFamily: fonts.laundryBold,
      color: "#fff",
      marginVertical: width * 0.02,
    },
    warningTitle: {
      fontSize: width * 0.045,
      color: "#fff",
      fontFamily: fonts.laundry,
      marginTop: width * 0.04,
      marginBottom: width * 0.02,
    },
    description: {
      color: "#ccc",
      fontSize: width * 0.035,
      fontFamily: fonts.laundry,
      marginBottom: width * 0.01,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: width * 0.045,
      fontFamily: fonts.laundryBold,
      color: "#fff94f",
      marginTop: width * 0.15,
      marginBottom: width * 0.03,
      alignSelf: "flex-start",
    },
    videoCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1a1a40",
      borderRadius: 12,
      marginBottom: width * 0.03,
      padding: width * 0.03,
      width: "100%",
    },
    thumbnail: {
      width: width * 0.25,
      height: width * 0.15,
      borderRadius: 8,
      marginRight: width * 0.04,
    },
    videoTextWrapper: {
      flexShrink: 1,
    },
    videoTitle: {
      fontSize: width * 0.035,
      color: "#fff",
      fontFamily: fonts.laundryBold,
      marginBottom: 2,
    },
    videoMeta: {
      fontSize: width * 0.03,
      color: "#ccc",
      fontFamily: fonts.laundry,
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#0e0033" }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { minHeight: height, padding: width * 0.1, paddingBottom: width * 0.25 },
        ]}
        bounces={false}
        overScrollMode="never"
      >
        <Text style={dynamicStyles.missionTitle}>오늘의 미션 🔥</Text>
        <Text style={dynamicStyles.mainText}>5분 간 명상하기</Text>

        <Text style={dynamicStyles.timerText}>{formatTime(timeLeft)}</Text>

        <Text style={dynamicStyles.warningTitle}>명상 타이머는 이렇게 작동해요 🧘🏻‍♀️</Text>
        <Text style={dynamicStyles.description}>・ 시작 버튼을 누르면 타이머가 바로 시작돼요.</Text>
        <Text style={dynamicStyles.description}>・ 앱을 강제로 종료하면 타이머가 초기화돼요.</Text>
        <Text style={dynamicStyles.description}>・ 다른 화면으로 나가면 타이머가 멈춰요.</Text>
        <Text style={dynamicStyles.description}>・ 시간이 다 지나고 완료 버튼을 꼭 눌러야 미션 성공으로 인정돼요. 🙌</Text>

        <Text style={dynamicStyles.sectionTitle}>오늘의 추천 플레이리스트 🎧</Text>

        <View style={dynamicStyles.youtubeWrapper}>
          <YoutubePlayer
            height={dynamicStyles.youtubeWrapper.height}
            width={dynamicStyles.youtubeWrapper.width}
            videoId={mainVideo.id}
            play={false}
          />
        </View>

        {videoRecommendations.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={dynamicStyles.videoCard}
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
          >
            <Image source={{ uri: video.thumbnail }} style={dynamicStyles.thumbnail} />
            <View style={dynamicStyles.videoTextWrapper}>
              <Text numberOfLines={2} style={dynamicStyles.videoTitle}>
                {video.title}
              </Text>
              <Text style={dynamicStyles.videoMeta}>
                {video.channel} · {video.duration}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={startTimer}
        disabled={isRunning}
      >
        <Text style={dynamicStyles.buttonText}>시 - 작 !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
