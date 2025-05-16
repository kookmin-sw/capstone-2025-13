import { StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { useLoadEmotionModel } from '../../hooks/useLoadEmotionModel';
import { shouldCaptureFace } from '../../utils/faceChecker';
import { EmotionModelRunner } from '../../utils/EmotionModelRun';
import { QUESTS } from '../../utils/QuestEmotion/quests';

import EmotionChartBox from '../../components/Quest_emotionBox';
import styles from '../../styles/questEmotionStyles';

export default function QuestEmotion() {
  const [emotionLog, setEmotionLog] = useState<string[]>([]);
  const device = useCameraDevice('front');
  const cameraRef = useRef<any>(null);
  const { detectFaces } = useFaceDetector();
  const [hasPermission, setHasPermission] = useState(false);
  const { isLoaded, model } = useLoadEmotionModel();

  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<number[] | null>(null);

  // 타이밍 제어
  const lastPhotoTimeRef = useRef(0);
  const isPhotoTaken = useRef(false);
  
  const quest_name = '5초 간 웃어보기';
  const quest = QUESTS.find(q => q.id === quest_name);
  if (!quest) {
    return (
      <View style={styles.centered}>
        <Text>❌ 퀘스트 정보를 찾을 수 없습니다</Text>
      </View>
    );
  }

  const quest_capture_interval = quest.interval ?? 1000;
  const quest_save_pre_log = quest.logLength ?? 20;

  const capturePhoto = async (face: Face | undefined) => {
    if (isPhotoTaken.current) return null;
    isPhotoTaken.current = true;

    const now = Date.now();
    const { isLargeEnough, now: checkedTime } = shouldCaptureFace(face, lastPhotoTimeRef.current);
    if (!isLargeEnough || now - lastPhotoTimeRef.current < quest_capture_interval) {
      isPhotoTaken.current = false;
      return null;
    }

    try {
      const photo = await cameraRef.current.takePhoto();
      const path = `file://${photo.path}`;
      setPhotoPath(path);
      console.log('📸 사진 저장됨:', path);
      lastPhotoTimeRef.current = checkedTime;
      return path;
    } catch (err) {
      console.error('❌ 사진 캡처 실패:', err);
      return null;
    } finally {
      isPhotoTaken.current = false;
      console.log('🔄 isPhotoTaken reset');
    }
  };

  const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    if (!faces?.length || !isLoaded || !model) return;
    const face = faces[0];
    const uri = await capturePhoto(face);
    if (!uri) return;

    const result = await EmotionModelRunner(uri, model);
    if (result) {
      const labels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
      const topIndex = result.indexOf(Math.max(...result));
      const predictedLabel = labels[topIndex];
      const updated = [...emotionLog, predictedLabel];
      setLatestResult(Array.from(result));

      if (updated.length > quest_save_pre_log) updated.shift();
      setEmotionLog(updated);

      if (quest.check(updated)) {
        console.log('🎯 퀘스트 완료');
      }
    }
  });

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const now = Date.now();
    const last = (globalThis as any).lastProcessTime ?? 0;
    if (now - last < quest_capture_interval) return;
    (globalThis as any).lastProcessTime = now;

    const faces = detectFaces(frame);
    handleDetectedFaces(faces);
  }, [handleDetectedFaces]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (!device || !hasPermission) {
    return (
        <View style={styles.centered}>
          <Text>📷 카메라 준비 중...</Text>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <View style={styles.half}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          photo
          isActive
          frameProcessor={frameProcessor}
        />
      </View>

      <View style={[styles.half, styles.bottom]}>
        {latestResult && <EmotionChartBox result={latestResult} />}
      </View>
    </View>
  );
}
