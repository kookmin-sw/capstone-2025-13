// hooks/useBlockBackHandler.ts
import { useEffect } from "react";
import { BackHandler } from "react-native";

const useBlockBackHandler = () => {
    useEffect(() => {
        const onBackPress = () => {
            return true; // 뒤로가기 방지
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
};

export default useBlockBackHandler;
