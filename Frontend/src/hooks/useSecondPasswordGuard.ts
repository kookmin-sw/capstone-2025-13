import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { AppState } from "react-native";
import Toast from "react-native-toast-message";

export const useSecondPasswordGuard = (currentScreen: keyof RootStackParamList) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [checking, setChecking] = useState(true);
    
    useEffect(() => {
    const checkSecondPassword = async () => {
        const password = await AsyncStorage.getItem("@secondPassword");
        const passed = await AsyncStorage.getItem("secondPasswordPassed");

        if (!password) {
            Toast.show({
                type: "error",
                text1: "2차 비밀번호가 설정되어 있지 않습니다.",
                text2: "사용자 정보 페이지에서 수정을 통해 설정해주세요.",
            });
            navigation.navigate("UserInfo");
            return;
        }

        if (passed !== "true") {
            navigation.reset({
                index: 0,
                routes: [{ name: "SecondPassword", params: { nextScreen: currentScreen } }],
            });
        } else {
            setChecking(false);
        }
    };
        checkSecondPassword();
        return () => {
            AsyncStorage.setItem("secondPasswordPassed", "false");
        };
    }, []);
    return checking;
};
