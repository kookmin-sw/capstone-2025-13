import React, { useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar';
import styles from '../styles/questEmotionChartStyles';

// 1) Props 타입 정의: result 배열을 전달받습니다
interface EmotionMissionCardProps {
  result: number[];
  success: boolean;
  nickname: string;
  questDescription: string;
}

// 2) 감정 라벨 및 컬러 매핑
const labels = ["Happy", "Surprise", "Angry", "Sad", "Disgust", "Fear", "Neutral"]
const colors: Record<string, string> = {
  Angry: '#ff4444',
  Disgust: '#ff4444',
  Fear: '#ff4444',
  Happy: '#00C851',
  Sad: '#ff4444',
  Surprise: '#00C851',
  Neutral: '#00C851',
};

export default function EmotionMissionCard({ result, success, nickname, questDescription }: EmotionMissionCardProps) {
  
  useEffect(()=>{
console.log(success)
  },[success])
  return (
        <View style={styles.dialogueBox}>
            <View style={styles.nametag}>
                <Text style={styles.nametagText}>{nickname}</Text>
            </View>
            <View style={styles.dialogueTextBox}>
                <View style={styles.list}>
                {result.map((progress, index) => {
                  const label = labels[index] || 'unknown';
                  const color = colors[label] || '#00C851';

                  return (
                    <View key={label} style={styles.row}>
                      <Text style={[styles.label, { color }]}>{label}</Text>
                      <View style={styles.barWrapper}>
                        <ProgressBar progress={progress} />
                      </View>
                    </View>
                  );
                })}
              </View>  
              <TouchableOpacity
                style={[
                  styles.button,
                  !success && { backgroundColor: '#ccc' },
                ]}
                disabled={!success} 
              >
                <Text style={styles.buttonText}>
                  {success ? '오늘 미션 완료!' : questDescription}
                </Text>
              </TouchableOpacity>
            </View>
       
            
        </View> 
  );
}
