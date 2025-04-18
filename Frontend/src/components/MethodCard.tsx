import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styles from "../styles/methodCardStyles";

interface MethodCardProps {
    label: string;
    onPress?: () => void;
}

export default function MethodCard({ label, onPress }: MethodCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconBox} />
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}
