import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/calendarBadgeStyles";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function CalendarBadge({
    day,
    date,
}: {
    day: string;
    date: number;
}) {
    const navigation = useNavigation<NavigationProp<any>>();
    return (
        <TouchableOpacity style={styles.dateBox} onPress={() => navigation.navigate('Calendar')}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.date}>{date}</Text>
        </TouchableOpacity>
    );
}
