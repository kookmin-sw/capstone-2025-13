import { TensorflowModel } from 'react-native-fast-tflite';

function softmax(logits: number[], T: number = 1.0): number[] {
  const scaled = logits.map(x => x / T);
  const maxLogit = Math.max(...scaled);
  const exps = scaled.map(x => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExps);
}

export async function runTFLiteModel(
  input: Float32Array,
  model: TensorflowModel
): Promise<number[] | null> {
  try {
    const result = await model.run([input]); // ✅ await로 Promise 해제
    const output = result?.[0] as Float32Array;

    if (!output || output.length !== 7) {
      console.warn('❗ 모델 출력 오류:', output);
      return null;
    }

    const probs = softmax(Array.from(output));
    return probs;
  } catch (err) {
    console.error('🧨 모델 실행 실패:', err);
    return null;
  }
}

