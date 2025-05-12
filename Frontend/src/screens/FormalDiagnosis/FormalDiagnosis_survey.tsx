import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import SurveyHeader from "../../components/SurveyHeader";
import SurveyQuestion from "../../components/SurveyQuestion";
import ConfirmButton from "../../components/ConfirmButton";
import styles from "../../styles/formalSurveyStyles";

import { fetchDiagnosisDetail } from "../../API/diagnosisAPI";
import type { DiagnosisList } from "../../API/diagnosisAPI";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Scale = {
    start: number;
    scaleName: string;
    description: string;
};

export default function FormalDiagnosisSurvey() {
    const route = useRoute();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { diagnosisId } = route.params as { diagnosisId: string };
    const [questions, setQuestions] = useState<DiagnosisList["questions"]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [scales, setScales] = useState<Scale[]>([]);
    const [scaleName, setScaleName] = useState<string>();
    const [description, setDescription] = useState<string>();
    useEffect(() => {
        const loadDiagnosis = async () => {
            const result = await fetchDiagnosisDetail(Number(diagnosisId));
            if (result) {
                setQuestions(result.questions || []);
                setScales(result.scale || []);
            }
        };
        loadDiagnosis();
    }, [diagnosisId]);

    const getScaleResult = (
        totalScore: number,
        scaleList: Scale[]
    ): { scaleName: string; description: string } | null => {
        if (!Array.isArray(scaleList)) return null;
        const sorted = [...scaleList].sort((a, b) => b.start - a.start);
        const matched = sorted.find((s) => totalScore >= s.start);
        return matched ? { scaleName: matched.scaleName, description: matched.description } : null;
    };


    const getMaxTotalScore = () => {
        return questions.reduce((sum, q) => {
            const maxScore = Math.max(...q.answers.map(a => a.score));
            return sum + maxScore;
        }, 0);
    };

    const handleAnswer = (index: number, value: number) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleConfirm = () => {
        const totalScore = answers.reduce((sum, val) => sum + val, 0);
        const maxTotalScore = getMaxTotalScore();
        const scaleResult = getScaleResult(totalScore, scales);
        if (scaleResult) {
            setScaleName(scaleResult.scaleName);
            setDescription(scaleResult.description);
        }
        navigation.navigate("FormalDiagnosisResult", {
            diagnosisId: Number(diagnosisId),
            score: totalScore,
            totalScore: maxTotalScore,
            scaleName: scaleName ?? "",
            description: description ?? "",
        });
    };

    return (
        <View style={styles.container}>
            <SurveyHeader title="마음 건강 자가 문진" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {questions.length > 0 ? (
                    questions.map((q, idx) => (
                        <SurveyQuestion
                            key={q.seq}
                            number={idx + 1}
                            question={q.text}
                            answers={q.answers}
                            onAnswer={(score: number) => handleAnswer(idx, score)}
                        />

                    ))
                ) : (
                    <Text>질문지를 불러오는 중입니다...</Text>
                )}
                <ConfirmButton label="검사 결과 확인하기" onPress={handleConfirm} />
            </ScrollView>
        </View>
    );
}
