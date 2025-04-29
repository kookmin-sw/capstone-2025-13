import {
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Question from "../components/Question";
import Answer from "../components/Answer";
import dailyTopicstyles from "../styles/dailyTopicStyles";
import { Text } from "react-native";
import { useState, useRef, useEffect } from "react";

export default function DailyTopic() {
    const [answer, setAnswer] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<{ type: "question" | "answer"; text: string }[]>([]); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  
    const scrollRef = useRef<ScrollView>(null);

    const questionList = [
        "질문 1", "질문 2", "질문 3", "질문 4", "질문 5"
    ]; 

    useEffect(() => {
        if (questionList.length > 0) {
            setChatHistory(prevHistory => [
                ...prevHistory,
                { type: "question", text: questionList[0] }
            ]);
        }
    }, []);

    const handleSend = () => {
        if (answer.trim() === "") return;

        setChatHistory(prevHistory => [
            ...prevHistory,
            { type: "answer", text: answer }
        ]);
        setAnswer("");  

        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);

            if (currentQuestionIndex + 1 < questionList.length) {
                setChatHistory(prevHistory => [
                    ...prevHistory,
                    { type: "question", text: questionList[currentQuestionIndex + 1] }
                ]);
            }
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
                    {/* 채팅 기록 렌더링 */}
                    {renderChat()}
                </ScrollView>
                <View style={dailyTopicstyles.inputContainer}>
                    <TextInput
                        placeholder="메세지를 입력하세요."
                        style={dailyTopicstyles.textInput}
                        value={answer}
                        onChangeText={setAnswer}
                    />
                    <TouchableOpacity style={dailyTopicstyles.sendButton} onPress={handleSend}>
                        <Text style={dailyTopicstyles.sendButtonText}>전송</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
