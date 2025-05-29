import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
    Modal,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ProgressChart } from "react-native-chart-kit";
import Youtube_playlist from "../../components/Youtube_playlist";
import { Pedometer } from "expo-sensors";
import { dynamic } from "../../styles/questExerciseDynamicStyles";
import { styles } from "../../styles/questExerciseStyles";
import questStyles from "../../styles/questStyles";
import { Ionicons } from "@expo/vector-icons";
import {
    useNavigation,
    NavigationProp,
    useRoute,
} from "@react-navigation/native";
import customAxios from "../../API/axios";
import { getCoupon } from "../../API/potAPI";
import { useLoading } from "../../API/contextAPI";

// Health Connect 관련 import
import {
    initialize,
    requestPermission,
    readRecords,
    getSdkStatus,
    SdkAvailabilityStatus,
} from "react-native-health-connect";

const { width } = Dimensions.get("window");

const mainVideo = {
    id: "58uXqbAfAVg",
    title: "[Playlist] 차분하게 즐기는 플레이리스트 | 인센스 음악 | WOODLAND Playlist",
};

const exerciseVideos = [
    {
        id: "ohsMB2Whyf4",
        title: "운동 전 듣기 좋은 신나는 음악",
        channel: "Fit Beats",
        duration: "35:12",
        thumbnail: "https://img.youtube.com/vi/ohsMB2Whyf4/0.jpg",
    },
    {
        id: "fj8ReY0HxWc",
        title: "마음이 차분해지는 피아노 선율 모음",
        channel: "Healing Piano",
        duration: "52:10",
        thumbnail: "https://img.youtube.com/vi/fj8ReY0HxWc/0.jpg",
    },
    {
        id: "X5v7q7p5t1k",
        title: "편안한 재즈로 명상 타임 즐기기",
        channel: "Jazz Relax",
        duration: "45:00",
        thumbnail: "https://img.youtube.com/vi/X5v7q7p5t1k/0.jpg",
    },
];

type RouteParams = {
    questTitle: string;
    questDescription: string;
    questTarget: number;
};

const delay = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function QuestExercise() {
    const [steps, setSteps] = useState<number>(0);
    const [image, setImage] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const [isGoalReached, setIsGoalReached] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const [completeModalVisible, setCompleteModalVisible] = useState(false);
    const [completeModalMessage, setCompleteModalMessage] = useState("");
    const { questTitle, questDescription, questTarget } =
        route.params as RouteParams;
    const descriptionLines = questDescription.split("\n");

    useEffect(() => {
        if (Platform.OS === "ios") {
            let subscription: any;
            const subscribe = async () => {
                const isAvailable = await Pedometer.isAvailableAsync();
                if (!isAvailable) {
                    Alert.alert("이 기기에서 만보계 센서를 사용할 수 없습니다.");
                    return;
                }
                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const result = await Pedometer.getStepCountAsync(startOfDay, now);
                setSteps(result.steps);

                // 실시간 업데이트(앱 켜져있는 동안)
                subscription = Pedometer.watchStepCount((result) => {
                    setSteps((prev) => prev + result.steps);
                });
            };
            subscribe();
            return () => subscription && subscription.remove();
        } else if (Platform.OS === "android") {
            // Android: Health Connect
            const getPermissionAndFetchSteps = async () => {
                try {
                    const status = await getSdkStatus();
                    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
                        Alert.alert("Health Connect가 설치되어 있지 않습니다. Google Play 스토어에서 다운로드해주세요.");
                        return;
                    }
                    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
                        Alert.alert("Health Connect 제공자의 업데이트가 필요합니다.");
                        return;
                    }
                    await initialize();
                    await delay(1000);
                    const granted = await requestPermission([
                        { accessType: "read", recordType: "Steps" },
                    ]);
                    if (granted) {
                        fetchSteps();
                    }
                } catch (error) {
                    console.error(error);
                    Alert.alert("걸음 수 권한 요청 중 오류가 발생했습니다.");
                }
            };

            getPermissionAndFetchSteps();
            const interval = setInterval(fetchSteps, 3000);
            return () => clearInterval(interval);
        }
    }, []);


    // 걸음 수 가져오는 함수 (Health Connect)
    const fetchSteps = async () => {
        if (Platform.OS === "ios") {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const result = await Pedometer.getStepCountAsync(startOfDay, now);
            setSteps(result.steps);
            if (result.steps >= questTarget) setIsGoalReached(true);
        } else if (Platform.OS === "android") {
            try {
                const now = new Date();
                const currentTime = now.toISOString();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

                const stepsData = await readRecords("Steps", {
                    timeRangeFilter: {
                        operator: "between",
                        startTime: startOfDay,
                        endTime: currentTime,
                    },
                });

                const filteredRecords = stepsData.records?.filter(
                    (entry) => entry.metadata?.dataOrigin === "com.google.android.apps.fitness"
                );
                const totalSteps = (filteredRecords ?? []).reduce((sum, entry) => sum + entry.count, 0);
                console.log("Total Steps:", totalSteps);
                setSteps(totalSteps);
                if (totalSteps >= questTarget) setIsGoalReached(true);
            } catch (error) {
                console.error(error);
                Alert.alert("걸음 수를 가져오는 중 오류가 발생했습니다.");
            }
        }
    };


    // 사진 권한 요청
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
        }
    };

    // 사진 선택
    const pickImage = async () => {
        if (isCompleted) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // 미션 완료 처리
    const handleComplete = async () => {
        showLoading();
        try {
            const type = "ACTIVITY";
            const response = await customAxios.get(`/quests/last/${type}`);
            const lastDataID = response.data.data.id;
            const lastDataStatus = response.data.data.status;

            if (lastDataStatus !== "COMPLETED") {
                const postRes = await customAxios.post("/quests", {
                    id: lastDataID,
                    current: 0,
                    status: "COMPLETED",
                });

                if (image) {
                    const formData = new FormData();
                    const uriParts = image.split(".");
                    const fileType = uriParts[uriParts.length - 1];

                    formData.append("file", {
                        uri: image,
                        name: `photo.${fileType}`,
                        type: `image/${fileType}`,
                    } as any);

                    await customAxios.put(
                        `/quests/photo/${lastDataID}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    await getCoupon();
                }

                if (postRes.status === 200 || postRes.status === 201) {
                    setCompleteModalMessage("산책이 성공적으로 완료되었어요! 🎉");
                    setCompleteModalVisible(true);
                } else {
                    Alert.alert("오류", "산책 완료 처리 중 문제가 발생했어요.");
                }
            } else {
                setCompleteModalMessage("이미 완료된 미션이에요!");
                setCompleteModalVisible(true);
            }
        } catch (error) {
            console.error("산책 완료 처리 중 오류 발생:", error);
            Alert.alert("오류", "서버 통신 중 문제가 발생했어요.");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        requestPermissions();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                bounces={false}
                overScrollMode="never"
            >
                <View style={styles.backButtonWrapper}>
                    <View style={{ marginTop: width * 0.03 }}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Quest_stage", {
                                    title: "산책",
                                })
                            }
                        >
                            <Ionicons
                                name="arrow-back-circle"
                                size={40}
                                color="#FF6188"
                            />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={[dynamic.missionTitle, styles.title]}>
                            오늘의 미션 🔥
                        </Text>
                        <Text style={[dynamic.mainText, styles.mission]}>
                            {questTitle}
                        </Text>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <ProgressChart
                        data={{
                            labels: ["걸음 수"],
                            data: [Math.min(steps / questTarget, 1)],
                        }}
                        width={width * 0.9}
                        height={width * 0.6}
                        strokeWidth={16}
                        radius={width * 0.21}
                        chartConfig={{
                            backgroundColor: "#000",
                            backgroundGradientFrom: "#000",
                            backgroundGradientTo: "#000",
                            decimalPlaces: 0,
                            color: (opacity = 1) =>
                                `rgba(255, 61, 137, ${opacity})`,
                            labelColor: () => "#fff",
                        }}
                        hideLegend={true}
                        style={styles.progressChart}
                    />

                    <View style={styles.centerTextContainer}>
                        {isGoalReached ? (
                            <Text
                                style={[
                                    dynamic.stepCount,
                                    {
                                        color: "#FF6188",
                                        fontSize: 28,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                완료!
                            </Text>
                        ) : (
                            <>
                                <Text style={dynamic.stepCount}>{steps}</Text>
                                <Text style={dynamic.stepGoal}>
                                    /{questTarget}
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                <Text style={[styles.warningTitle, dynamic.warningTitle]}>
                    오늘의 산책 가이드 🌿
                </Text>
                {descriptionLines.map((line, index) => (
                    <Text key={index} style={styles.description}>
                        ・ {line}
                    </Text>
                ))}

                <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={pickImage}
                    disabled={isCompleted}
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={styles.uploadedImage}
                        />
                    ) : (
                        <Text style={[styles.uploadText, dynamic.uploadText]}>
                            📷 사진 업로드하기
                        </Text>
                    )}
                </TouchableOpacity>

                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>
                    '우웅'의 추천 플레이리스트 🎧
                </Text>

                <Youtube_playlist
                    title="추천 플레이리스트"
                    videos={exerciseVideos}
                    backgroundColor="#222"
                    width={width}
                    mainVideo={mainVideo}
                />
            </ScrollView>

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
                                navigation.navigate("Quest_stage", { title: "산책" });
                            }}
                            style={questStyles.closeButton}
                        >
                            <Text style={questStyles.closeButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        {
                            backgroundColor:
                                steps >= questTarget && image && !isCompleted
                                    ? "#FF6188"
                                    : "#ccc",
                        },
                    ]}
                    disabled={!(steps >= questTarget && image && !isCompleted)}
                    onPress={handleComplete}
                >
                    <Text style={[dynamic.buttonText]}>
                        {isCompleted ? "오늘은 끝 - !" : "완 - 료 !"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
