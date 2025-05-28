import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Alert,
    TextInput,
} from "react-native";
import styles from "../../styles/questMeditationStyles";
import Youtube_playlist from "../../components/Youtube_playlist";
import { dynamic } from "../../styles/questMeditaionDynamicStyles";
import { Ionicons } from "@expo/vector-icons";
import {
    useNavigation,
    NavigationProp,
    useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import customAxios from "../../API/axios";
import { getCoupon } from "../../API/potAPI";
import { useLoading } from "../../API/contextAPI";

type RouteParams = {
    questTitle: string;
    questDescription: string;
    questTarget: number;
};

export default function Quest_meditation() {
    const { showLoading, hideLoading } = useLoading();
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isMeditationDone, setIsMeditationDone] = useState(false);
    const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
    const [customMinutes, setCustomMinutes] = useState("");
    const [customSeconds, setCustomSeconds] = useState("");
    const [isTimeSet, setIsTimeSet] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { width } = useWindowDimensions();
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const { questTitle, questDescription, questTarget } =
        route.params as RouteParams;
    const descriptionLines = questDescription.split("\n");

    useEffect(() => {
        if (questTarget === 0) {
            setShowCustomTimeInput(true);
        } else {
            setTimeLeft(questTarget * 60);
            setIsTimeSet(true);
        }
    }, [questTarget]);

    useEffect(() => {
        const checkFirstVisit = async () => {
            try {
                const hasVisited = await AsyncStorage.getItem(
                    "hasVisitedMeditation"
                );
                if (!hasVisited) {
                    Alert.alert(
                        "명상 타이머 설명",
                        "・ 시작 버튼을 누르면 타이머가 바로 시작돼요.\n・ 앱을 강제로 종료하면 타이머가 초기화돼요.\n・ 다른화면으로 나가면 타이머가 멈춰요.\n・ 시간이 다 지나고 완료 버튼을 꼭 눌러야 미션 성공으로 인정돼요. 🙌",
                        [{ text: "확인" }]
                    );
                    await AsyncStorage.setItem("hasVisitedMeditation", "true");
                }
            } catch (error) {
                console.log("Error checking first visit:", error);
            }
        };

        checkFirstVisit();
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const startTimer = () => {
        if (intervalRef.current || timeLeft <= 0) return;
        setIsRunning(true);
        setIsMeditationDone(false);

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    setIsRunning(false);
                    setIsMeditationDone(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleComplete = async () => {
        showLoading();
        try {
            const type = "MEDITATE";
            const response = await customAxios.get(`/quests/last/${type}`);
            const lastDataID = response.data.data.id;
            const lastDataStatus = response.data.data.status;

            if (lastDataStatus !== "COMPLETED") {
                const postRes = await customAxios.post("/quests", {
                    id: lastDataID,
                    current: 0,
                    status: "COMPLETED",
                });

                if (postRes.status === 200 || postRes.status === 201) {
                    await getCoupon();
                    Alert.alert("완료!", "명상이 성공적으로 완료되었어요! 🎉", [
                        {
                            text: "확인",
                            onPress: () =>
                                navigation.navigate("Quest_stage", {
                                    title: "명상",
                                }),
                        },
                    ]);
                    return;
                } else {
                    Alert.alert("오류", "명상 완료 처리 중 문제가 발생했어요.");
                    return;
                }
            }

            Alert.alert("알림", "이미 완료된 미션이에요!", [
                {
                    text: "확인",
                    onPress: () =>
                        navigation.navigate("Quest_stage", { title: "명상" }),
                },
            ]);
        } catch (error) {
            console.error("명상 완료 처리 중 오류 발생:", error);
            Alert.alert("오류", "서버 통신 중 문제가 발생했어요.");
        } finally {
            hideLoading();
        }
    };

    const mainVideo = {
        id: "FjHGZj2IjBk",
        title: "하루의 피로를 풀어주는 힐링 음악 모음 | Relaxing Music for a Calm Evening",
    };

    const meditationVideos = [
        {
            id: "Yuw8TnTei58",
            title: "잔잔한 자연의 소리와 함께하는 명상",
            channel: "Calm Nature",
            duration: "1:00:00",
            thumbnail: "https://img.youtube.com/vi/Yuw8TnTei58/0.jpg",
        },
        {
            id: "_LVeoEEYN9c",
            title: "마음을 다스리는 깊은 명상 음악",
            channel: "Mindful Music",
            duration: "58:32",
            thumbnail: "https://img.youtube.com/vi/_LVeoEEYN9c/0.jpg",
        },
        {
            id: "JYPIDIQSvb8",
            title: "편안한 피아노 선율로 힐링하기",
            channel: "Healing Piano",
            duration: "47:15",
            thumbnail: "https://img.youtube.com/vi/JYPIDIQSvb8/0.jpg",
        },
    ];

    const buttonText = isMeditationDone
        ? "완 - 료 !"
        : isRunning
        ? "명상중 🧘🏻‍♀️"
        : "시 - 작 !";

    const buttonColor = isMeditationDone
        ? "#E68E48"
        : isRunning
        ? "#aaa"
        : "#6c63ff";

    return (
        <View style={styles.page}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { paddingBottom: width * 0.2 },
                ]}
                bounces={false}
                overScrollMode="never"
            >
                <View style={styles.backButtonWrapper}>
                    <View style={{ marginTop: width * 0.03 }}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Quest_stage", {
                                    title: "명상",
                                })
                            }
                        >
                            <Ionicons
                                name="arrow-back-circle"
                                size={40}
                                color="#6c63ff"
                            />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text
                            style={[styles.missionTitle, dynamic.missionTitle]}
                        >
                            오늘의 미션 🔥
                        </Text>
                        <Text style={[styles.mainText, dynamic.mainText]}>
                            {questTitle}
                        </Text>
                    </View>
                </View>

                {showCustomTimeInput && !isTimeSet && (
                    <View style={{ padding: 20 }}>
                        <Text style={{ color: "white", marginBottom: 10 }}>
                            직접 타이머를 설정해 주세요 (분:초)
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TextInput
                                placeholder="분"
                                placeholderTextColor="#aaa"
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 8,
                                    padding: 10,
                                    width: 80,
                                }}
                                keyboardType="numeric"
                                value={customMinutes}
                                onChangeText={setCustomMinutes}
                            />
                            <TextInput
                                placeholder="초"
                                placeholderTextColor="#aaa"
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 8,
                                    padding: 10,
                                    width: 80,
                                }}
                                keyboardType="numeric"
                                value={customSeconds}
                                onChangeText={setCustomSeconds}
                            />
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#6c63ff",
                                    padding: 10,
                                    borderRadius: 8,
                                }}
                                onPress={() => {
                                    const minutes =
                                        parseInt(customMinutes) || 0;
                                    const seconds =
                                        parseInt(customSeconds) || 0;
                                    const totalSeconds = minutes * 60 + seconds;
                                    if (totalSeconds > 0) {
                                        setTimeLeft(totalSeconds);
                                        setIsTimeSet(true);
                                    } else {
                                        Alert.alert(
                                            "오류",
                                            "0보다 큰 시간을 입력해 주세요."
                                        );
                                    }
                                }}
                            >
                                <Text style={{ color: "white" }}>설정</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {isTimeSet && (
                    <View style={styles.timerWrapper}>
                        <Text style={[styles.timerText, dynamic.timerText]}>
                            {formatTime(timeLeft)}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    "명상 타이머 설명",
                                    "・ 시작 버튼을 누르면 타이머가 바로 시작돼요.\n・ 앱을 강제로 종료하면 타이머가 초기화돼요.\n・ 다른화면으로 나가면 타이머가 멈춰요.\n・ 시간이 다 지나고 완료 버튼을 꼭 눌러야 미션 성공으로 인정돼요. 🙌",
                                    [{ text: "확인" }]
                                )
                            }
                            style={styles.timerDescription}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="#fff94f"
                            />
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={[styles.warningTitle, dynamic.warningTitle]}>
                    오늘의 명상 가이드 🧘🏻‍♀️
                </Text>
                {descriptionLines.map((line, index) => (
                    <Text key={index} style={styles.description}>
                        ・ {line}
                    </Text>
                ))}

                <Text style={[styles.sectionTitle, dynamic.sectionTitle]}>
                    '우웅'의 추천 플레이리스트 🎧
                </Text>
                <Youtube_playlist
                    title="추천 플레이리스트"
                    videos={meditationVideos}
                    backgroundColor="#1a1a40"
                    width={width}
                    mainVideo={mainVideo}
                />
            </ScrollView>

            {isTimeSet && (
                <TouchableOpacity
                    style={[
                        styles.button,
                        dynamic.button,
                        { backgroundColor: buttonColor },
                    ]}
                    onPress={isMeditationDone ? handleComplete : startTimer}
                    disabled={isRunning && !isMeditationDone}
                >
                    <Text style={[styles.buttonText, dynamic.buttonText]}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
