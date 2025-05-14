import { StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { useLoadEmotionModel } from '../../hooks/useLoadEmotionModel';
import { shouldCaptureFace } from '../../utils/faceChecker';
import { EmotionModelRunner } from '../../utils/EmotionModelRun';
import { QUESTS } from '../../utils/QuestEmotion/quests';

export default function QuestEmotion() {
  const quest_name = 'happy5sec';
  const [emotionLog, setEmotionLog] = useState<string[]>([]);
  const device = useCameraDevice('front');
  const cameraRef = useRef<any>(null);
  const { detectFaces } = useFaceDetector();
  const [hasPermission, setHasPermission] = useState(false);
  const { isLoaded, model } = useLoadEmotionModel();

  // 타이밍 제어
  const lastPhotoTimeRef = useRef(0);
  const isPhotoTaken = useRef(false);
  const [photoPath, setPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

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

  const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    if (!faces?.length || !isLoaded || !model) return;
    const face = faces[0];
    const uri = await capturePhoto(face);
    if (!uri) return;

    console.log('✅ 감정 분석 요청됨:', { uri, face });
    const result = await EmotionModelRunner(uri, model);
    if (result) {
      const labels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
      const topIndex = result.indexOf(Math.max(...result));
      const predictedLabel = labels[topIndex];
      console.log('🧠 감정 예측 결과:', result);

      const updated = [...emotionLog, predictedLabel];
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

  if (!device || !hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>📷 카메라 준비 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        photo
        isActive
        frameProcessor={frameProcessor}
      />

      {photoPath && (
        <Image
          source={{ uri: photoPath }}
          style={styles.previewImage}
        />
      )}

      <View style={styles.logBox}>
        <Text style={styles.logText}>
          {emotionLog.slice(-5).join(' > ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logBox: {
    position: 'absolute', bottom: 20, right: 20,
    padding: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6,
  },
  logText: { color: 'white', fontSize: 12 },
  previewImage: {
    width: 150, height: 150,
    position: 'absolute', top: 60, right: 20,
    borderWidth: 1, borderColor: 'white',
  },
});
