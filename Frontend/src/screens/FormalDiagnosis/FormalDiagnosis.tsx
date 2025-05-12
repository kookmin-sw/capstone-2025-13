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
import { fetchDiagnosisList, type DiagnosisList } from "../../API/diagnosisAPI";

export default function FormalDiagnosis() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [diagnosisList, setDiagnosisList] = useState<DiagnosisList[]>([]);

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
                            // @ts-ignore
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
