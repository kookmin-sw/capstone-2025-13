// components/EmotionChartBox.tsx
import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/emotionChartBoxStyles";

export default function EmotionChartBox({ subtitle }: { subtitle: string }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.box} />
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}
