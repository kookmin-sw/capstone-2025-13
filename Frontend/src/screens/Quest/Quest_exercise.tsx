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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ProgressChart } from "react-native-chart-kit";
import Youtube_playlist from "../../components/Youtube_playlist";
import { Pedometer } from "expo-sensors";
import { dynamic } from "../../styles/questExerciseDynamicStyles";
import { styles } from "../../styles/questExerciseStyles";
import questStyles  from "../../styles/questStyles";
import { Ionicons } from "@expo/vector-icons";
import {
    useNavigation,
    NavigationProp,
    useRoute,
} from "@react-navigation/native";
import customAxios from "../../API/axios";
import { getCoupon } from "../../API/potAPI";
import { useLoading } from "../../API/contextAPI";

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

export default function QuestExercise() {
    const [steps, setSteps] = useState(0);
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

    const requestPermissions = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
        }
    };

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
        let interval: NodeJS.Timeout;
        const init = async () => {
            const type = "ACTIVITY";
            try {
                const response = await customAxios.get(`/quests/last/${type}`);
                const lastData = response.data.data;
                const lastDataStatus = lastData.status;

                if (lastDataStatus === "COMPLETED") {
                    setIsCompleted(true);
                    setIsGoalReached(true);
                    if (lastData.photo) setImage(lastData.photo);
                }
            } catch (error) {
                console.error("퀘스트 상태 확인 중 오류:", error);
            }

            const isAvailable = await Pedometer.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert(
                    "걸음 수 추적 불가",
                    "이 기기는 걸음 수 추적을 지원하지 않습니다."
                );
                return;
            }

            const updateSteps = async () => {
                const end = new Date();
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                const result = await Pedometer.getStepCountAsync(start, end);
                setSteps(result.steps);
                if (result.steps >= questTarget) {
                    setIsGoalReached(true);
                    clearInterval(interval);
                }
            };

            await updateSteps();
            interval = setInterval(updateSteps, 3000);

            return () => clearInterval(interval);
        };

        requestPermissions();
        init();
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
