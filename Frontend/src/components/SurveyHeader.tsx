import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/surveyHeaderStyles";

export default function SurveyHeader({ title }: { title: string }) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}
