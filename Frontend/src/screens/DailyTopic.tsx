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
    const [answerList, setAnswerList] = useState<string[]>([]);
    const [questionList, setQuestionList] = useState<string[]>([]);
    const scrollRef = useRef<ScrollView>(null);

    const questionCnt = 3;

    const handleSend = () => {
        if (answer.trim() === "") return;
        setAnswerList([...answerList, answer]);
        setAnswer("");
    };

    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [answerList]);

    const questions = () => (
        <View style={dailyTopicstyles.questionContainer}>
            <Image
                source={require("../assets/Images/cloverProfile.png")}
                style={dailyTopicstyles.cloverProfileImage}
            />
            <View style={dailyTopicstyles.contentContainer}>
                <Text>세잎이 ☘️</Text>
                {Array.from({ length: questionCnt }).map((_, index) => (
                    <View key={index} style={dailyTopicstyles.itemContainer}>
                        <Question
                            question={`질문 ${index + 1} aaaaaaaaaaaaadddddddddddddddcffffffffffffff`}
                        />
                    </View>
                ))}
            </View>
        </View>
    );

    const answers = () => (
        <View style={dailyTopicstyles.answerContainer}>
            <View style={dailyTopicstyles.contentContainer}>
                {answerList.map((ans, index) => (
                    <View key={index} style={dailyTopicstyles.itemContainer}>
                        <Answer answer={ans} />
                    </View>
                ))}
            </View>
            {answerList.length > 0 && (
                <Image
                    source={require("../assets/Images/cloverProfile.png")}
                    style={dailyTopicstyles.userProfileImage}
                />
            )}

        </View>
    );

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
                    {questions()}
                    {answers()}
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
