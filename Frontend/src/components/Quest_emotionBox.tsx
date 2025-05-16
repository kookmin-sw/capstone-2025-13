import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar';
import styles from '../styles/questEmotionChart';

// 1) Props 타입 정의: result 배열을 전달받습니다
interface EmotionMissionCardProps {
  result: number[];
}

// 2) 감정 라벨 및 컬러 매핑
const labels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
const colors: Record<string, string> = {
  angry: '#ff4444',
  disgust: '#ff4444',
  fear: '#ff4444',
  happy: '#00C851',
  sad: '#ff4444',
  surprise: '#00C851',
  neutral: '#00C851',
};

export default function EmotionMissionCard({ result }: EmotionMissionCardProps) {
  return (
    <ImageBackground
      source={require('../assets/Images/emotion_chart.png')}
      style={styles.card}
    >
      <Text style={styles.title}>구슬이</Text>
      <View style={styles.list}>
        {result.map((progress, index) => {
          const label = labels[index] || 'unknown';
          const color = colors[label] || '#00C851';

          return (
            <View key={label} style={styles.row}>
              <Text style={[styles.label, { color }]}>{labels}</Text>
              <View style={styles.barWrapper}>
                <ProgressBar progress={progress} />
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>오늘 미션 완료!</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
