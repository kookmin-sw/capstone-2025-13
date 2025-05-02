import { StyleSheet, Text, View, Image } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Camera as VisionCamera, Frame, useCameraDevice } from 'react-native-vision-camera';
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { useTensorflowModel } from 'react-native-fast-tflite';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

export default function App() {
  const device = useCameraDevice('front');
  const cameraRef = useRef<any>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const isPhotoTaken = useRef(false);
  const lastDetectedFaces = useRef<Face[]>([]);

  const plugin = useTensorflowModel(require('./asset/models/emotion_model.tflite'));

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'accurate',
    classificationMode: 'none',
    landmarkMode: 'all',
  }).current;

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

  const preprocessImageToGrayscale = async (uri: string) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        uri,
        48,
        48,
        'PNG',
        100,
        0,
        undefined,
        false,
        { mode: 'contain' }
      );
  
      const base64 = await RNFS.readFile(resized.uri, 'base64');
      const binary = atob(base64);
      const grayscale = new Float32Array(48 * 48);
  
      for (let i = 0, j = 0; i < binary.length && j < grayscale.length; i += 4, j++) {
        const r = binary.charCodeAt(i);
        const g = binary.charCodeAt(i + 1);
        const b = binary.charCodeAt(i + 2);
        const gray = (r + g + b) / 3 / 255;
        grayscale[j] = gray;
      }
  
      return [grayscale];
    } catch (err) {
      console.error('이미지 전처리 실패:', err);
      return [new Float32Array(48 * 48)]; // fallback
    }
  };

  const capturePhoto = useCallback(async () => {
    if (cameraRef.current && !isPhotoTaken.current && plugin.state === 'loaded') {
      try {
        isPhotoTaken.current = true;
        const photo = await cameraRef.current.takePhoto();
        const photoPath = `file://${photo.path}`;
        setPhotoUri(photoPath);

        const input = await preprocessImageToGrayscale(photoPath);

        const result = await plugin.model.run(input);

        console.log('🧠 예측 결과:', result);

        setTimeout(() => {
          isPhotoTaken.current = false;
        }, 5000);
      } catch (err) {
        console.error('📸 촬영 실패:', err);
        isPhotoTaken.current = false;
      }
    }
  }, [plugin]);

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
        capturePhoto();
      } else {
        console.log('⚠️ 얼굴 작음 → 무시');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [capturePhoto]);

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
