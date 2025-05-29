import { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, Alert } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor, Frame, runAtTargetFps } from 'react-native-vision-camera';
import type { FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { useLoadEmotionModel } from '../../hooks/useLoadEmotionModel';
import { cropFaces } from '../../plugins/cropFaces'
import { runTFLiteModelRunner } from '../../utils/EmotionModelRun';
import { QUESTS } from '../../utils/QuestEmotion/quests';

import EmotionChartBox from "../../components/Quest_emotionBox";
import styles from "../../styles/questEmotionStyles";
import {
    NavigationProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import customAxios from "../../API/axios";
import { getCoupon } from "../../API/potAPI";

type RouteParams = {
    questTitle: string;
    questDescription: string;
    questTarget: number;
    nickname: string;
};

export default function QuestEmotion() {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const { questTitle, questDescription, nickname } =
        route.params as RouteParams;

    const [emotionLog, setEmotionLog] = useState<string[]>([]);
    const [hasPermission, setHasPermission] = useState(false);
    const [noFaceWarning, setNoFaceWarning] = useState(false);
    const [latestResult, setLatestResult] = useState<number[] | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isActive, setIsActive] = useState(true);

    const device = useCameraDevice('front');
    const { isLoaded, model } = useLoadEmotionModel();
    const cameraRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      timerRef.current = setTimeout(() => {
        if (!success) {
          setIsActive(false);
          Alert.alert(
            "실패",
            "30초 안에 퀘스트를 완료하지 못했어요. 😢",
            [
              {
                text: "확인",
                onPress: () => navigation.goBack(), 
              },
            ]
          );
        }
      }, 20 * 1000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
    if (success && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [success]);

    const faceDetectorOptions: FaceDetectionOptions = {
      performanceMode: 'accurate',
      landmarkMode: 'none',
      contourMode: 'none',
      classificationMode: 'none',
      minFaceSize: 0.2,
      trackingEnabled: false,
      autoMode: false, // 프레임 기준 좌표 사용
    };
    const { detectFaces } = useFaceDetector(faceDetectorOptions);

    const quest = QUESTS.find(q => q.id === questTitle);
    const quest_capture_interval = quest?.interval ?? 2000;
    const quest_save_pre_log = quest?.logLength ?? 20;
    
    const handleComplete = async () => {
        try {
            const type = "EMOTION";
            const response = await customAxios.get(`/quests/last/${type}`);
            const lastDataID = response.data.data.id;

            const postRes = await customAxios.post("/quests", {
                id: lastDataID,
                current: 0,
                status: "COMPLETED",
            });

            if (postRes.status === 200 || postRes.status === 201) {
                await getCoupon();
                Alert.alert(
                    "완료!",
                    "감정 퀘스트가 성공적으로 완료되었어요! 🎉",
                    [
                        {
                            text: "확인",
                            onPress: () =>
                                navigation.navigate("Quest_stage", {
                                    title: `${nickname}의 숲`,
                                }),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "오류",
                    "감정 퀘스트 완료 처리 중 문제가 발생했어요."
                );
            }
        } catch (error) {
            console.error("감정 퀘스트 완료 처리 중 오류 발생:", error);
            Alert.alert("오류", "서버 통신 중 문제가 발생했어요.");
        }
    };  

    const handleFaceStatus = useCallback((hasFace: boolean) => {
        setNoFaceWarning(!hasFace);
    }, []);

   const handleDetectedResult = useCallback(
    Worklets.createRunOnJS(async (pluginResult: number[]) => {
      if (!isLoaded || !model) {
        console.log('❌ 모델 로드 안됨');
        return;
      }
      if ((globalThis as any).isPredictingNow) return;
      (globalThis as any).isPredictingNow = true;
      const input = new Float32Array(pluginResult);
      try {
        const result = await runTFLiteModelRunner(input, model);
        if (result) {
          const labels = ['Happy', 'Surprise', 'Angry', 'Sad', 'Disgust', 'Fear', 'Neutral'];
          const topIndex = result.indexOf(Math.max(...result));
          const predictedLabel = labels[topIndex];

          console.log('🎯 예측 감정:', predictedLabel);
          console.log(result);

          const updated = [...emotionLog, predictedLabel];
          if (updated.length > quest_save_pre_log) updated.shift();

          setEmotionLog(updated);
          setLatestResult(result);

          if (quest && quest.check(updated)) {
            setSuccess(true);
            console.log('✅ 퀘스트 조건 충족!');
            handleComplete();
          }
        } else {
          console.warn('⚠️ 모델 결과 없음');
        }
      } catch (err) {
        console.error('❌ 예측 중 오류:', err);
      } finally {
        (globalThis as any).isPredictingNow = false;
      }
    }),
    [isLoaded, model, emotionLog, quest]
  );

  const jsHandleFaceStatus = Worklets.createRunOnJS(handleFaceStatus);
  const jsHandleDetectedResult = Worklets.createRunOnJS(handleDetectedResult);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    runAtTargetFps(1, () => {
      'worklet';
      console.log('프레임프로세싱들어옴');
      if ((globalThis as any).isPredictingNow) return;

      const last = (globalThis as any).lastProcessTime ?? 0;
      const now = Date.now();
      if (now - last < quest_capture_interval) return;
      (globalThis as any).lastProcessTime = now;

      const faces: Face[] = detectFaces(frame);
      jsHandleFaceStatus(faces.length > 0);

      if (!faces || faces.length === 0) return;

      const pluginResult = cropFaces(frame, faces[0].bounds) as number[];
      if (!Array.isArray(pluginResult) || typeof pluginResult[0] !== 'number') {
        console.warn('⚠️ Unexpected pluginResult type:', pluginResult);
        return;
      }

      const rawArray = Array.from(pluginResult);
      jsHandleDetectedResult(rawArray);
    }
  );
  }, [detectFaces, jsHandleFaceStatus, jsHandleDetectedResult, quest_capture_interval]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (!device || !hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>📷 카메라 준비 중...</Text>
      </View>
    );
  }

  if (!quest) {
    return (
      <View style={styles.centered}>
        <Text>❌ 퀘스트 정보를 찾을 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.half, { flex: 7 }]}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          photo
          isActive={isActive}
          frameProcessor={frameProcessor}
        />
      </View>

      {latestResult !== null ? (
        <View style={styles.overlay}>
          <EmotionChartBox
            result={latestResult}
            success={success}
            nickname={nickname}
            questDescription={questDescription}
          />
        </View>
      ) : (
        <View style={styles.overlay}>
          {noFaceWarning && (
            <View style={styles.centered}>
              <Text style={styles.warningText}>⚠️ 얼굴이 감지되지 않았습니다</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}