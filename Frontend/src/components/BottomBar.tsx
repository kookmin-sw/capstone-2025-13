import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function BottomBar() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <FontAwesome name="comment" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <FontAwesome name="phone" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginTop: 20,
    },
    button: {
        backgroundColor: "#3FA057",
        padding: 16,
        borderRadius: 50,
    },
});
