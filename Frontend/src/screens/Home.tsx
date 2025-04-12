import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

import Header from "../components/Header";
import StatusBox from "../components/StatusBox";
import MenuButton from "../components/MenuButton";
import BottomBar from "../components/BottomBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "../API";

export default function Home() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSignOut = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (accessToken && refreshToken) {
                signOut(accessToken, refreshToken);
            } else {
                console.error("Tokens are missing, cannot sign out.");
            }
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            navigation.navigate("SignIn");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }
    return (
        <ScrollView style={{ backgroundColor: "#F9F9E7", flex: 1 }}>
            <Header />
            <StatusBox />
            <MenuButton
                title="마음 건강 진단"
                subtitle="PHQ-9 기반 설문 자가 진단하기"
                onPress={() => { }}
            />
            <MenuButton title="일기" onPress={() => { }} />
            <MenuButton
                title="퀘스트"
                onPress={() => {
                    navigation.navigate("Quest");
                }}
            />
            <BottomBar />
            <TouchableOpacity onPress={handleSignOut} style={{ marginTop: 20, alignItems: "center" }}>
                <Text >로그아웃</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
