import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import ImageEditor from '@react-native-community/image-editor';

import { useLoadEmotionModel } from '../../hooks/useLoadEmotionModel';
import { shouldCaptureFace } from '../../utils/faceChecker';
import { EmotionModelRunner } from '../../utils/EmotionModelRun';
import { QUESTS } from '../../utils/QuestEmotion/quests';

import EmotionChartBox from '../../components/Quest_emotionBox';
import styles from '../../styles/questEmotionStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuestEmotion() {
  const [emotionLog, setEmotionLog] = useState<string[]>([]);
  const device = useCameraDevice('front');
  const cameraRef = useRef<any>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const { isLoaded, model } = useLoadEmotionModel();
  const [noFaceWarning, setNoFaceWarning] = useState(false);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<number[] | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const lastPhotoTimeRef = useRef(0);
  const isPhotoTaken = useRef(false);
  
  const cameraHeight = screenHeight * 0.7;
  const { detectFaces } = useFaceDetector({
    autoMode: true,
    windowWidth: screenWidth,
    windowHeight: cameraHeight,
    performanceMode: 'accurate',
  });

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
      const fullPath = `file://${photo.path}`;

      const { x, y, width, height } = (face as any).bounds;
      const scaleX = photo.width / screenWidth;
      const scaleY = photo.height / cameraHeight;

      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      const bufferX = scaledWidth * 0.2;
      const bufferY = scaledHeight * 0.2;

      const cropData = {
        offset: {
          x: Math.max(0, scaledX - bufferX),
          y: Math.max(0, scaledY - bufferY),
        },
        size: {
          width: scaledWidth + bufferX * 2,
          height: scaledHeight + bufferY * 2,
        },
        displaySize: {
          width: scaledWidth + bufferX * 2,
          height: scaledHeight + bufferY * 2,
        },
        resizeMode: 'contain' as const,
      };

      const cropped = await ImageEditor.cropImage(fullPath, cropData);
      setPhotoPath(cropped.uri);
      console.log('📸 얼굴 크롭 저장됨:', cropped.uri);

      lastPhotoTimeRef.current = checkedTime;
      return cropped.uri;
    } catch (err) {
      console.error('❌ 얼굴 크롭 캡처 실패:', err);
      return null;
    } finally {
      isPhotoTaken.current = false;
      (globalThis as any).isPhotoTaken = false;
      console.log('🔄 isPhotoTaken reset');
    }
  };

  const handleDetectedFaces = useMemo(
    () =>
      Worklets.createRunOnJS(async (faces: Face[]) => {
        if (!faces || faces.length === 0) {
          setNoFaceWarning(true);
          return;
        }
        setNoFaceWarning(false);

        if (!isLoaded || !model) return;

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
              console.log('Predicted Label:', predictedLabel);

              if (updated.length > quest_save_pre_log) updated.shift();
              setEmotionLog(updated);

              if (quest.check(updated)) {
                setSuccess(true);
                console.log('🎯 퀘스트 완료');
              }
            }
          }),
        [isLoaded, model, emotionLog]
      );

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    if ((globalThis as any).isPhotoTaken) return;

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
    <View style={[styles.half, { flex: 1 }]}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        photo
        isActive
        frameProcessor={frameProcessor}
      />
    </View>

    {photoPath && (
      <View style={{
        position: 'absolute',
        top: 10,
        left: 10,
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: '#000000aa',
      }}>
        <Image
          source={{ uri: photoPath }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>
    )}

    {latestResult !== null ? (
      <View style={styles.overlay}>
        <EmotionChartBox result={latestResult} success={success} />
      </View>
    ) : (
      <View style={styles.overlay}>
        <View style={styles.centered}>
          <Text style={styles.warningText}>⚠️ 얼굴이 감지되지 않았습니다</Text>
        </View>
      </View>
    )}
  </View>
)};
