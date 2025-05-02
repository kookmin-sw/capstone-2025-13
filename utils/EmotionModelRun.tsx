/**
 * 감정 모델 실행 인터페이스
 * 모델은 Float32Array[] 입력을 받아 number[] 예측 결과를 반환함
 */
export interface EmotionModelRunner {
  run(input: [Float32Array]): Promise<number[]>;
}

/**
 * EmotionModelRunner를 실행하여 예측 결과를 반환
 * 실패 시 null 반환
 * @param model 감정 모델 객체
 * @param input 전처리된 입력 데이터
 * @returns 예측 결과 or null
 */
export const runEmotionModel = async (
  model: EmotionModelRunner,
  input: [Float32Array]
): Promise<number[] | null> => {
  try {
    const result = await model.run(input);
    return result as number[];
  } catch (err) {
    console.error('모델 실행 실패:', err instanceof Error ? err.message : err);
    return null;
  }
};