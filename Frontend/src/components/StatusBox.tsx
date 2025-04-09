import React from "react";
import { View, StyleSheet } from "react-native";

export default function StatusBox() {
    return (
        <View style={styles.box}>{/* 마음 상태 요약 or 이미지 자리 */}</View>
    );
}

const styles = StyleSheet.create({
    box: {
        height: 120,
        margin: 20,
        backgroundColor: "#EBEAD8",
        borderRadius: 20,
    },
});
