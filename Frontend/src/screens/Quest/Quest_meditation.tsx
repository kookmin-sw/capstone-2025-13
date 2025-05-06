import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, Alert } from "react-native";
import styles from "../../styles/questMeditationStyles";
import Youtube_playlist from "../../components/Youtube_playlist";
import { dynamic } from '../../styles/questMeditaionDynamicStyles';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";


export default function Quest_meditation() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isMeditationDone, setIsMeditationDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<any>>();

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

  const meditationVideos= [
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
    ? "#ff4f4f"
    : isRunning
      ? "#aaa"
      : "#6c63ff";

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
      <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start", // ← 중요: 왼쪽 정렬
    marginBottom: 20,
  }}
>
      {/* 뒤로 가기 버튼 */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Quest_stage", {
            title: "명상",
          });
        }}
      >
        <Ionicons name="arrow-back-circle" size={40} color="#6c63ff" />
      </TouchableOpacity>

      {/* 텍스트 묶음 */}
      <View style={{ marginLeft: 12 }}>
        <Text style={[styles.missionTitle, dynamic.missionTitle]}>
          오늘의 미션 🔥
        </Text>
        <Text style={[styles.mainText, dynamic.mainText]}>
          5분 간 명상하기
        </Text>
      </View>
    </View>


        {/* 타이머와 느낌표 아이콘을 같은 View 안에 배치 */}
        <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
          <Text style={[styles.timerText, dynamic.timerText]}>{formatTime(timeLeft)}</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "명상 타이머 설명",
                "・ 시작 버튼을 누르면 타이머가 바로 시작돼요.\n・ 앱을 강제로 종료하면 타이머가 초기화돼요.\n・ 다른 화면으로 나가면 타이머가 멈춰요.\n・ 시간이 다 지나고 완료 버튼을 꼭 눌러야 미션 성공으로 인정돼요. 🙌"
              )
            }
            style={{
              position: "absolute",
              right: width * 0.001,  // 화면 너비에 비례
              top: height * 0.01,  // 화면 높이에 비례
            }}
          >
            <Ionicons name="information-circle-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.warningTitle, dynamic.warningTitle]}>
          오늘의 명상 가이드 🧘🏻‍♀️
        </Text>

        <Text style={[styles.description, dynamic.description]}>・ 자연스럽게 들이쉬고 내쉬는 호흡에 집중하세요. </Text>
        <Text style={[styles.description, dynamic.description]}>・ 숨이 지나는 감각, 가슴이 움직이는 느낌에 주의해보세요.</Text>
        <Text style={[styles.description, dynamic.description]}>・ 생각이 떠오르면 판단하지 말고 다시 호흡으로 돌아옵니다</Text>

        <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>오늘의 추천 플레이리스트 🎧</Text>

        <Youtube_playlist 
          title="추천 플레이리스트" 
          videos={meditationVideos} 
          backgroundColor="#1a1a40" 
          width={width} 
          mainVideo={mainVideo}
        />
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
