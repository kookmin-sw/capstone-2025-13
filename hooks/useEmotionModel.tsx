import { useTensorflowModel } from 'react-native-fast-tflite';

const MODEL_PATH = require('../assets/models/EmotionModel.tflite');

/**
 * 감정 인식 모델 로딩 & 로딩 상태와 실행 준비 여부를 반환
 * @returns model (TFLite 인스턴스), isReady (실행 가능 여부)
 */
export const useEmotionModel = () => {
  const { model, state } = useTensorflowModel(MODEL_PATH);

  const isReady = state === 'loaded' && model != null;

  return {
    model,
    isReady,
  };
};