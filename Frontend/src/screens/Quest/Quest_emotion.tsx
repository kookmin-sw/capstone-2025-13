import { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, Alert, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor, Frame } from 'react-native-vision-camera';
import type { FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { useLoadEmotionModel } from '../../hooks/useLoadEmotionModel';
import { cropFaces } from '../../plugins/cropFaces';
import { runTFLiteModelRunner } from '../../utils/EmotionModelRun';
import { QUESTS } from '../../utils/QuestEmotion/quests';
import questStyles from "../../styles/questStyles";
import { Ionicons } from "@expo/vector-icons";

import EmotionChartBox from "../../components/Quest_emotionBox";
import styles from "../../styles/questEmotionStyles";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import customAxios from "../../API/axios";
import { getCoupon } from "../../API/potAPI";

const { width } = Dimensions.get("window");

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
  const [streak, setStreak] = useState(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [completeModalMessage, setCompleteModalMessage] = useState("");

  const device = useCameraDevice('front');
  const { isLoaded, model } = useLoadEmotionModel();
  const cameraRef = useRef<any>(null);

  const isPredictingNow = useRef(false);

  const faceDetectorOptions: FaceDetectionOptions = {
    performanceMode: 'accurate',
    landmarkMode: 'none',
    contourMode: 'none',
    classificationMode: 'none',
    minFaceSize: 0.2,
    trackingEnabled: false,
    autoMode: false,
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
        setCompleteModalMessage(
          "감정 퀘스트가 성공적으로 완료되었어요! 🎉"
        );
        setCompleteModalVisible(true);
        return;

      } else {
        Alert.alert("오류", "감정 퀘스트 완료 처리 중 문제가 발생했어요.");
      }
    } catch (error) {
      console.error("감정 퀘스트 완료 처리 중 오류 발생:", error);
      Alert.alert("오류", "서버 통신 중 문제가 발생했어요.");
    }
  };

  const handleFaceStatus = useCallback((hasFace: boolean) => {
    setNoFaceWarning(!hasFace);
    if (!hasFace) {
      setLatestResult(null);
    }
  }, []);

  // async JS 함수는 worklet이 아니어야 함
  const handleDetectedResultJS = async (pluginResult: number[]) => {
    if (!isLoaded || !model) {
      console.log('❌ 모델 로드 안됨');
      return;
    }
    if (isPredictingNow.current) return;
    isPredictingNow.current = true;

    try {
      const input = new Float32Array(pluginResult);
      const result = await runTFLiteModelRunner(input, model);
      if (result) {
        const labels = ['Happy', 'Surprise', 'Angry', 'Sad', 'Disgust', 'Fear', 'Neutral'];
        const topIndex = result.indexOf(Math.max(...result));
        const predictedLabel = labels[topIndex];

        console.log('🎯 예측 감정:', predictedLabel);
        console.log(result);

        setEmotionLog(prev => {
          const updated = [...prev, predictedLabel];
          if (updated.length > quest_save_pre_log) updated.shift();

          let quest_result;
          if (quest) {
            console.log(updated);
            quest_result = quest.check(updated);  // result: { isSuccess, streakCount }
            console.log(quest_result);

            if (quest_result.isSuccess) {
              setSuccess(true);
              setStreak(quest_result.streakCount); // 숫자 상태 업데이트 (별도 state 필요)
              console.log('RR');
              handleComplete();
              console.log('SS');
            }
          }
          return updated;
        });

        setLatestResult(result);
      } else {
        console.warn('⚠️ 모델 결과 없음');
      }
    } catch (err) {
      console.error('❌ 예측 중 오류:', err);
    } finally {
      isPredictingNow.current = false;
    }
  };

  const jsHandleFaceStatus = Worklets.createRunOnJS(handleFaceStatus);
  const jsHandleDetectedResult = Worklets.createRunOnJS(handleDetectedResultJS);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';

    if ((globalThis as any).lastProcessTime === undefined) {
      (globalThis as any).lastProcessTime = 0;
    }
    if ((globalThis as any).isPredictingNow) return;

    const last = (globalThis as any).lastProcessTime;
    const now = Date.now();
    if (now - last < quest_capture_interval) return;
    (globalThis as any).lastProcessTime = now;

    const faces: Face[] = detectFaces(frame);
    if (!faces || faces.length === 0) {
      jsHandleFaceStatus(false);
      return;
    }

    jsHandleFaceStatus(true);

    let pluginResult: number[] | undefined;
    try {
      // 좌표 유효성 검사를 원한다면 이곳에서 faces[0].bounds 확인 가능
      pluginResult = cropFaces(frame, faces[0].bounds) as number[];
    } catch {
      return;
    }

    if (!Array.isArray(pluginResult) || typeof pluginResult[0] !== 'number') {
      return;
    }

    jsHandleDetectedResult(pluginResult);
  }, [detectFaces, quest_capture_interval]);

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
      <View style={styles.backButtonWrapper}>
        <View style={{ marginTop: width * 0.03 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Quest_stage", {
                title: `${nickname}의 숲`,
              })
            }
          >
            <Ionicons
              name="arrow-back-circle"
              size={40}
              color="#FF9B4B"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.half, { flex: 7 }]}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          photo
          isActive
          frameProcessor={frameProcessor}
        />
      </View>
      <Modal
        visible={completeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCompleteModalVisible(false)}
      >
        <View style={questStyles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={questStyles.modalTitle}>완료!</Text>
            <Text style={questStyles.modalText}>
              {completeModalMessage}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setCompleteModalVisible(false);
                navigation.navigate("Quest_stage", {
                  title: `${nickname}의 숲`,
                });
              }}
              style={questStyles.closeButton}
            >
              <Text style={questStyles.closeButtonText}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
