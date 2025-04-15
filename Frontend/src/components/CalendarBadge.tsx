import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/calendarBadgeStyles";

export default function CalendarBadge({
    day,
    date,
}: {
    day: string;
    date: number;
}) {
    return (
        <TouchableOpacity style={styles.dateBox} onPress={() => {}}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.date}>{date}</Text>
        </TouchableOpacity>
    );
}
