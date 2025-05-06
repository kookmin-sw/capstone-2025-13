import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Dimensions, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProgressChart } from 'react-native-chart-kit';
import Youtube_playlist from "../../components/Youtube_playlist";
import { Pedometer } from 'expo-sensors';
import { dynamic } from '../../styles/questExerciseDynamicStyles';
import { styles } from '../../styles/questExerciseStyles';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

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
  const navigation = useNavigation<NavigationProp<any>>();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
    }
  };

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

  useEffect(() => {
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('걸음 수 추적 불가', '이 기기는 걸음 수 추적을 지원하지 않습니다.');
        return;
      }

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const result = await Pedometer.getStepCountAsync(start, end);
      setSteps(result.steps);

      const subscription = Pedometer.watchStepCount((result) => {
        setSteps((prevSteps) => prevSteps + result.steps);
      });

      return () => subscription.remove();
    };

    subscribe();
  }, []);

  return (
    <View style={styles.container}>
       <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        overScrollMode="never"
      >
      <View style={styles.backButtonWrapper}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Quest_stage", {
            title: "운동",
          });
        }}
      >
        <Ionicons name="arrow-back-circle" size={40} color="#FF6188" />
      </TouchableOpacity>

      <View>
        <Text style={[dynamic.missionTitle, styles.title]}>
          오늘의 미션 🔥
        </Text>
        <Text style={[dynamic.mainText, styles.mission]}>
          10000걸음 걷기
        </Text>
      </View>
    </View>

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
            <Text style={dynamic.stepCount}>{steps}</Text>
            <Text style={dynamic.stepGoal}>/ 10000 걸음</Text>
          </View>
        </View>

        <Text style={[styles.sectionText, dynamic.missionTitle]}>
          오운완! 오늘 활동을 기록으로 남겨볼까? 💪
        </Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <Text style={[styles.uploadText, dynamic.uploadText]}>📷 사진 업로드하기</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>
          오늘의 추천 플레이리스트 🎧
        </Text>

        <Youtube_playlist 
          title="추천 플레이리스트"
          videos={exerciseVideos}
          backgroundColor="#222"
          width={width}
          mainVideo={mainVideo}
        />
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.completeButton}>
           <Text style={[dynamic.buttonText]}>오늘 미션 끝!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}