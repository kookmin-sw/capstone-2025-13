import { useTensorflowModel } from 'react-native-fast-tflite';

const MODEL_PATH = require('../assets/models/emotion_model.tflite');

export const useEmotionModelRunner = () => {
  const { model, state } = useTensorflowModel(MODEL_PATH);
  const isReady = state === 'loaded' && model != null;

  const run = async (input: Float32Array): Promise<Float32Array[] | null> => {
    if (!isReady || !model) {
      console.warn('모델이 준비되지 않았습니다.');
      return null;
    }

    try {
      const output = await model.run([input]);
      return output as Float32Array[];
    } catch (err) {
      console.error('모델 실행 실패:', err);
      return null;
    }
  };

  return {
    isReady,
    run,
  };
};
