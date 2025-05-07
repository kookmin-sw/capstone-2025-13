import { StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Camera as VisionCamera, Frame, useCameraDevice } from 'react-native-vision-camera';
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { imageToGrayscale } from '../utils/EmotionPreprocess';
import { useEmotionModelRunner } from '../utils/EmotionModelRun';
import { useAutoCapture } from '../hooks/useEmotionCapture';
import { QUESTS } from '../utils/QuestEmotion/quests';

export default function QuestEmotion() {
  const device = useCameraDevice('front');
  const cameraRef = useRef<any>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [emotionLog, setEmotionLog] = useState<string[]>([]); // ✅ 감정 로그
  const isPhotoTaken = useRef(false);
  const lastDetectedFaces = useRef<Face[]>([]);

  const { isReady, run } = useEmotionModelRunner();

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'accurate',
    classificationMode: 'none',
    landmarkMode: 'all',
  }).current;

  useEffect(() => {
    (async () => {
      const status = await VisionCamera.requestCameraPermission();
      console.log('permission:', status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetection = (faces: Face[], frame: Frame) => {
    lastDetectedFaces.current = faces;
  };

  const capturePhoto = useCallback(async () => {
    if (cameraRef.current && !isPhotoTaken.current && isReady) {
      try {
        isPhotoTaken.current = true;
        const photo = await cameraRef.current.takePhoto();
        const photoPath = `file://${photo.path}`;
        setPhotoUri(photoPath);

        const input = await imageToGrayscale(photoPath);
        const result = await run(input[0]);

        if (result && result[0]) {
          const labels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
          const probabilities = result[0];
          const topIndex = probabilities.indexOf(Math.max(...probabilities));
          const predictedLabel = labels[topIndex];
        
          console.log('예측 라벨:', predictedLabel);
        
          setEmotionLog(prev => {
            const updated = [...prev, predictedLabel];
            if (updated.length > 20) updated.shift();
            return updated;
          });
        
          QUESTS.forEach(({ id, label, check }) => {
            const cleared = check([...emotionLog, predictedLabel]);
            if (cleared) {
              console.log(`🎯 퀘스트 완료: ${label}`);
            }
          });
        }

        setTimeout(() => {
          isPhotoTaken.current = false;
        }, 1000);
      } catch (err) {
        console.error('take a photo error:', err);
        isPhotoTaken.current = false;
      }
    }
  }, [run, isReady, emotionLog]);

  // 자동 캡처 실행
  useAutoCapture(lastDetectedFaces, isPhotoTaken, capturePhoto);

  if (!device || !hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>No Camera Device or Permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        faceDetectionCallback={handleFacesDetection}
        faceDetectionOptions={faceDetectionOptions}
      />

      {photoUri && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* 최근 감정 로그 확인용 (디버깅용) */}
      <View style={styles.logBox}>
        <Text style={styles.logText}>
          {emotionLog.slice(-5).join(' > ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 100,
    height: 130,
    backgroundColor: 'black',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
    zIndex: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  logBox: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
  },
  logText: {
    color: 'white',
    fontSize: 12,
  },
});
