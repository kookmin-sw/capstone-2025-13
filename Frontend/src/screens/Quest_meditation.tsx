import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
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

  const dynamicStyles = StyleSheet.create({
    timerText: {
      fontSize: width * 0.16,
      color: "#fff94f",
      fontWeight: "bold",
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
      fontWeight: "bold",
    },
    missionTitle: {
      fontSize: width * 0.045,
      fontFamily: fonts.laundry,
      color: "#fff",
      marginTop: width * 0.03,
    },
    mainText: {
      fontSize: width * 0.06,
      fontWeight: "bold",
      color: "#fff",
      marginVertical: width * 0.02,
    },
    warningTitle: {
      fontSize: width * 0.045,
      color: "#fff",
      fontWeight: "600",
      marginTop: width * 0.04,
      marginBottom: width * 0.02,
    },
    description: {
      color: "#ccc",
      fontSize: width * 0.035,
      marginBottom: width * 0.01,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: width * 0.045,
      color: "#fff",
      marginVertical: width * 0.05,
    },
  });

  return (
    <ScrollView contentContainerStyle={[styles.container, { minHeight: height, padding: width * 0.05 }]}>
      <Text style={dynamicStyles.missionTitle}>오늘의 미션 🔥</Text>
      <Text style={dynamicStyles.mainText}>5분 간 명상하기</Text>

      <Text style={dynamicStyles.timerText}>{formatTime(timeLeft)}</Text>

      <Text style={dynamicStyles.warningTitle}>주의! 명상 타이머는 이렇게 작동해요 🧘🏻‍♀️</Text>
      <Text style={dynamicStyles.description}>・ 시작 버튼을 누르면 타이머가 바로 시작돼요.</Text>
      <Text style={dynamicStyles.description}>・ 앱을 강제로 종료하면 타이머가 초기화돼요.</Text>
      <Text style={dynamicStyles.description}>・ 다른 화면으로 나가면 타이머가 멈춰요.</Text>
      <Text style={dynamicStyles.description}>・ 시간이 다 지나고 완료 버튼을 꼭 눌러야 미션 성공으로 인정돼요. 🙌</Text>

      <Text style={dynamicStyles.sectionTitle}>오늘의 추천 플레이리스트 🎧</Text>

      <View style={dynamicStyles.youtubeWrapper}>
        <YoutubePlayer
          height={dynamicStyles.youtubeWrapper.height}
          width={dynamicStyles.youtubeWrapper.width}
          videoId="5qap5aO4i9A"
          play={false}
        />
      </View>

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
