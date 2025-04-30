import { Text, View } from "react-native";
import { answerStyle } from "../styles/QnAStyles";

interface AnswerProps {
    answer: string;
};

export default function Answer({ answer }: AnswerProps) {
    return (
        <View style={answerStyle.wrapper}>
            <View style={answerStyle.container}>
                <Text style={answerStyle.answerText}>{answer}</Text>
            </View>
        </View>

    );
};

