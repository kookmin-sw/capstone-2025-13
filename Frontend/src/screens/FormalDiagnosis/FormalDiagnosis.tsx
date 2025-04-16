import React from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

import HeaderTitle from "../../components/HeaderTitle";
import EmotionChartBox from "../../components/EmotionChartBox";
import SectionLabel from "../../components/SectionLabel";
import MethodCard from "../../components/MethodCard";
import styles from "../../styles/formalDialogueStyles";

export default function FormalDiagnosis() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <HeaderTitle title="마음 건강 진단" />
            <EmotionChartBox subtitle="지난 2주 간 나의 마음 변화 흐름" />
            <ScrollView contentContainerStyle={styles.scroll}>
                <SectionLabel text="이런 방법들이 있어요" />
                <MethodCard
                    label="BDI 기반 정식 검사"
                    onPress={() => {
                        console.log("BDI 기반 정식 검사 버튼 클릭됨");
                        navigation.navigate("FormalDiagnosisSurvey");
                    }}
                />
                <MethodCard
                    label="MMPI-2 검사"
                    onPress={() => console.log("MMPI-2 검사 버튼 클릭됨")}
                />
                <MethodCard
                    label="SCT 문장 완성 검사"
                    onPress={() =>
                        console.log("SCT 문장 완성 검사 버튼 클릭됨")
                    }
                />
                <MethodCard
                    label="TCI 기질 검사"
                    onPress={() => console.log("TCI 기질 검사 버튼 클릭됨")}
                />
            </ScrollView>
        </View>
    );
}
