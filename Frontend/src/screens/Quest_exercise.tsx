import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProgressChart } from 'react-native-chart-kit';
import RecommendationList from "../components/RecommendationList";
import { Pedometer } from 'expo-sensors';
import fonts from '../constants/fonts';

const { width } = Dimensions.get('window');

const mainVideo = {
  id: "5qap5aO4i9A",
  title: "[Playlist] 차분하게 즐기는 플레이리스트 | 인센스 음악 | WOODLAND Playlist",
};

const exerciseVideos = [
  {
    id: "bZkNtE6F3yQ",
    title: "운동 전 듣기 좋은 신나는 음악",
    channel: "Fit Beats",
    duration: "35:12",
    thumbnail: "https://img.youtube.com/vi/bZkNtE6F3yQ/0.jpg",
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

export default function QuestExercise() {
  const [steps, setSteps] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  // 권한 요청
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
    }
  };

  // 이미지 선택 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 걸음 수 추적
  useEffect(() => {
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('걸음 수 추적 불가', '이 기기는 걸음 수 추적을 지원하지 않습니다.');
        return;
      }

      // 오늘 자정부터 현재까지의 누적 걸음 수 받아오기
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const result = await Pedometer.getStepCountAsync(start, end);
      setSteps(result.steps);

      // 실시간 업데이트
      const subscription = Pedometer.watchStepCount((result) => {
        setSteps((prevSteps) => prevSteps + result.steps);
      });

      return () => subscription.remove();
    };

    subscribe();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>오늘의 미션 🔥</Text>
        <Text style={styles.mission}>10000걸음 걷기</Text>

        <View style={styles.chartContainer}>
          <ProgressChart
            data={{
              labels: ['걸음 수'],
              data: [Math.min(steps / 10000, 1)],
            }}
            width={width * 0.9}
            height={width * 0.6}
            strokeWidth={16}
            radius={width * 0.25}
            chartConfig={{
              backgroundColor: '#000',
              backgroundGradientFrom: '#000',
              backgroundGradientTo: '#000',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 61, 137, ${opacity})`,
              labelColor: () => '#fff',
            }}
            hideLegend={true}
            style={styles.progressChart}
          />
          <View style={styles.centerTextContainer}>
            <Text style={styles.stepCount}>{steps}</Text>
            <Text style={styles.stepGoal}>/ 10000 걸음</Text>
          </View>
        </View>

        <Text style={styles.sectionText}>오운완! 오늘 활동을 기록으로 남겨볼까? 💪</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.uploadText}>📷 사진 업로드하기</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.sectionTitle]}>오늘의 추천 플레이리스트 🎧</Text>

        <RecommendationList 
          title="추천 플레이리스트" 
          videos={exerciseVideos} 
          backgroundColor="#222" 
          width={width} 
          mainVideo={mainVideo}
        />
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.buttonText}>오늘 미션 끝!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: width * 0.25,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.045,
    marginTop: width * 0.03,
  },
  mission: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginVertical: width * 0.02,
  },
  progressChart: {
    alignSelf: 'center',
    marginTop: width * 0.05,
  },
  stepCount: {
    fontSize: width * 0.12,
    color: '#fff',
    fontWeight: 'bold',
  },
  stepGoal: {
    fontSize: width * 0.04,
    color: '#ccc',
  },
  sectionText: {
    color: '#fff',
    fontSize: width * 0.045,
    marginVertical: width * 0.04,
  },
  uploadBox: {
    backgroundColor: '#333',
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  uploadText: {
    color: '#ccc',
    fontSize: width * 0.04,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.05,
    right: width * 0.05,
  },
  sectionTitle: {
    fontFamily: fonts.laundryBold,
    top: 20,
    color: "#fff94f",
    alignSelf: "flex-start",
  },
  completeButton: {
    backgroundColor: '#FF3D89',
    borderRadius: 50,
    paddingVertical: width * 0.04,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: width * 0.05,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
});
