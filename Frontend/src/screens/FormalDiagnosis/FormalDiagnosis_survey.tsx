import React from "react";
import { View, ScrollView } from "react-native";
import SurveyHeader from "../../components/SurveyHeader";
import SurveyQuestion from "../../components/SurveyQuestion";
import ConfirmButton from "../../components/ConfirmButton";
import styles from "../../styles/formalSurveyStyles";

export default function FormalDiagnosisSurvey() {
    // TODO: 서버에서 불러올 예정, 현재는 하드코딩된 질문들
    const questions = [
        "일 또는 여가 활동에 즐거움을 느끼지 못한다.",
        "먹고 싶지 않았고 식욕이 없었다.",
        "가끔 세상에 홀로 있는 듯한 외로움을 느낀다.",
        "도무지 뭘 해 나가야 할지 엄두가 나지 않는다.",
        "잠을 자도 피곤하고, 자고 싶지 않다.",
        "자신이 쓸모없는 사람이라고 느낀다.",
        "식욕이 없거나 너무 많다.",
    ];

    return (
        <View style={styles.container}>
            <SurveyHeader title="마음 건강 자가 문진" />

            <ScrollView contentContainerStyle={styles.scroll}>
                {questions.map((q, idx) => (
                    <SurveyQuestion key={idx} number={idx + 1} question={q} />
                ))}

                <ConfirmButton
                    label="검사 결과 확인하기"
                    onPress={() => console.log("확인")}
                />
            </ScrollView>
        </View>
    );
}
