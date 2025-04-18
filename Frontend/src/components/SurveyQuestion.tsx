import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/surveyQuestionStyles";

const choices = ["매우 아니다", "아니다", "보통이다", "그렇다", "매우 그렇다"];

export default function SurveyQuestion({
    number,
    question,
}: {
    number: number;
    question: string;
}) {
    const [selected, setSelected] = useState<number | null>(null);

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
                    {choices.map((label, index) => (
                        <View key={index} style={styles.choiceItem}>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    selected === index && styles.circleSelected,
                                ]}
                                onPress={() => setSelected(index)}
                            ></TouchableOpacity>
                            <Text
                                style={[
                                    styles.choiceLabel,
                                    selected === index &&
                                        styles.choiceLabelSelected,
                                ]}
                            >
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
