import { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSecondPasswordGuard } from "../../hooks/useSecondPasswordGuard";
import { fetchDiagnosisList, getDiagnosisResult } from "../../API/diagnosisAPI";
import HeaderTitle from "../../components/HeaderTitle";
import EmotionChartBox from "../../components/FormalDiagnosis/EmotionChartBox";
import SectionLabel from "../../components/FormalDiagnosis/SectionLabel";
import MethodCard from "../../components/FormalDiagnosis/MethodCard";
import styles from "../../styles/FormalDiagnosis/formalDialogueStyles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export interface DiagnosisList {
    id: number;
    title: string;
}

export interface DiagnosisResult {
    id: string;
    diagnosisId: number;
    result: number;
    scale: number;
    createdAt: string;
    updatedAt: string;
}

export default function FormalDiagnosis() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [startDate, setStartDate] = useState<string>();
    const [diagnosisList, setDiagnosisList] = useState<DiagnosisList[]>([]);
    const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);

    useSecondPasswordGuard("FormalDiagnosis");

    useEffect(() => {
        const today = new Date();
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(today.getDate() - 13);

        const yyyy = twoWeeksAgo.getFullYear();
        const mm = String(twoWeeksAgo.getMonth() + 1).padStart(2, "0");
        const dd = String(twoWeeksAgo.getDate()).padStart(2, "0");

        const formatted = `${yyyy}-${mm}-${dd}`;
        setStartDate(formatted);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (startDate) {
                try {
                    const result = await getDiagnosisResult(startDate);
                    if (result) {
                        console.log("✅ 진단 결과:", result);
                        setDiagnosisResults(Array.isArray(result) ? result : []);

                    } else {
                        console.warn("⚠️ 진단 결과가 없습니다.");
                    }
                } catch (err) {
                    console.error("❌ 진단 결과 불러오기 실패:", err);
                }
            }
        };
        fetchResults();
    }, [startDate]);



    useEffect(() => {
        const loadDiagnosis = async () => {
            const result = await fetchDiagnosisList();
            if (result) {
                setDiagnosisList(result);
            }
        };
        loadDiagnosis();
    }, []);

    const groupAndSortResults = () => {
        const groupedResults: { [key: string]: DiagnosisResult[] } = {};

        diagnosisResults.forEach((result) => {
            const { diagnosisId } = result;
            if (!groupedResults[diagnosisId]) {
                groupedResults[diagnosisId] = [];
            }
            groupedResults[diagnosisId].push(result);
        });

        const formattedData = Object.keys(groupedResults).map((diagnosisId) => {
            const sortedResults = groupedResults[diagnosisId]?.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ) ?? [];

            const dates = sortedResults.map((result) => {
                const date = new Date(result.createdAt);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
            });
            const scores = sortedResults.map((result) => result.result);

            return {
                diagnosisId: Number(diagnosisId),
                data: scores ?? [],
                dates: dates ?? [],
            };
        });

        // 혹시라도 data가 없는 객체는 필터링
        return formattedData.filter(item => Array.isArray(item.data) && item.data.length > 0);
    };


    return (
        <View style={styles.container}>
            <HeaderTitle title="마음 건강 진단" />
            <EmotionChartBox subtitle="지난 2주 간 나의 마음 변화 흐름" data={groupAndSortResults()} />
            <ScrollView contentContainerStyle={styles.scroll}>
                <SectionLabel text="이런 방법들이 있어요" />
                {diagnosisList.map((item) => (
                    <MethodCard
                        key={item.id}
                        id={item.id}
                        label={item.title}
                        onPress={() => {
                            console.log(
                                `🟢 ${item.title} 버튼 클릭됨 (id: ${item.id})`
                            );
                            navigation.navigate("FormalDiagnosisSurvey", {
                                diagnosisId: item.id,
                            });
                        }}
                    />
                ))}
            </ScrollView>
        </View>
    );
}