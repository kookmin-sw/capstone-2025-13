import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../styles/FormalDiagnosis/confirmButtonStyles"

export default function ConfirmButton({
    label,
    onPress,
}: {
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}
