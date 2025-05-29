import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/FormalDiagnosis/sectionLabelStyles";

export default function SectionLabel({ text }: { text: string }) {
    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    { color: text === "📈 나의 진단 결과" ? "#fff" : "#1AA85C" }
                ]}
            >
                {text}
            </Text>
        </View>
    );
}
