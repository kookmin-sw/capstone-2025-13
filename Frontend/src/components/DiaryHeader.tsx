import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/diaryHeaderStyles";

export default function DiaryHeader() {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일 ${
        ["일", "월", "화", "수", "목", "금", "토"][today.getDay()]
    }요일`;

    return (
        <View style={styles.header}>
            <Text style={styles.dateOnly}>{dateStr}</Text>
            <Text style={styles.titleText}>오늘의 일기</Text>
        </View>
    );
}
