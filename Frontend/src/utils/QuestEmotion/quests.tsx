import { checkHappy5Sec } from './happy5Sec';

/**
 * 하나의 감정 퀘스트 타입 정의
 */
export type EmotionQuest = {
  id: string;
  label: string;
  check: (log: string[]) => boolean;
};

/**
 * 퀘스트 목록 (여기에 원하는 퀘스트를 계속 추가하면 됨)
 */
export const QUESTS: EmotionQuest[] = [
  {
    id: 'happy5sec',
    label: '5초 간 웃어보기',
    check: checkHappy5Sec,
  },
];
