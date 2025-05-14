import { useFonts } from "expo-font";
import fonts from "../constants/fonts";

export const useCustomFonts = () => {
    const [fontsLoaded] = useFonts({
        [fonts.dialogue]: require("../assets/fonts/DungGeunMo.ttf"),
        [fonts.primary]: require("../assets/fonts/Pretendard-Regular.otf"),
        [fonts.bold]: require("../assets/fonts/Pretendard-Bold.otf"),
        [fonts.semiBold]: require("../assets/fonts/Pretendard-SemiBold.otf"),
        [fonts.medium]: require("../assets/fonts/Pretendard-Medium.otf"),
        [fonts.light]: require("../assets/fonts/Pretendard-Light.otf"),
        [fonts.extraLight]: require("../assets/fonts/Pretendard-ExtraLight.otf"),
        [fonts.extraBold]: require("../assets/fonts/Pretendard-ExtraBold.otf"),
        [fonts.black]: require("../assets/fonts/Pretendard-Black.otf"),
        [fonts.thin]: require("../assets/fonts/Pretendard-Thin.otf"),
        [fonts.laundry]: require("../assets/fonts/LaundryGothic-Regular.ttf"),
        [fonts.laundryBold]: require("../assets/fonts/LaundryGothic-Bold.ttf"),
    });

    return fontsLoaded;
};
