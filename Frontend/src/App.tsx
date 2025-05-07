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
<<<<<<< HEAD
import Quest from "./screens/Quest";
import Quest_stage from "./screens/Quest_stage";
import Quest_emotion from "./screens/Quest_emotion";
=======
import Quest from "./screens/Quest/Quest";
import Quest_stage from "./screens/Quest/Quest_stage";
>>>>>>> 537c2b61c05572ac4e46adeb3c2792ce1a4f4713
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormalDiagnosis from "./screens/FormalDiagnosis/FormalDiagnosis";
import FormalDiagnosisSurvey from "./screens/FormalDiagnosis/FormalDiagnosis_survey";
import GameScreen from "./screens/Game/GameScreen";
import DailyTopic from "./screens/DailyTopic";
import Spinner from "./screens/Spinner";
import HelpCall from "./screens/HelpCall/HelpCall";
import UserInfo from "./screens/UserInfo";
import HelpCall2 from "./screens/HelpCall/HelpCall2";
import { refreshAccessToken } from "./API/signAPI";
import Calendar from "./screens/Calendar";
import Quest_meditation from "./screens/Quest/Quest_meditation";
import Quest_exercise from "./screens/Quest/Quest_exercise";
import SecondPassword from "./screens/SecondPassword";


export type RootStackParamList = {
    Home: undefined;
    SignIn: undefined;
    SignUpStep1: undefined;
    Quest: undefined;
<<<<<<< HEAD
    Quest_stage: { title:string; subtitle?: string };
    Quest_emotion: undefined;
=======
    Quest_stage: { title: string; subtitle?: string };
>>>>>>> 537c2b61c05572ac4e46adeb3c2792ce1a4f4713
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
    Quest_meditation: undefined;
    Quest_exercise: undefined;
    SecondPassword: { nextScreen: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    // 하드코딩된 로그인 상태

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // ← true면 Home, false면 SignIn
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            setIsLoggedIn(!!token);
            setLoading(false);
        };
        checkToken();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const accessToken = await AsyncStorage.getItem("accessToken");
            const tokenExpiry = await AsyncStorage.getItem("accessTokenExpiry");

            if (accessToken && tokenExpiry) {
                const expiryTime = new Date(tokenExpiry).getTime();
                const currentTime = new Date().getTime();

                // 5분 전까지 만료되면 갱신
                if (expiryTime - currentTime <= 5 * 60 * 1000) {
                    try {
                        await refreshAccessToken(); // 토큰 갱신
                    } catch (error) {
                        console.error("Token refresh failed", error);
                    }
                }
            }
        }, 5 * 60 * 1000); // 5분마다 토큰 갱신 체크

        return () => clearInterval(interval); // cleanup
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
<<<<<<< HEAD
                initialRouteName={"Quest_emotion"}
=======
                initialRouteName={isLoggedIn ? "Home" : "Quest"}
>>>>>>> 537c2b61c05572ac4e46adeb3c2792ce1a4f4713
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
<<<<<<< HEAD
                    name="Quest_emotion"
                    component={Quest_emotion}
=======
                    name="Quest_meditation"
                    component={Quest_meditation}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Quest_exercise"
                    component={Quest_exercise}
>>>>>>> 537c2b61c05572ac4e46adeb3c2792ce1a4f4713
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
                <Stack.Screen
                    name="SecondPassword"
                    component={SecondPassword}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
