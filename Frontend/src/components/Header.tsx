import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
    const today = new Date();
    const date = today.getDate();
    const day = today
        .toLocaleDateString("ko-KR", { weekday: "short" })
        .toUpperCase();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>우웅</Text>
            <View style={styles.dateBox}>
                <Text style={styles.day}>{day}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 24,
        backgroundColor: "#3FA057",
        height: 160,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
    },
    dateBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignItems: "center",
    },
    day: {
        fontSize: 12,
        color: "#F17300",
        fontWeight: "bold",
    },
    date: {
        fontSize: 18,
        color: "#F17300",
        fontWeight: "bold",
    },
});
