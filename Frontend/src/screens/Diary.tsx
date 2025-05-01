import React from "react";
import { View, ScrollView } from "react-native";
import DiaryHeader from "../components/DiaryHeader";
import DiaryInputBox from "../components/DiaryInputBox";
import StarRating from "../components/StarRating";
import SubmitDiaryButton from "../components/SubmitDiaryButton";
import styles from "../styles/diaryStyles";

export default function Diary() {
    return (
        <View style={styles.container}>
            <DiaryHeader />
            <ScrollView contentContainerStyle={styles.scroll}>
                <DiaryInputBox />
                <StarRating />
                <SubmitDiaryButton />
            </ScrollView>
        </View>
    );
}
