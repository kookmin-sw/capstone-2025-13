import { useEffect } from 'react';
import { Face } from 'react-native-vision-camera-face-detector';

export const useAutoCapture = (
  lastFacesRef: React.MutableRefObject<Face[]>,
  isPhotoTakenRef: React.MutableRefObject<boolean>,
  onCapture: () => void,
  intervalMs: number = 1000
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const face = lastFacesRef.current[0];
      if (!face || isPhotoTakenRef.current) {
        return;
      }

      const { width, height } = face.bounds;
      if (width > 150 && height > 200) {
        console.log('face detected: capturing...');
        onCapture();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [onCapture]);
};
