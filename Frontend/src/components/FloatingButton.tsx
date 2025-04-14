import React from "react";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles/floatingButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FloatingButton() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.bubble}>
                <MaterialCommunityIcons
                    name="message-text"
                    size={24}
                    color="#fff"
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bubble}>
                <MaterialCommunityIcons name="phone" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}
