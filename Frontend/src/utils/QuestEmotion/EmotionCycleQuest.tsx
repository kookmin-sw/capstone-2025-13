/**
 * 감정 5가지 이상 등장했는지 체크하되,
 * 같은 감정은 최대 2번까지만 카운트
 * 마지막 2개 감정은 반드시 'happy'
 * @param log 최근 감정 log 배열 (예: ['angry', 'fear', 'surprise', 'surprise', 'happy', 'happy'])
 * @returns 조건 달성 여부
 */
const expectedEmotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise'];

export const checkEmotionCycleQuest = (log: string[]): boolean => {
  const recent = log.slice(-20);

  const emotionCount: Record<string, number> = {};
  for (const label of recent) {
    if (!expectedEmotions.includes(label)) continue;

    if (!emotionCount[label]) {
      emotionCount[label] = 1;
    } else if (emotionCount[label] < 2) {
      emotionCount[label]++;
    }
  }

  const distinctEmotionCount = Object.keys(emotionCount).length;

  const lastTwo = log.slice(-2);
  const isFinalHappy = lastTwo.length === 2 && lastTwo.every(label => label === 'happy');

  return distinctEmotionCount >= 5 && isFinalHappy;
};