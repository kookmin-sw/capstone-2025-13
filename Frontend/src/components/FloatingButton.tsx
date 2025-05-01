import React from "react";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles/floatingButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

export default function FloatingButton() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <>
            {/* 왼쪽 하단 버튼들 */}
            <View style={[styles.container, { left: 24, right: "auto" }]}>
                <TouchableOpacity style={styles.bubble} onPress={() => { navigation.navigate("DailyTopic") }}>
                    <MaterialCommunityIcons
                        name="message-text"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bubble} onPress={() => { navigation.navigate("HelpCall") }}>
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
