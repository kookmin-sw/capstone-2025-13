import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import SurveyHeader from "../../components/SurveyHeader";
import SurveyQuestion from "../../components/SurveyQuestion";
import ConfirmButton from "../../components/ConfirmButton";
import styles from "../../styles/formalSurveyStyles";

import { fetchDiagnosisDetail } from "../../API/diagnosisAPI";  // 새로 만든 API 모듈 경로 맞게 조정
import type { DiagnosisList } from "../../API/diagnosisAPI"; 

export default function FormalDiagnosisSurvey() {
    const route = useRoute();
    const { diagnosisId } = route.params as { diagnosisId: string };

    const [questions, setQuestions] = useState<DiagnosisList["questions"]>([]);

    useEffect(() => {
        const loadDiagnosis = async () => {
            const result = await fetchDiagnosisDetail(Number(diagnosisId));
            if (result) {
                setQuestions(result.questions || []);
            }
        };

        loadDiagnosis();
    }, [diagnosisId]);

    return (
        <View style={styles.container}>
            <SurveyHeader title="마음 건강 자가 문진" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {questions.length > 0 ? (
                    questions.map((q, idx) => (
                        <SurveyQuestion
                            key={q.seq || idx}
                            number={idx + 1}
                            question={q.text}
                        />
                    ))
                ) : (
                    <Text>질문지를 불러오는 중입니다...</Text>
                )}

                <ConfirmButton
                    label="검사 결과 확인하기"
                    onPress={() => console.log("확인")}
                />
            </ScrollView>
        </View>
    );
}
