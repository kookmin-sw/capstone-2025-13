import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/emotionChartBoxStyles";
import dialogueStyles from "../styles/formalDialogueStyles";

export default function EmotionChartBox({ subtitle }: { subtitle: string }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.box} />
            <Text style={dialogueStyles.chartSubtitle}>{subtitle}</Text>
        </View>
    );
}
