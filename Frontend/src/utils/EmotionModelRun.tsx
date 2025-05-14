import { imageToGrayscale } from './EmotionPreprocess';
import { TensorflowModel } from 'react-native-fast-tflite';

export const EmotionModelRunner = async (
  uri: string,
  model: TensorflowModel
): Promise<Float32Array | null> => {
  try {
    const input = await imageToGrayscale(uri);
    const inputTensor = input[0];

    const result = await model.run([inputTensor]);
    const output = result?.[0];

    if (!output || !(output instanceof Float32Array)) {
      console.warn('❗ 모델 결과 없음 또는 잘못된 형식:', output);
      return null;
    }

    return output;
  } catch (err) {
    console.error('🧨 감정 분석 실패:', err);
    return null;
  }
};
