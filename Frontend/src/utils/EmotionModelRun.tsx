import { imageToGrayscale } from './EmotionPreprocess';
import { TensorflowModel } from 'react-native-fast-tflite';

export const EmotionModelRunner = async (
  uri: string,
  model: TensorflowModel
): Promise<Float32Array | null> => {
  try {
    console.log('🚀 모델 분석 시작 중...');
    const input = await imageToGrayscale(uri);

    console.log('📦 전처리된 input 샘플:', input[0].slice(0, 10));
    const result = await model.run(input);

    if (!result || !result[0]) {
      console.warn('❗ 모델 결과 없음:', result);
      return null;
    }

    return result[0] as Float32Array;
  } catch (err) {
    console.error('🧨 감정 분석 실패:', err);
    return null;
  }
};
