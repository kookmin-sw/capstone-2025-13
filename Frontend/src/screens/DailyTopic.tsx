import {
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Text } from "react-native";
import { useState, useRef, useEffect } from "react";
import Question from "../components/Question";
import Answer from "../components/Answer";
import LoadingAnswer from "../components/LoadingAnswer";
import dailyTopicstyles from "../styles/dailyTopicStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";
import ModalComponent from "../components/TopicModal";

import { getUserInfo, UserInfoResponse } from "../API/userInfoAPI";
import { getCoupon } from "../API/potAPI";
import {
    getTodayTopic,
    createTopic,
    getTopicDetails,
    submitFeedback,
    getFeedbackById,
    getTopicByDate,
    TopicFeedbackResponse,
    TopicFeedbackStatus,
} from "../API/topicAPI";
import { RouteProp, useRoute } from "@react-navigation/native";

const route = useRoute<RouteProp<RootStackParamList, 'DailyTopic'>>();
const date = route.params?.date ?? '';


type ChatItem =
    | { type: "question"; text: string }
    | { type: "answer"; text: string; isLoading?: boolean };

export default function DailyTopic() {
    const [topicId, setTopicId] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
    const scrollRef = useRef<ScrollView>(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [placeholderText, setPlaceholderText] =
        useState("메세지를 입력하세요.");
    const [user, setUser] = useState<UserInfoResponse | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const showModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    const goToDiary = () => {
        setIsModalVisible(false);
        navigation.replace("Record", {});
    };

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUserInfo();
            if (data) setUser(data);
        };

        fetchUser();
        initializeChat();
    }, []);

    const initializeChat = async () => {
        try {
            const topicData = date
                ? await getTopicByDate(date)
                : await getTodayTopic();

            const history: ChatItem[] = [
                { type: "question", text: topicData.data },
            ];

            const allFeedbacks = topicData.feedbacks.sort(
                (a: any, b: any) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );

            allFeedbacks.forEach((feedback: any) => {
                history.push({ type: "answer", text: feedback.data });
                if (feedback.status !== TopicFeedbackStatus.NOFEEDBACK) {
                    history.push({
                        type: "question",
                        text: feedback.aiFeedback,
                    });
                }

                if (feedback.status === TopicFeedbackStatus.NOFEEDBACK) {
                    setInputDisabled(true);
                    setPlaceholderText(
                        "오늘은 세잎이와 충분히 대화했어!\n일기 써보는 건 어때?"
                    );
                    setIsModalVisible(true);
                }
            });

            setTopicId(topicData.id);
            setChatHistory(history);
        } catch (error: any) {
            if (
                error.response?.status === 404 ||
                error.response?.status === 409
            ) {
                await handleCreateTopic();
            } else {
                console.error(
                    "❌ 초기화 실패:",
                    error.response?.data || error.message
                );
            }
        }
    };

    const handleCreateTopic = async () => {
        try {
            const newTopic = await createTopic();
            setTopicId(newTopic.id);
            setChatHistory([{ type: "question", text: newTopic.data }]);
        } catch (error: any) {
            if (error.response?.status === 409) {
                const existingTopic = await getTodayTopic();
                setTopicId(existingTopic.id);
                setChatHistory([
                    { type: "question", text: existingTopic.data },
                ]);
            } else {
                console.error(
                    "❌ Failed to create topic:",
                    error.response?.data || error.message
                );
            }
        }
    };

    const handleFetchFeedback = async (topicId: string) => {
        try {
            await getTopicDetails(topicId);
        } catch (error: any) {
            console.error(
                "❌ Failed to fetch feedback:",
                error.response?.data || error.message
            );
        }
    };

    const fetchFeedbackWithRetry = async (
        topicFeedbackId: string,
        retryCount = 0
    ) => {
        if (retryCount > 5) return;

        try {
            const data: TopicFeedbackResponse = await getFeedbackById(
                topicFeedbackId
            );

            if (data.status === TopicFeedbackStatus.NOFEEDBACK) {
                setInputDisabled(true);
                setPlaceholderText(
                    "오늘은 세잎이와 충분히 대화했어!\n일기 써보는 건 어때?"
                );
                setIsModalVisible(true);
                setTimeout(
                    () =>
                        fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1),
                    3000
                );
                return;
            }

            if (data.status === TopicFeedbackStatus.COMPLETED) {
                setChatHistory((prev) => {
                    const updated = prev.map((item) =>
                        item.type === "answer" && item.isLoading
                            ? { ...item, isLoading: false }
                            : item
                    );
                    return [
                        ...updated,
                        { type: "question", text: data.aiFeedback },
                    ];
                });
                await getCoupon();
            } else {
                setTimeout(
                    () =>
                        fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1),
                    3000
                );
            }
        } catch (error: any) {
            const status = error.response?.status ?? null;
            if (status === 404) {
                setTimeout(
                    () =>
                        fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1),
                    3000
                );
            } else if (status === null) {
                // error.response가 null인 경우 (네트워크 오류 등)
                console.error(
                    "❌ Feedback fetch failed: No response received",
                    error.message
                );
                setTimeout(
                    () =>
                        fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1),
                    3000
                );
            } else {
                console.error(
                    "❌ Feedback fetch failed:",
                    error.response?.data || error.message
                );
                setTimeout(
                    () =>
                        fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1),
                    3000
                );
            }
        }
    };

    const handleSendFeedback = async (answer: string) => {
        if (!topicId) return;

        try {
            const topicFeedbackId = await submitFeedback(topicId, answer);
            setTimeout(() => fetchFeedbackWithRetry(topicFeedbackId), 3000);
        } catch (error: any) {
            if (
                error.response?.status === 403 &&
                error.response?.data?.message === "Limit reached"
            ) {
                setInputDisabled(true);
                setPlaceholderText(
                    "오늘은 세잎이와 충분히 대화했어!\n일기 써보는 건 어때?"
                );
            } else {
                console.error(
                    "❌ Feedback failed:",
                    error.response?.data || error.message
                );
            }
        }
    };

    const handleSend = () => {
        if (answer.trim() === "") return;

        const userAnswer = answer;
        setAnswer("");

        setChatHistory((prev) => [
            ...prev,
            { type: "answer", text: userAnswer, isLoading: true },
        ]);

        setTimeout(() => {
            handleSendFeedback(userAnswer);
        }, 500);
    };

    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [chatHistory]);

    const renderChat = () => {
        return chatHistory.map((item, index) => (
            <View key={index} style={dailyTopicstyles.itemContainer}>
                {item.type === "question" ? (
                    <View style={dailyTopicstyles.questionContainer}>
                        <Image
                            source={require("../assets/Images/cloverProfile.png")}
                            style={dailyTopicstyles.cloverProfileImage}
                        />
                        <View style={dailyTopicstyles.contentContainer}>
                            <Text>세잎이 ☘️</Text>
                            <Question question={item.text} />
                        </View>
                    </View>
                ) : (
                    <View style={dailyTopicstyles.answerContainer}>
                        <View style={dailyTopicstyles.contentContainer}>
                            {item.isLoading ? (
                                <LoadingAnswer answer={item.text} />
                            ) : (
                                <Answer answer={item.text} />
                            )}
                        </View>
                        <Image
                            source={
                                user?.profile
                                    ? { uri: user.profile }
                                    : require("../assets/Images/cloverProfile.png")
                            }
                            style={dailyTopicstyles.userProfileImage}
                        />
                    </View>
                )}
            </View>
        ));
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={0}
        >
            <View style={[dailyTopicstyles.container, { flex: 1 }]}>
                <TouchableOpacity
                    style={dailyTopicstyles.backButtonWrapper}
                    onPress={() => navigation.navigate("Home", {})}
                >
                    <Ionicons
                        name="arrow-back-circle"
                        size={40}
                        color="#349C64"
                    />
                </TouchableOpacity>
                <Text style={dailyTopicstyles.headerText}>매일 1주제</Text>
                <ScrollView
                    contentContainerStyle={dailyTopicstyles.scrollContainer}
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                >
                    {renderChat()}
                </ScrollView>
                <View style={dailyTopicstyles.inputContainer}>
                    <TextInput
                        placeholder={placeholderText}
                        style={dailyTopicstyles.textInput}
                        value={answer}
                        onChangeText={setAnswer}
                        editable={!inputDisabled}
                    />
                    <TouchableOpacity
                        style={[
                            dailyTopicstyles.sendButton,
                            inputDisabled && { opacity: 0.5 },
                        ]}
                        onPress={handleSend}
                        disabled={inputDisabled}
                    >
                        <Text style={dailyTopicstyles.sendButtonText}>
                            전송
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ModalComponent
                visible={isModalVisible}
                onClose={closeModal}
                onGoToDiary={goToDiary}
            />
        </KeyboardAvoidingView>
    );
}
