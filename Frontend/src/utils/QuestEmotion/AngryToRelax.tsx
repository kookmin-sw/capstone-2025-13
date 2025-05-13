/**
 * 화를 낼 수도 있지만, 다시 웃을 수도 있어요.
 * angry → happy 전환 퀘스트
 * @param log 최근 감정 log 배열 (예: ['angry', 'angry', 'angry', 'neutral', 'happy'])
 * @returns 조건 달성 여부
 */
export const checkAngryToRelax = (log: string[]): boolean => {
    const angryPhase = log.slice(0, 3).every(label => label === 'angry');
  
    const recent = log.slice(-2);
    const onlyRelaxEmotion = recent.every(label => label === 'happy' || label === 'neutral');
    const hasHappy = recent.includes('happy');
  
    return angryPhase && onlyRelaxEmotion && hasHappy;
  };
  