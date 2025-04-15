import React from "react";
import { View, Text, ImageBackground } from "react-native";
import styles from "../styles/headerForestStyles";
import CalendarBadge from "./CalendarBadge";

export default function Header_forest() {
    const today = new Date();
    const date = today.getDate();
    const day = today
        .toLocaleDateString("ko-KR", { weekday: "short" })
        .toUpperCase();

    return (
        <View style={styles.wrapper}>
            <ImageBackground
                source={require("../assets/Images/header_forest.png")}
                style={styles.background}
                imageStyle={styles.image}
                resizeMode="cover"
            />
            <View style={styles.container}>
                <Text style={styles.title}>우웅</Text>
                <CalendarBadge day={day} date={date} />
            </View>
        </View>
    );
}
