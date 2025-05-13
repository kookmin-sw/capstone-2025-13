import React from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { useEffect, useState } from "react";

import HeaderTitle from "../../components/HeaderTitle";
import EmotionChartBox from "../../components/EmotionChartBox";
import SectionLabel from "../../components/SectionLabel";
import MethodCard from "../../components/MethodCard";
import styles from "../../styles/formalDialogueStyles";
import { fetchDiagnosisList } from "../../API/diagnosisAPI";
import { useSecondPasswordGuard } from "../../hooks/useSecondPasswordGuard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DiagnosisList {
    id: number;
    title: string;
}


export default function FormalDiagnosis() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [diagnosisList, setDiagnosisList] = useState<DiagnosisList[]>([]);

    useSecondPasswordGuard("FormalDiagnosis");
    useEffect(() => {
        AsyncStorage.setItem("secondPasswordPassed", "false");
    }, []);

    useEffect(() => {
        const loadDiagnosis = async () => {
            const result = await fetchDiagnosisList();
            if (result) {
                setDiagnosisList(result);
            }
        };
        loadDiagnosis();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderTitle title="마음 건강 진단" />
            <EmotionChartBox subtitle="지난 2주 간 나의 마음 변화 흐름" />
            <ScrollView contentContainerStyle={styles.scroll}>
                <SectionLabel text="이런 방법들이 있어요" />
                {diagnosisList.map((item) => (
                    <MethodCard
                        key={item.id}
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
