import { checkHappy5Sec } from './happy5sec';
import { checkAngry3Sec } from './angry3sec';
import { checkFear3Sec } from './fear3sec';
import { checkSad3Sec } from './sad3sec';
import { checkSurprise5Sec } from './surprise5sec';
import { checkSurpriseToSmile } from './SurpriseToSmile';
import { checkEmotionCycleQuest } from './EmotionCycleQuest';

export type EmotionQuest = {
  id: string;
  interval?: number;
  logLength?: number;
  check: (log: string[]) => { isSuccess: boolean; streakCount: number };
};

/**
 * 퀘스트 목록
 */
export const QUESTS: EmotionQuest[] = [
  {
    id: '5초 간 웃어보기',
    interval: 1000,
    logLength: 10,
    check: checkHappy5Sec,
  },
  {
    id: '5초 간 놀라보기',
    interval: 1000,
    logLength: 10,
    check: checkSurprise5Sec,
  },
  {
    id: '3초 간 화나보기',
    interval: 1000,
    logLength: 10,
    check: checkAngry3Sec,
  },
  {
    id: '3초 간 슬퍼보기',
    interval: 1000,
    logLength: 10,
    check: checkSad3Sec,
  },
  {
    id: '3초 간 무서워보기',
    interval: 1000,
    logLength: 10,
    check: checkFear3Sec,
  },
  {
    id: '놀람에서 웃음으로',
    interval: 1000,
    logLength: 10,
    check: checkSurpriseToSmile,
  },
  {
    id: '표현 마스터',
    interval: 1000,
    logLength: 10,
    check: checkEmotionCycleQuest,
  },
];
