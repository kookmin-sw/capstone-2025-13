import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styles from "../../styles/FormalDiagnosis/methodCardStyles";
import { useDiagnosisColor } from "../../hooks/useDiagnosisColor";
interface MethodCardProps {
    label: string;
    id: number
    onPress?: () => void;
}


export default function MethodCard({ label, id, onPress }: MethodCardProps) {
    const getIconColor = useDiagnosisColor();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: getIconColor(id), justifyContent: "center", alignItems: "center" }]}>
                <Text style={styles.iconText}>
                    {label[0].toUpperCase()}
                </Text>
            </View>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}
