import { useEffect } from 'react';
import { TensorflowModel, useTensorflowModel } from 'react-native-fast-tflite';

export const useLoadEmotionModel = () => {
  const { model, state } = useTensorflowModel(
    require('../assets/models/emotion_model.tflite')
  );
  const isLoaded = state === 'loaded' && model != null;

  useEffect(() => {
    if (state === 'error' || state === 'loading') {
      console.error('Emotion model load failed, state:', state);
    }
  }, [state]);

  return { isLoaded, model, state };
};
