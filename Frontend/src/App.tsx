import { Text, View, Alert, Image } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { useLoadEmotionModel } from './hooks/useLoadEmotionModel';
import { shouldCaptureFace } from './utils/faceChecker';
import { EmotionModelRunner } from './utils/EmotionModelRun';
import { QUESTS } from './utils/QuestEmotion/quests';

import EmotionChartBox from './components/Quest_emotionBox';
import styles from './styles/questEmotionStyles';

// 테스트용 하드코딩 파라미터
const questTitle = "5초 간 웃어보기";
const questDescription = "5초 동안 웃기";
const nickname = "국민이";

export default function QuestEmotion() {
    const [emotionLog, setEmotionLog] = useState<string[]>([]);
    const device = useCameraDevice('front');
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

    // 퀘스트 정보 추출은 Hook 아래에서
    const quest = QUESTS.find(q => q.id === questTitle);
    const quest_capture_interval = quest?.interval ?? 1000;
    const quest_save_pre_log = quest?.logLength ?? 20;

    const handleComplete = async () => {
        // 서버 연동 제거, 테스트 알림만
        Alert.alert("완료!", "감정 퀘스트 완료 (서버 생략)");
    };

const capturePhoto = async (face: Face | undefined): Promise<string | null> => {
    if (isPhotoTaken.current) {
        console.log("📷 캡처 건너뜀: 이전 캡처 중");
        return null;
    }

    isPhotoTaken.current = true;

    const now = Date.now();
    const { isLargeEnough, now: checkedTime } = shouldCaptureFace(face, lastPhotoTimeRef.current);
    if (!isLargeEnough || now - lastPhotoTimeRef.current < quest_capture_interval) {
        isPhotoTaken.current = false;
        console.log("📏 얼굴이 작거나 캡처 간격 미달");
        return null;
    }

    try {
        const photo = await cameraRef.current.takePhoto();
        const path = `file://${photo.path}?ts=${Date.now()}`; // 고유 URI 처리
        console.log("📸 캡처 성공:", path);
        setPhotoPath(path);
        lastPhotoTimeRef.current = checkedTime;

        // 최소 캡처 간격 보장 (예: 1초)
        setTimeout(() => {
            isPhotoTaken.current = false;
        }, 1000);

        return path;
    } catch (err) {
        console.error("❌ 사진 캡처 실패:", err);
        isPhotoTaken.current = false;
        return null;
    }
};

    const handleDetectedFaces = Worklets.createRunOnJS(async (faces: Face[]) => {
    if (!faces?.length) {
        setNoFaceWarning(true);
        return;
    }
    setNoFaceWarning(false);

    if (!isLoaded || !model) {
        console.log("❌ 모델 로드 안됨");
        return;
    }

    const face = faces[0];
    const uri = await capturePhoto(face);
    if (!uri) {
        console.log("📛 사진 캡처 실패 or 생략됨");
        return;
    }

    const result = await EmotionModelRunner(uri, model);

    if (result) {
        const labels = ["Happy", "Surprise", "Angry", "Sad", "Disgust", "Fear", "Neutral"];
        const topIndex = result.indexOf(Math.max(...result));
        const predictedLabel = labels[topIndex];

        console.log("🎯 예측 감정:", predictedLabel);
        console.log(result);

        const updated = [...emotionLog, predictedLabel];
        if (updated.length > quest_save_pre_log) updated.shift();

        setEmotionLog(updated);
        setLatestResult(Array.from(result)); // ✅ 그대로 사용

        if (quest && quest.check(updated)) {
            setSuccess(true);
            console.log("✅ 퀘스트 조건 충족!");
            handleComplete();
        }
    } else {
        console.warn("⚠️ 모델 결과 없음");
    }
});


    const frameProcessor = useFrameProcessor((frame) => {
        "worklet";
        const now = Date.now();
        const last = (globalThis as any).lastProcessTime ?? 0;
        if (now - last < quest_capture_interval) return;
        (globalThis as any).lastProcessTime = now;

        const faces = detectFaces(frame);
        handleDetectedFaces(faces);
    }, [handleDetectedFaces]);

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
                    isActive
                    frameProcessor={frameProcessor}
                />
                {photoPath && (
                    <View style={{ position: 'absolute', top: 10, left: 10, width: 100, height: 100, borderWidth: 1, borderColor: '#fff' }}>
                        <Image
                        source={{ uri: photoPath }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                        />
                    </View>
                    )}
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
