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
import dailyTopicstyles from "../styles/dailyTopicStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";

import { getUserInfo, UserInfoResponse } from "../API/userInfoAPI";
import {
    getTodayTopic,
    createTopic,
    getTopicDetails,
    submitFeedback,
    getFeedbackById,
    TopicFeedbackResponse,
    TopicFeedbackStatus
} from "../API/topicAPI";

export default function DailyTopic() {
    const [topicId, setTopicId] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<{ type: "question" | "answer"; text: string }[]>([]);
    const scrollRef = useRef<ScrollView>(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [placeholderText, setPlaceholderText] = useState("메세지를 입력하세요.");
    const [user, setUser] = useState<UserInfoResponse | null>(null);
    const navigation =
            useNavigation<NativeStackNavigationProp<RootStackParamList>>();


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
            const topicData = await getTodayTopic();

            const history: { type: "question" | "answer"; text: string }[] = [];
            history.push({ type: "question", text: topicData.data });

            topicData.feedbacks.forEach((feedback: any) => {
                history.push({ type: "answer", text: feedback.data });
                history.push({ type: "question", text: feedback.aiFeedback });
            });

            setTopicId(topicData.id);
            setChatHistory(history);
        } catch (error: any) {
            if (error.response?.status === 404 || error.response?.status === 409) {
                console.log("🆕 오늘의 topic이 없어 새로 생성합니다.");
                await handleCreateTopic();
            } else {
                console.error("❌ 초기화 실패:", error.response?.data || error.message);
            }
        }
    };

    const handleCreateTopic = async () => {
        try {
            const newTopic = await createTopic();

            setTopicId(newTopic.id);
            setChatHistory([{ type: "question", text: newTopic.data }]);

            await handleFetchFeedback(newTopic.id);
        } catch (error: any) {
            if (error.response?.status === 409) {
                const existingTopic = await getTodayTopic();

                setTopicId(existingTopic.id);
                setChatHistory([{ type: "question", text: existingTopic.data }]);

                await handleFetchFeedback(existingTopic.id);
            } else {
                console.error("❌ Failed to create topic:", error.response?.data || error.message);
            }
        }
    };

    const handleFetchFeedback = async (topicId: string) => {
        try {
            const feedbacks = await getTopicDetails(topicId);
            console.log("✅ Completed feedbacks fetched successfully!", feedbacks);
        } catch (error: any) {
            console.error("❌ Failed to fetch feedback:", error.response?.data || error.message);
        }
    };

    const fetchFeedbackWithRetry = async (topicFeedbackId: string, retryCount = 0) => {
        if (retryCount > 5) {
            console.error("❌ Too many retries. Feedback not completed.");
            return;
        }

        try {
            const data: TopicFeedbackResponse = await getFeedbackById(topicFeedbackId);

            if (!data || data.status !== TopicFeedbackStatus.COMPLETED) {
                console.log(`⏳ Feedback not ready (attempt ${retryCount + 1}), retrying in 3s...`);
                setTimeout(() => fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1), 3000);
                return;
            }

            console.log("✅ AI Feedback fetched:", data.aiFeedback);

            setChatHistory((prev) => [
                ...prev,
                { type: "question", text: data.aiFeedback }
            ]);
        } catch (error: any) {
            console.error("❌ Failed to fetch feedback:", error.response?.data || error.message);
            setTimeout(() => fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1), 3000);
        }
    };

    const handleSendFeedback = async (answer: string) => {
        if (!topicId) return;

        try {
            const topicFeedbackId = await submitFeedback(topicId, answer);
            setTimeout(() => fetchFeedbackWithRetry(topicFeedbackId), 3000);
        } catch (error: any) {
            if (error.response?.status === 403 && error.response?.data?.message === "Limit reached") {
                console.warn("⚠️ Limit reached. Disabling input.");
                setInputDisabled(true);
                setPlaceholderText("오늘은 세잎이와 충분히 대화했어!\n일기 써보는 건 어때?");
            } else {
                console.error("❌ Feedback failed:", error.response?.data || error.message);
            }
        }
    };

    const handleSend = () => {
        if (answer.trim() === "") return;

        setChatHistory((prev) => [...prev, { type: "answer", text: answer }]);
        const userAnswer = answer;
        setAnswer("");

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
                            <Answer answer={item.text} />
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
            keyboardVerticalOffset={80}
        >
            <View style={[dailyTopicstyles.container, { flex: 1 }]}>
                <TouchableOpacity
                    style={dailyTopicstyles.backButtonWrapper}
                    onPress={() => {
                    navigation.navigate("Home")}}
                >
                    <Ionicons name="arrow-back-circle" size={40} color="#349C64" />
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
                        style={[dailyTopicstyles.sendButton, inputDisabled && { opacity: 0.5 }]}
                        onPress={handleSend}
                        disabled={inputDisabled}
                    >
                        <Text style={dailyTopicstyles.sendButtonText}>전송</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
