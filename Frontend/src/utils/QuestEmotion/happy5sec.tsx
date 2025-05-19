/**
 * 행복은 얼굴에서 시작돼요.
 * happy 상태가 5초간 유지되었는지 판정
 * @param log 최근 5초 동안의 예측 label 배열 (예: ["happy", "happy", ...])
 * @returns 조건 달성 여부
 */
export const checkHappy5Sec = (log: string[]): boolean => {
    const requiredLength = 5;
    if (log.length < requiredLength) return false;
  
    const recent = log.slice(-requiredLength);
    return recent.every(label => label === 'happy');
  };
  