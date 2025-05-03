import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProgressChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function QuestExercise() {
  const [steps, setSteps] = useState(7342); // 샘플 데이터
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
      return;
    }

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>오늘의 미션 🔥</Text>
        <Text style={styles.mission}>10000걸음 걷기</Text>


        <View style={styles.chartContainer}>
        <ProgressChart
            data={{
            labels: ['걸음 수'],
            data: [steps / 10000],
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

        <Text style={styles.sectionText}>오늘의 추천 플레이리스트 🎧</Text>
        <View style={styles.videoCard}>
          <Text style={styles.videoTitle}>[PLAYLIST] 명상하며 들으면 마음 🧘</Text>
          <Text style={styles.videoDesc}>명상공간MeditationGeneral</Text>
          <View style={styles.youtubeStub}>
            <Text style={{ color: '#fff' }}>YouTube Stub</Text>
          </View>
        </View>

        <Text style={styles.sectionText}>아니면 이런 콘텐츠들은 어때? 😺</Text>
        <View style={styles.videoCard}><Text style={{ color: '#fff' }}>콘텐츠 카드 1</Text></View>
        <View style={styles.videoCard}><Text style={{ color: '#fff' }}>콘텐츠 카드 2</Text></View>
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
  stepTextContainer: {
    alignItems: 'center',
    marginTop: -30,
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
  videoCard: {
    backgroundColor: '#1a1a1a',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: width * 0.03,
  },
  videoTitle: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  videoDesc: {
    color: '#ccc',
    fontSize: width * 0.035,
    marginBottom: width * 0.02,
  },
  youtubeStub: {
    height: width * 0.5,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.05,
    right: width * 0.05,
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
