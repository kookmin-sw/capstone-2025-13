let consecutiveCount = 0;
const REQUIRED_COUNT = 5;

/**
 * 연속 감지된 happy 감정 횟수를 누적하고, 기준 이상일 때 true 반환
 * @param label 감정 예측 결과 (예: 'happy')
 * @param intervalMs 얼굴 감지 간격(ms)
 * @returns 퀘스트 완료 여부
 */
export const checkHappy5Sec = (label: string, intervalMs: number): boolean => {
  if (label === 'happy') {
    consecutiveCount++;
    if (consecutiveCount >= REQUIRED_COUNT) {
      resetHappyQuest();
      return true;
    }
  } else {
    consecutiveCount = 0;
  }
  return false;
};

export const resetHappyQuest = () => {
  consecutiveCount = 0;
};