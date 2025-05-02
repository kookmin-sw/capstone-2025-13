import { StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Camera as VisionCamera, Frame, useCameraDevice } from 'react-native-vision-camera';
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';

import { capturePhotoIfReady } from '../utils/CapturePhoto';
import { useEmotionModel } from '../hooks/useEmotionModel';
import { imageToGrayscale } from '../utils/EmotionPreprocess';
import { runEmotionModel } from '../utils/EmotionModelRun';
import { checkHappy5Sec } from '../utils/emotion_quests/happy5Sec';

export default function App() {
  const device = useCameraDevice('front');
  const cameraRef = useRef<any>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const isPhotoTaken = useRef(false);
  const lastDetectedFaces = useRef<Face[]>([]);

  const { model, isReady } = useEmotionModel();

  const faceDetectionOptions: FaceDetectionOptions = {
    performanceMode: 'accurate',
    classificationMode: 'none',
    landmarkMode: 'all',
  };

  useEffect(() => {
    (async () => {
      const status = await VisionCamera.requestCameraPermission();
      console.log('권한 상태:', status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetection = (faces: Face[], frame: Frame) => {
    lastDetectedFaces.current = faces;
  };

  const quest_function = checkHappy5Sec

  const facedetection = useCallback(async () => {
    const uri = await capturePhotoIfReady(cameraRef, isPhotoTaken, setPhotoUri, quest_function.phototime);
    if (uri) {
      console.log('✅ 사진 촬영 성공:', uri);

      const input = await imageToGrayscale(uri);
      const result = await runEmotionModel(model, input);
      if (result) {
        quest_result = quest_function.check(label);
      }
    }
  }, [cameraRef, isPhotoTaken, model]);
  return quest_result;

  useEffect(() => {
    const interval = setInterval(() => {
      const faces = lastDetectedFaces.current;

      if (!faces[0] || isPhotoTaken.current) {
        console.log('⏳ 얼굴 없음 또는 대기 중');
        return;
      }

      const { width, height } = faces[0].bounds;

      if (width > 150 && height > 200) {
        console.log('✅ 얼굴 크기 충분함 → 촬영');
        facedetection();
      } else {
        console.log('⚠️ 얼굴 작음 → 무시');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [facedetection]);

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
});
