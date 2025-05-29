export const checkHappy5Sec = (
  log: string[]
): { isSuccess: boolean; streakCount: number } => {
  const requiredLength = 5;

  // 로그 길이가 5 미만이면 실패 처리
  if (log.length < requiredLength) {
    return { isSuccess: false, streakCount: 0 };
  }

  let streakCount = 0;

  // 로그를 뒤에서부터 탐색하여 happy가 연속된 개수 계산
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i] === 'Happy') {
      streakCount++;
    } else {
      break;
    }
  }

  const isSuccess = streakCount >= requiredLength;
  return { isSuccess, streakCount };
};

