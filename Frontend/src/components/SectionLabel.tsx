import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/sectionLabelStyles";

export default function SectionLabel({ text }: { text: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{text}</Text>
        </View>
    );
}
