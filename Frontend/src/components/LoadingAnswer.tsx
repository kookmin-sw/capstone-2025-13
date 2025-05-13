import { Text, View } from "react-native";
import { answerStyle } from "../styles/QnAStyles";

interface AnswerProps {
    answer: string;
};

export default function LoadingAnswer({ answer }: AnswerProps) {
    return (
        <View style={answerStyle.wrapper}>
            <Text style={answerStyle.number}>1</Text> 
            <View style={answerStyle.container}>
                <Text style={answerStyle.answerText}>{answer}</Text>
            </View>
        </View>
    );
}
