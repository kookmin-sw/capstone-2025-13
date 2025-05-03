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
import styles from "../styles/questMeditationStyles";

export default function Quest_meditation() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isMeditationDone, setIsMeditationDone] = useState(false);
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
    setIsMeditationDone(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          setIsMeditationDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleComplete = () => {
    alert("명상이 완료되었습니다! 🎉");
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

  const buttonText = isMeditationDone
    ? "완 료 !"
    : isRunning
      ? "명상중 🧘🏻‍♀️"
      : "시 - 작 !";

  const buttonColor = isMeditationDone
    ? "#E68E48"
    : isRunning
      ? "#aaa"
      : "#6c63ff";

  const dynamic = {
    timerText: {
      fontSize: width * 0.22,
      marginVertical: width * 0.05,
    },
    youtubeWrapper: {
      width: width * 0.9,
      height: width * 0.5,
      marginBottom: width * 0.05,
    },
    button: {
      paddingHorizontal: width * 0.15,
      paddingVertical: width * 0.04,
      bottom: width * 0.1,
    },
    buttonText: {
      fontSize: width * 0.045,
    },
    missionTitle: {
      fontSize: width * 0.045,
      marginTop: width * 0.03,
    },
    mainText: {
      fontSize: width * 0.06,
      marginVertical: width * 0.02,
    },
    warningTitle: {
      fontSize: width * 0.045,
      marginTop: width * 0.04,
      marginBottom: width * 0.02,
    },
    description: {
      fontSize: width * 0.035,
      marginBottom: width * 0.01,
    },
    sectionTitle: {
      fontSize: width * 0.045,
      marginTop: width * 0.15,
      marginBottom: width * 0.03,
    },
    videoCard: {
      marginBottom: width * 0.03,
      padding: width * 0.03,
    },
    thumbnail: {
      width: width * 0.25,
      height: width * 0.15,
      marginRight: width * 0.04,
    },
  };

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { minHeight: height, padding: width * 0.1, paddingBottom: width * 0.25 },
        ]}
        bounces={false}
        overScrollMode="never"
      >
        <Text style={[styles.missionTitle, dynamic.missionTitle]}>오늘의 미션 🔥</Text>
        <Text style={[styles.mainText, dynamic.mainText]}>5분 간 명상하기</Text>
        <Text style={[styles.timerText, dynamic.timerText]}>{formatTime(timeLeft)}</Text>

        <Text style={[styles.warningTitle, dynamic.warningTitle]}>명상 타이머는 이렇게 작동해요 🧘🏻‍♀️</Text>
        <Text style={[styles.description, dynamic.description]}>・ 시작 버튼을 누르면 타이머가 바로 시작돼요.</Text>
        <Text style={[styles.description, dynamic.description]}>・ 앱을 강제로 종료하면 타이머가 초기화돼요.</Text>
        <Text style={[styles.description, dynamic.description]}>・ 다른 화면으로 나가면 타이머가 멈춰요.</Text>
        <Text style={[styles.description, dynamic.description]}>・ 시간이 다 지나고 완료 버튼을 꼭 눌러야 미션 성공으로 인정돼요. 🙌</Text>

        <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>오늘의 추천 플레이리스트 🎧</Text>

        <View style={[styles.youtubeWrapper, dynamic.youtubeWrapper]}>
          <YoutubePlayer
            height={dynamic.youtubeWrapper.height}
            width={dynamic.youtubeWrapper.width}
            videoId={mainVideo.id}
            play={false}
          />
        </View>

        {videoRecommendations.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={[styles.videoCard, dynamic.videoCard]}
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
          >
            <Image source={{ uri: video.thumbnail }} style={[styles.thumbnail, dynamic.thumbnail]} />
            <View style={styles.videoTextWrapper}>
              <Text numberOfLines={2} style={styles.videoTitle}>
                {video.title}
              </Text>
              <Text style={styles.videoMeta}>
                {video.channel} · {video.duration}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, dynamic.button, { backgroundColor: buttonColor }]}
        onPress={isMeditationDone ? handleComplete : startTimer}
        disabled={isRunning && !isMeditationDone}
      >
        <Text style={[styles.buttonText, dynamic.buttonText]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}
