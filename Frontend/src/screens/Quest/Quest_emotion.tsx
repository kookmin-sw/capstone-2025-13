import { Text, View, Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import {
    Camera,
    useCameraDevice,
    useFrameProcessor,
} from "react-native-vision-camera";
import {
    Face,
    useFaceDetector,
} from "react-native-vision-camera-face-detector";
import { Worklets } from "react-native-worklets-core";

import { useLoadEmotionModel } from "../../hooks/useLoadEmotionModel";
import { shouldCaptureFace } from "../../utils/faceChecker";
import { EmotionModelRunner } from "../../utils/EmotionModelRun";
import { QUESTS } from "../../utils/QuestEmotion/quests";

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
    const device = useCameraDevice("front");
    const cameraRef = useRef<any>(null);
    const { detectFaces } = useFaceDetector();
    const [hasPermission, setHasPermission] = useState(false);
    const { isLoaded, model } = useLoadEmotionModel();
    const [noFaceWarning, setNoFaceWarning] = useState(false);

    const [photoPath, setPhotoPath] = useState<string | null>(null);
    const [latestResult, setLatestResult] = useState<number[] | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const lastPhotoTimeRef = useRef(0);
    const isPhotoTaken = useRef(false);

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

    const quest = QUESTS.find((q) => q.id === questTitle);
    if (!quest) {
        return (
            <View style={styles.centered}>
                <Text>❌ 퀘스트 정보를 찾을 수 없습니다</Text>
            </View>
        );
    }

    const quest_capture_interval = quest.interval ?? 1000;
    const quest_save_pre_log = quest.logLength ?? 20;

    const capturePhoto = async (face: Face | undefined) => {
        if (isPhotoTaken.current) return null;
        isPhotoTaken.current = true;

        const now = Date.now();
        const { isLargeEnough, now: checkedTime } = shouldCaptureFace(
            face,
            lastPhotoTimeRef.current
        );
        if (
            !isLargeEnough ||
            now - lastPhotoTimeRef.current < quest_capture_interval
        ) {
            isPhotoTaken.current = false;
            return null;
        }

        try {
            const photo = await cameraRef.current.takePhoto();
            const path = `file://${photo.path}`;
            setPhotoPath(path);
            console.log("📸 사진 저장됨:", path);
            lastPhotoTimeRef.current = checkedTime;
            return path;
        } catch (err) {
            console.error("❌ 사진 캡처 실패:", err);
            return null;
        } finally {
            isPhotoTaken.current = false;
            console.log("🔄 isPhotoTaken reset");
        }
    };

    const handleDetectedFaces = Worklets.createRunOnJS(
        async (faces: Face[]) => {
            if (faces && faces.length === 0) {
                setNoFaceWarning(true);
                return;
            }
            setNoFaceWarning(false);

            if (!faces?.length || !isLoaded || !model) return;

            const face = faces[0];
            const uri = await capturePhoto(face);
            if (!uri) return;

            const result = await EmotionModelRunner(uri, model);
            if (result) {
                const labels = [
                    "angry",
                    "disgust",
                    "fear",
                    "happy",
                    "sad",
                    "surprise",
                    "neutral",
                ];
                const topIndex = result.indexOf(Math.max(...result));
                const predictedLabel = labels[topIndex];
                const updated = [...emotionLog, predictedLabel];

                setLatestResult(Array.from(result));
                console.log("Predicted Label:", predictedLabel);

                if (updated.length > quest_save_pre_log) updated.shift();
                setEmotionLog(updated);

                if (quest.check(updated)) {
                    setSuccess(true);
                    console.log("🎯 퀘스트 완료");
                    handleComplete;
                }
            }
        }
    );

    const frameProcessor = useFrameProcessor(
        (frame) => {
            "worklet";
            const now = Date.now();
            const last = (globalThis as any).lastProcessTime ?? 0;
            if (now - last < quest_capture_interval) return;
            (globalThis as any).lastProcessTime = now;

            const faces = detectFaces(frame);
            handleDetectedFaces(faces);
        },
        [handleDetectedFaces]
    );

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (!device || !hasPermission) {
        return (
            <View style={styles.centered}>
                <Text>📷 카메라 준비 중...</Text>
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
                    isActive
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
                    <View style={styles.centered}>
                        <Text style={styles.warningText}>
                            ⚠️ 얼굴이 감지되지 않았습니다
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}
