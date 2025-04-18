import React from "react";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles/floatingButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

export default function FloatingButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSignOut = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                const response = await signOut(accessToken, refreshToken);
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                console.log("로그아웃 성공:", response);
                navigation.navigate('SignIn');
            } else {
                console.error("Tokens are missing");
            }
        }
        catch (error) {
            console.error("로그아웃 실패:", error);
        }
    }
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
                        onPress={handleSignOut}
                    />
                </TouchableOpacity>
            </View>
        </>
    );
}
