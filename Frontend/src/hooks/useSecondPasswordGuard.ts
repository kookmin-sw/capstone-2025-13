// hooks/useSecondPasswordGuard.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

export const useSecondPasswordGuard = (currentScreen: keyof RootStackParamList) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [checking, setChecking] = useState(true); // 로딩 상태

    useEffect(() => {
        const checkSecondPassword = async () => {
            const passed = await AsyncStorage.getItem("secondPasswordPassed");
            if (passed !== "true") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "SecondPassword", params: { nextScreen: currentScreen } }],
                });
            } else {
                setChecking(false); // 통과되면 렌더 허용
            }
        };

        checkSecondPassword();

        return () => {
            AsyncStorage.setItem("secondPasswordPassed", "false");
        };
    }, []);

    return checking;
};
