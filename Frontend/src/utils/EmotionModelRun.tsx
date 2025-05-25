import { imageToFloat32 } from './EmotionPreprocess';
import { TensorflowModel } from 'react-native-fast-tflite';

function softmax(logits: number[], T: number = 1.0): number[] {
  const scaled = logits.map(x => x / T);
  const maxLogit = Math.max(...scaled);
  const exps = scaled.map(x => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExps);
}

export const EmotionModelRunner = async (
  uri: string,
  model: TensorflowModel
): Promise<Float32Array | null> => {
  try {
    const inputTensor = await imageToFloat32(uri);

    console.log('예측시도');
    const result = await model.run([inputTensor]);
    const output = result?.[0] as Float32Array;

    if (!output || output.length !== 7) {
      console.warn('❗ 모델 결과 없음 또는 잘못된 형식:', output);
      return null;
    }

    const probs = softmax(Array.from(output));
    return new Float32Array(probs);
  } catch (err) {
    console.error('🧨 감정 분석 실패:', err);
    return null;
  }
};
