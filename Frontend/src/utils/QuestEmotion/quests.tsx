import { checkHappy5Sec } from './happy5sec';
import { checkAngryToRelax } from './AngryToRelax';
import { checkDisgustToAcceptance } from './DisgustToAcceptance';
import { checkFearToCalm } from './FearToCalm';
import { checkSadToWarm } from './SadToWarm';
import { checkSurpriseToSmile } from './SurpriseToSmile';
import { checkEmotionCycleQuest } from './EmotionCycleQuest';

export type EmotionQuest = {
  id: string;
  interval?: number;
  logLength?: number;
  check: (log: string[]) => boolean;
};

/**
 * 퀘스트 목록
 */
export const QUESTS: EmotionQuest[] = [
  {
    id: '화났다가 풀어보기',
    interval: 1000,
    logLength: 10,
    check: checkAngryToRelax,
  },
  {
    id: '싫음을 받아들이기',
    interval: 1000,
    logLength: 10,
    check: checkDisgustToAcceptance,
  },
  {
    id: '두려움에서 안정 찾기',
    interval: 1000,
    logLength: 10,
    check: checkFearToCalm,
  },
  {
    id: '5초 간 웃어보기',
    interval: 1000,
    logLength: 10,
    check: checkHappy5Sec,
  },
  {
    id: '슬픔에서 따뜻함으로',
    interval: 1000,
    logLength: 10,
    check: checkSadToWarm,
  },
  {
    id: '놀람에서 웃음으로',
    interval: 1000,
    logLength: 10,
    check: checkSurpriseToSmile,
  },
  {
    id: '감정 순환 마스터',
    interval: 1000,
    logLength: 10,
    check: checkEmotionCycleQuest,
  },
];
