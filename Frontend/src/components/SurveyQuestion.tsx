import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/surveyQuestionStyles";

interface SurveyQuestionProps {
    number: number;
    question: string;
    answers: { text: string; score: number }[];
    onAnswer: (score: number) => void; 
}

export default function SurveyQuestion({
    number,
    question,
    answers,
    onAnswer,
}: SurveyQuestionProps) {
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        setSelected(null);
    }, [question]);

    return (
        <View style={styles.questionBox}>
            <View style={styles.container}>
                <View style={styles.questionHeader}>
                    <View style={styles.numberBox}>
                        <Text style={styles.numberText}>
                            {number < 10 ? `0${number}` : number}
                        </Text>
                    </View>
                    <Text style={styles.questionText}>{question}</Text>
                </View>

                <View style={styles.choicesWrapper}>
                    {answers.map((answer, index) => (
                        <View key={index} style={styles.choiceItem}>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    selected === index && styles.circleSelected,
                                ]}
                                onPress={() => {
                                    setSelected(index);
                                    onAnswer(answer.score); 
                                }}
                            ></TouchableOpacity>
                            <Text
                                style={[
                                    styles.choiceLabel,
                                    selected === index && styles.choiceLabelSelected,
                                ]}
                            >
                                {answer.text}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
