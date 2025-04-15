import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/calendarBadgeStyles";

export default function CalendarBadge({
    day,
    date,
}: {
    day: string;
    date: number;
}) {
    return (
        <View style={styles.dateBox}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.date}>{date}</Text>
        </View>
    );
}
