export function checkSurpriseToSmile(log: string[]): { isSuccess: boolean; streakCount: number } {
  const surprised = log.slice(0, 3).every(label => label === 'Surprise');
  const smiling = log.slice(-2).some(label => label === 'Happy');
  const isSuccess = surprised && smiling;
  const streakCount = isSuccess ? 1 : 0; // or your own logic for streakCount
  return { isSuccess, streakCount };
}