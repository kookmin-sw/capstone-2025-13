import { checkHappy5Sec } from './happy5sec';
import { checkAngryToRelax } from './AngryToRelax';
import { checkDisgustToAcceptance } from './DisgustToAcceptance';
import { checkFearToCalm } from './FearToCalm';
import { checkSadToWarm } from './SadToWarm';
import { checkSurpriseToSmile } from './SurpriseToSmile';
import { checkEmotionCycleQuest } from './EmotionCycleQuest';

export type EmotionQuest = {
  id: string;
  label: string;
  interval?: number;
  logLength?: number;
  check: (log: string[]) => boolean;
};

/**
 * 퀘스트 목록
 */
export const QUESTS: EmotionQuest[] = [
  {
    id: 'angryToRelax',
    label: '화났다가 풀어보기',
    check: checkAngryToRelax,
  },
  {
    id: 'disgustToAcceptance',
    label: '싫음을 받아들이기',
    check: checkDisgustToAcceptance,
  },
  {
    id: 'fearToCalm',
    label: '두려움에서 안정 찾기',
    check: checkFearToCalm,
  },
  {
    id: 'happy5sec',
    label: '5초 간 웃어보기',
    interval: 2000,
    logLength: 10,
    check: checkHappy5Sec,
  },
  {
    id: 'sadToWarm',
    label: '슬픔에서 따뜻함으로',
    check: checkSadToWarm,
  },
  {
    id: 'surpriseToSmile',
    label: '놀람에서 웃음으로',
    check: checkSurpriseToSmile,
  },
  {
    id: 'emotionCycleQuest',
    label: '감정 순환 마스터',
    check: checkEmotionCycleQuest,
  },
];
