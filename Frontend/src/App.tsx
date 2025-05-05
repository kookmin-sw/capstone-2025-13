import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import SignIn from "./screens/SignIn";
import SignUpStep1 from "./screens/SignUp/SignUpStep1";
import SignUpStep2 from "./screens/SignUp/SignUpStep2";
import SimpleDiagnosis from "./screens/SimpleDiagnosis/SimpleDiagnosis";
import SignUpStep3 from "./screens/SignUp/SignUpStep3";
import Game from "./screens/Game/Game";
import Quest from "./screens/Quest";
import Quest_stage from "./screens/Quest_stage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormalDiagnosis from "./screens/FormalDiagnosis/FormalDiagnosis";
import FormalDiagnosisSurvey from "./screens/FormalDiagnosis/FormalDiagnosis_survey";
import GameScreen from "./screens/Game/GameScreen";
import DailyTopic from "./screens/DailyTopic";
import Spinner from "./screens/Spinner";
import HelpCall from "./screens/HelpCall/HelpCall";
import UserInfo from "./screens/UserInfo";
import HelpCall2 from "./screens/HelpCall/HelpCall2";
import Calendar from "./screens/Calendar";

export type RootStackParamList = {
    Home: undefined;
    SignIn: undefined;
    SignUpStep1: undefined;
    Quest: undefined;
    Quest_stage: { title: string; subtitle?: string };
    SimpleDiagnosis: {
        initialIndex: number;
        score?: number;
        nickname?: string;
        birthDate?: string;
        gender?: string;
    };
    SignUpStep2: { nickname: string };
    SignUpStep3: { nickname: string; birthDate: string; gender: string };
    Game: { score?: number };
    FormalDiagnosis: undefined;
    FormalDiagnosisSurvey: undefined;
    GameScreen: undefined;
    DailyTopic: undefined;
    Spinner: undefined;
    HelpCall: undefined;
    HelpCall2: undefined;
    UserInfo: undefined;
    Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    // 하드코딩된 로그인 상태

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // ← true면 Home, false면 SignIn
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                setIsLoggedIn(true);
                setLoading(false);
            }
        };
        checkToken();
    }, []);

    const [fontsLoaded] = useFonts({
        "Pretendard-Regular": require("./assets/fonts/Pretendard-Regular.otf"),
        "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.otf"),
        "Pretendard-SemiBold": require("./assets/fonts/Pretendard-SemiBold.otf"),
        "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.otf"),
        "Pretendard-Light": require("./assets/fonts/Pretendard-Light.otf"),
        "Pretendard-ExtraLight": require("./assets/fonts/Pretendard-ExtraLight.otf"),
        "Pretendard-ExtraBold": require("./assets/fonts/Pretendard-ExtraBold.otf"),
        "Pretendard-Black": require("./assets/fonts/Pretendard-Black.otf"),
        "Pretendard-Thin": require("./assets/fonts/Pretendard-Thin.otf"),
        DungGeunMo: require("./assets/fonts/DungGeunMo.ttf"),
        "LaundryGothic-Regular": require("./assets/fonts/LaundryGothic-Regular.ttf"),
        "LaundryGothic-Bold": require("./assets/fonts/LaundryGothic-Bold.ttf"),
    });

    if (!fontsLoaded) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={isLoggedIn ? "Home" : "SimpleDiagnosis"}
            >
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="SignIn" options={{ headerShown: false }}>
                    {() => <SignIn />}
                </Stack.Screen>
                <Stack.Screen
                    name="SignUpStep1"
                    options={{ headerShown: false }}
                    component={SignUpStep1}
                />
                <Stack.Screen
                    name="SignUpStep2"
                    options={{ headerShown: false }}
                >
                    {() => <SignUpStep2 />}
                </Stack.Screen>
                <Stack.Screen
                    name="SignUpStep3"
                    options={{ headerShown: false }}
                >
                    {() => <SignUpStep3 />}
                </Stack.Screen>
                <Stack.Screen
                    name="SimpleDiagnosis"
                    options={{ headerShown: false }}
                    component={SimpleDiagnosis}
                />
                <Stack.Screen name="Game" options={{ headerShown: false }}>
                    {() => <Game />}
                </Stack.Screen>
                <Stack.Screen
                    name="Quest"
                    component={Quest}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Quest_stage"
                    component={Quest_stage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FormalDiagnosis" // FormalDiagnosis 화면 추가
                    component={FormalDiagnosis}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FormalDiagnosisSurvey" // FormalDiagnosisSurvey 화면 추가
                    component={FormalDiagnosisSurvey}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="GameScreen" // GameScreen 화면 추가
                    component={GameScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DailyTopic" // DailyTopic 화면 추가
                    component={DailyTopic}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Spinner" // Spinner 화면 추가
                    component={Spinner}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="HelpCall" // HelpCall 화면 추가
                    component={HelpCall}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="HelpCall2" // HelpCall 화면 추가
                    component={HelpCall2}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="UserInfo"
                    component={UserInfo}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Calendar"
                    component={Calendar}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
