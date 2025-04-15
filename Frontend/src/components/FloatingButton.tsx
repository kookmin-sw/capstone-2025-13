import React from "react";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles/floatingButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FloatingButton() {
    return (
        <>
            {/* 왼쪽 하단 버튼들 */}
            <View style={[styles.container, { left: 24, right: "auto" }]}>
                <TouchableOpacity style={styles.bubble}>
                    <MaterialCommunityIcons
                        name="message-text"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bubble}>
                    <MaterialCommunityIcons
                        name="phone"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {/* 오른쪽 하단 계정 버튼 */}
            <View style={[styles.container, { left: "auto", right: 24 }]}>
                <TouchableOpacity style={styles.bubble}>
                    <MaterialCommunityIcons
                        name="account"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        </>
    );
}
