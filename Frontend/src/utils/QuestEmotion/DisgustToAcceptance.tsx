/**
 * 모든 건 지나가요. 괜찮아질 거예요.
 * disgust → happy or neutral 전환 퀘스트
 * @param log 최근 감정 log 배열 (예: ['disgust', 'disgust', 'disgust', 'neutral', 'happy'])
 * @returns 조건 달성 여부
 */
export const checkDisgustToAcceptance = (log: string[]): boolean => {
    const disgusted = log.slice(0, 3).every(label => label === 'disgust');
    const accepted = log.slice(-2).some(label => label === 'neutral' || label === 'happy');
    return disgusted && accepted;
  };
  