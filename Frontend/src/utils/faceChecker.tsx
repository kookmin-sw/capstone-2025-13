import { Face } from 'react-native-vision-camera-face-detector';

export const shouldCaptureFace = (
  face: Face | undefined,
  lastPhotoTime: number,
  minWidth = 150,
  minHeight = 200,
): { isLargeEnough: boolean, now: number } => {
  if (!face) return {isLargeEnough:false, now:lastPhotoTime};

  const now = Date.now();
  const { width, height } = face.bounds;
  const isLargeEnough = width > minWidth && height > minHeight;
  console.log(width, height);
  if (!isLargeEnough) {
    console.log(`📏 얼굴 너무 작음`);
  }

  return {isLargeEnough, now};
};