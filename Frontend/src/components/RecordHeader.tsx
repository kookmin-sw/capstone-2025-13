import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/recordHeaderStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";


interface RecordHeaderProps {
    title: string;
    date: string;
}
export default function RecordHeader({ title, date }: RecordHeaderProps) {
    console.log("RecordHeader", title, date);
    const parsedDate = new Date(date);
    const dateStr = `${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일 ${["일", "월", "화", "수", "목", "금", "토"][parsedDate.getDay()]
        }요일`;
    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButtonWrapper}
                onPress={() => {
                    navigation.navigate("Home", {})
                }}
            >
                <Ionicons name="arrow-back-circle" size={40} color="#349C64" />
            </TouchableOpacity>
            <View style={styles.textWrapper}>
                <Text style={styles.dateOnly}>{dateStr}</Text>
                <Text style={styles.titleText}>{title}</Text>
            </View>

        </View>
    );
}