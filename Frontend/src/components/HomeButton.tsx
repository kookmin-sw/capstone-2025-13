import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import styles from "../styles/homeButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
    title: string;
    subtitle?: string;
    icon: string;
    onPress: () => void;
}

export default function HomeButton({ title, subtitle, icon, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <MaterialCommunityIcons
                name={icon as any}
                size={24}
                color="#5D432C"
                style={styles.icon}
            />
            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </TouchableOpacity>
    );
}
