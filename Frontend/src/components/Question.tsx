import { Text, View } from "react-native";
import { questionStyle } from "../styles/QnAStyles";

interface QuestionProps {
    question: string;
};

export default function Question({ question }: QuestionProps) {
    return (
        <View style={questionStyle.wrapper}>
            <View style={questionStyle.container}>
                <Text style={questionStyle.questionText}>{question}</Text>
            </View>
        </View>

    );
};
