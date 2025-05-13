/**
 * 두려움을 인식하고, 스스로를 안심시켜보세요.
 * fear → happy or neutral 전환 퀘스트
 * @param log 최근 감정 log 배열 (예: ['fear', 'fear', 'fear', 'neutral', 'happy'])
 * @returns 조건 달성 여부
 */
export const checkFearToCalm = (log: string[]): boolean => {
    const fearful = log.slice(0, 3).every(label => label === 'fear');
    const calm = log.slice(-2).some(label => label === 'neutral' || label === 'happy');
    return fearful && calm;
  };
  