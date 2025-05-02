import type { RefObject } from 'react';

export const capturePhotoIfReady = async (
  cameraRef: RefObject<any>,
  isTakingRef: React.MutableRefObject<boolean>,
  setPhotoUri: (uri: string) => void,
  delayMs: number = 5000
): Promise<string | null> => {
  if (!cameraRef.current || isTakingRef.current === true) return null;

  try {
    isTakingRef.current = true;

    const photo = await cameraRef.current.takePhoto();
    const photoPath = `file://${photo.path}`;
    setPhotoUri(photoPath);

    return photoPath;
  } catch (err) {
    console.error('📸 촬영 실패:', err);
    return null;
  } finally {
    setTimeout(() => {
      isTakingRef.current = false;
    }, delayMs);
  }
};
