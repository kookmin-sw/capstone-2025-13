import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SurveyHeader from "../../components/SurveyHeader";
import SurveyQuestion from "../../components/SurveyQuestion";
import ConfirmButton from "../../components/ConfirmButton";
import styles from "../../styles/formalSurveyStyles";
import {DiagnosisQuestion} from "../../API/diagnosisAPI";

// 🔄 토큰 재발급 함수
const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    try {
        const res = await axios.post("https://wuung.mori.space/auth/refresh", {
            refreshToken: refreshToken,
        });
        const newAccessToken = res.data.data.accessToken;
        await AsyncStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("❌ 토큰 재발급 실패:", error);
        return null;
    }
};

export default function FormalDiagnosisSurvey() {
    const route = useRoute();
    const { diagnosisId } = route.params as { diagnosisId: string };

    const [questions, setQuestions] = useState<DiagnosisQuestion[]>([]);

    useEffect(() => {
        const fetchDiagnosis = async () => {
            let token = await AsyncStorage.getItem("accessToken");
            if (!token) return;

            try {
                const response = await axios.get(
                    `https://wuung.mori.space/diagnosis/${diagnosisId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setQuestions(response.data?.data?.questions || []);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    console.log("🔄 토큰 만료됨. 재발급 시도");
                    token = await refreshAccessToken();
                    if (token) {
                        try {
                            const retryResponse = await axios.get(
                                `https://wuung.mori.space/diagnosis/${diagnosisId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            setQuestions(
                                retryResponse.data?.data?.questions || []
                            );
                        } catch (retryError) {
                            console.error("❌ 재시도 실패:", retryError);
                        }
                    }
                } else {
                    console.error("❌ 진단 데이터 요청 실패:", error);
                }
            }
        };

        fetchDiagnosis();
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
