/**
 * 모든 감정은 결국 행복으로 이어질 수 있어요.
 * surprise → happy 전환 퀘스트
 * @param log 최근 감정 log 배열 (예: ['surprise', 'surprise', 'surprise', 'happy', 'happy'])
 * @returns 조건 달성 여부
 */
export const checkSurpriseToSmile = (log: string[]): boolean => {
    const surprised = log.slice(0, 3).every(label => label === 'surprise');
    const smiling = log.slice(-2).some(label => label === 'happy');
    return surprised && smiling;
  };