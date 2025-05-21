/**
 * 슬픔도 미소로 안을 수 있어요.
 * sad → happy 전환 퀘스트
 * @param log 최근 감정 log 배열 (예: ['sad', 'sad', 'sad', 'neutral', 'happy'])
 * @returns 조건 달성 여부
 */
export const checkSadToWarm = (log: string[]): boolean => {
    const sadPhase = log.slice(0, 3).every(label => label === 'sad');

    const recent = log.slice(-2);
    const onlyRelaxEmotion = recent.every(label => label === 'happy' || label === 'neutral');
    const hasHappy = recent.includes('happy');
    return sadPhase && onlyRelaxEmotion && hasHappy;
  };
  