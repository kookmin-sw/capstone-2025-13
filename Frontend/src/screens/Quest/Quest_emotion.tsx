import {Alert, Text, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {
    Camera,
    useCameraDevice,
    useCameraFormat,
    useCameraPermission,
    useFrameProcessor
} from 'react-native-vision-camera';
import {useFaceDetector} from 'react-native-vision-camera-face-detector';
import { runOnJS } from 'react-native-reanimated';

import {useLoadEmotionModel} from '../../hooks/useLoadEmotionModel';
import {runTFLiteModel} from '../../utils/EmotionModelRun';
import {shouldCaptureFace} from '../../utils/faceChecker';
import {QUESTS} from '../../utils/QuestEmotion/quests';

import EmotionChartBox from '../../components/Quest_emotionBox';
import styles from '../../styles/questEmotionStyles';
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native';
import customAxios from '../../API/axios';
import {getCoupon} from '../../API/potAPI';
import {crop} from "vision-camera-cropper";

import "react-native-worklets-core";

type RouteParams = {
    questTitle: string;
    questDescription: string;
    questTarget: number;
    nickname: string,
};

export default function QuestEmotion() {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const { questTitle, questDescription, nickname } = route.params as RouteParams;

    const device = useCameraDevice('front');
    const cameraRef = useRef<any>(null);
    const {detectFaces} = useFaceDetector();
    const {isLoaded, model} = useLoadEmotionModel();

    const [emotionLog, setEmotionLog] = useState<string[]>([]);
    const [latestResult, setLatestResult] = useState<number[] | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [noFaceWarning, setNoFaceWarning] = useState(false);
    const { hasPermission, requestPermission } = useCameraPermission()

    const quest = QUESTS.find(q => q.id === questTitle);
    const quest_capture_interval = quest?.interval ?? 1000;
    const quest_save_pre_log = quest?.logLength ?? 20;


    const format = useCameraFormat(device, [
        { videoResolution: { width: 720, height: 1280 } },
    ]);

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
                Alert.alert("완료!", "감정 퀘스트가 성공적으로 완료되었어요! 🎉", [
                    {
                        text: "확인",
                        onPress: () =>
                            navigation.navigate("Quest_stage", {
                                title: `${nickname}의 숲`,
                            }),
                    },
                ]);
            } else {
                Alert.alert("오류", "감정 퀘스트 완료 처리 중 문제가 발생했어요.");
            }
        } catch (error) {
            console.error("감정 퀘스트 완료 처리 중 오류 발생:", error);
            Alert.alert("오류", "서버 통신 중 문제가 발생했어요.");
        }
    };

    const handleProcessedInput = async (floatInput: string) => {
        if (!isLoaded || !model) return;

        const input = Buffer.from(floatInput, 'base64');

        const result = await runTFLiteModel(new Float32Array(input), model);
        if (!result) {
            console.warn('⚠️ 모델 결과 없음');
            return;
        }

        const labels = ['Happy', 'Surprise', 'Angry', 'Sad', 'Disgust', 'Fear', 'Neutral'];
        const topIndex = result.indexOf(Math.max(...result));
        const predictedLabel = labels[topIndex];

        console.log('🎯 예측 감정:', predictedLabel);
        console.log(result);

        const updated = [...emotionLog, predictedLabel];
        if (updated.length > quest_save_pre_log) updated.shift();

        setEmotionLog(updated);
        setLatestResult([...result]);

        if (quest && quest.check(updated)) {
            setSuccess(true);
            handleComplete();
        }
    };

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        const now = Date.now();
        const last = (globalThis as any).lastProcessTime ?? 0;
        if (now - last < quest_capture_interval) return;
        (globalThis as any).lastProcessTime = now;

        const faces = detectFaces(frame);
        if (faces?.length) {
            const face = faces[0];
            const {isLargeEnough} = shouldCaptureFace(face, last);
            if (!isLargeEnough) return;

            const {x, y, width, height} = face.bounds;

            console.log(`${Math.max(0, x)}, ${Math.max(0, y)}, ${Math.min(height, frame.height - y)}, ${Math.min(width, frame.width - x)}`);

            const cropped = crop(frame, {
                cropRegion: {
                    left: x / frame.width,
                    top: y / frame.height,
                    height: height / frame.height,
                    width: width / frame.width
                },
                saveAsFile: false,
                includeImageBase64: true
            });

            runOnJS(handleProcessedInput)(cropped.base64 ?? '');
        } else {
            runOnJS(() => setNoFaceWarning(true))();
        }
    }, [isLoaded, model, quest]);

    useEffect(() => {
        const initPermission = async() => {
            await requestPermission();
        }

        initPermission();
    })

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
                    format={format}
                />
            </View>

            <View style={styles.overlay}>
                {latestResult ? (
                    <EmotionChartBox
                        result={latestResult}
                        success={success}
                        nickname={nickname}
                        questDescription={questDescription}
                    />
                ) : (
                    noFaceWarning && (
                        <View style={styles.centered}>
                            <Text style={styles.warningText}>⚠️ 얼굴이 감지되지 않았습니다</Text>
                        </View>
                    )
                )}
            </View>
        </View>
    );
}