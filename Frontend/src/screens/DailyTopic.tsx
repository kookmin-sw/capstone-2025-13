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
import customAxios from "../API/axios";
import ApiResponseDTO from "../API/common";

export interface TopicFeedbackResponse {
    id: string;
    aiFeedback: string;
    data: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export enum TopicFeedbackStatus {
    QUEUED = "QUEUED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    PROCESSING_ERROR = "PROCESSING_ERROR"
}

export default function DailyTopic() {
    const [topicId, setTopicId] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<{ type: "question" | "answer"; text: string }[]>([]);
    const scrollRef = useRef<ScrollView>(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [placeholderText, setPlaceholderText] = useState("메세지를 입력하세요.");

    useEffect(() => {
        initializeChat();
    }, []);
    
    const initializeChat = async () => {
        try {
            const response = await customAxios.get("/topic/me");
            const topicData = response.data.data;
    
            const history: { type: "question" | "answer"; text: string }[] = [];
    
            // 처음 질문
            history.push({ type: "question", text: topicData.data });
    
            // 피드백 대화 (answer → question 쌍)
            topicData.feedbacks.forEach((feedback: any) => {
                history.push({ type: "answer", text: feedback.data });
                history.push({ type: "question", text: feedback.aiFeedback });
            });
    
            setTopicId(topicData.id);
            setChatHistory(history);
        } catch (error: any) {
            if (error.response?.status === 404 || error.response?.status === 409) {
                console.log("🆕 오늘의 topic이 없어 새로 생성합니다.");
                await handleCreateTopic(); // 기존 함수 활용
            } else {
                console.error("❌ 초기화 실패:", error.response?.data || error.message);
            }
        }
    };
    
    
    const handleCreateTopic = async () => {
        try {
            const response = await customAxios.put("/topic/create", {
                rate: 75,
                data: "",
            });

            const topicId = response.data.data.id;
            const questionText = response.data.data.data;

            setTopicId(topicId);
            setChatHistory([{ type: "question", text: questionText }]);

            await handleFetchFeedback(topicId);
        } catch (error: any) {
            if (error.response?.status === 409) {
                const existingTopicResponse = await customAxios.get("/topic/me");
                const existingTopicId = existingTopicResponse.data.data.id;
                const existingQuestionText = existingTopicResponse.data.data.data;

                setTopicId(existingTopicId);
                setChatHistory([{ type: "question", text: existingQuestionText }]);

                await handleFetchFeedback(existingTopicId);
            } else {
                console.error("❌ Failed to create topic:", error.response?.data || error.message);
            }
        }
    };

    const handleFetchFeedback = async (topicId: string) => {
        try {
            const response = await customAxios.get(`/topic/${topicId}`);
            const feedbacks = response.data.aiFeedback;
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
            const response = await customAxios.get<ApiResponseDTO<TopicFeedbackResponse>>(
                `/topic/feedback/${topicFeedbackId}`
            );

            const data = response.data.data;

            if (!data || data.status !== TopicFeedbackStatus.COMPLETED) {
                console.log(`⏳ Feedback not ready (attempt ${retryCount + 1}), retrying in 3s...`);
                setTimeout(() => fetchFeedbackWithRetry(topicFeedbackId, retryCount + 1), 3000);
                return;
            }

            console.log("✅ AI Feedback fetched:", data.aiFeedback);

            // AI 피드백(다음 질문) 추가
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
            const response = await customAxios.put(`/topic/feedback/${topicId}`, {
                data: answer,
            });

            console.log("📬 Feedback sent:", response.data);
            const topicFeedbackId = response.data.data;

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
                            source={require("../assets/Images/cloverProfile.png")}
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
