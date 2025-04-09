import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface MenuButtonProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onPress: () => void;
}

export default function MenuButton({
    title,
    subtitle,
    onPress,
}: MenuButtonProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#D8C7A1",
        padding: 20,
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#5D432C",
    },
    subtitle: {
        fontSize: 12,
        color: "#5D432C",
    },
});
