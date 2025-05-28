import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../styles/FormalDiagnosis/confirmButtonStyles";

export default function ConfirmButton({
    label,
    onPress,
    disabled,
}: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
}) {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabledButton]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
        </TouchableOpacity>
    );
}
