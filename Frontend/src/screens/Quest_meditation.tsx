import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
  Linking,
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

  const videoRecommendations = [
    {
      id: "5qap5aO4i9A",
      title: "[Playlist] 차분하게 즐기는 플레이리스트 | 인센스 음악 | WOODLAND Playlist",
      channel: "오센트OHSCENT",
      duration: "38:50",
      thumbnail: "https://img.youtube.com/vi/5qap5aO4i9A/0.jpg",
    },
    {
      id: "DWcJFNfaw9c",
      title: "명상과 함께하는 자연 속 음악",
      channel: "Calm Sound",
      duration: "1:03:22",
      thumbnail: "https://img.youtube.com/vi/DWcJFNfaw9c/0.jpg",
    },
    // 추가 영상들 자유롭게 여기에 넣을 수 있음
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
      marginTop: width * 0.05,
      backgroundColor: "#6c63ff",
      paddingHorizontal: width * 0.15,
      paddingVertical: width * 0.04,
      borderRadius: 20,
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
      marginBottom: width * 0.04,
      alignItems: "center",
    },
    thumbnail: {
      width: width * 0.28,
      height: width * 0.16,
      borderRadius: 8,
      marginRight: width * 0.03,
    },
    videoTextWrapper: {
      flex: 1,
    },
    videoTitle: {
      color: "#fff",
      fontSize: width * 0.035,
      fontFamily: fonts.laundryBold,
    },
    videoMeta: {
      color: "#bbb",
      fontSize: width * 0.03,
      marginTop: width * 0.01,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { minHeight: height, padding: width * 0.15 }]}
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

      {videoRecommendations.map((video) => (
        <TouchableOpacity
          key={video.id}
          style={dynamicStyles.videoCard}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
        >
          <Image source={{ uri: video.thumbnail }} style={dynamicStyles.thumbnail} />
          <View style={dynamicStyles.videoTextWrapper}>
            <Text numberOfLines={2} style={dynamicStyles.videoTitle}>{video.title}</Text>
            <Text style={dynamicStyles.videoMeta}>{video.channel} · {video.duration}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={dynamicStyles.button} onPress={startTimer} disabled={isRunning}>
        <Text style={dynamicStyles.buttonText}>시 - 작 !</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#0e0033",
  },
});
