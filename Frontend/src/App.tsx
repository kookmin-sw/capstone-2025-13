import React, { useEffect, useState, useRef } from "react";
import { useLoading, LoadingProvider } from "./hooks/LoadingContext";
import { useFonts } from "expo-font";
import {
    NavigationContainer,
    createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import SignIn from "./screens/SignIn";
import SignUpStep1 from "./screens/SignUp/SignUpStep1";
import SignUpStep2 from "./screens/SignUp/SignUpStep2";
import SimpleDiagnosis from "./screens/SimpleDiagnosis/SimpleDiagnosis";
import SignUpStep3 from "./screens/SignUp/SignUpStep3";
import Game from "./screens/Game/Game";
import Quest from "./screens/Quest/Quest";
import Quest_stage from "./screens/Quest/Quest_stage";
import Quest_meditation from "./screens/Quest/Quest_meditation";
import Quest_exercise from "./screens/Quest/Quest_exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormalDiagnosis from "./screens/FormalDiagnosis/FormalDiagnosis";
import FormalDiagnosisSurvey from "./screens/FormalDiagnosis/FormalDiagnosis_survey";
import GameScreen from "./screens/Game/GameScreen";
import DailyTopic from "./screens/DailyTopic";
import Spinner from "./screens/Spinner";
import HelpCall from "./screens/HelpCall/HelpCall";
import Calendar from "./screens/Calendar";
import HelpCall2 from "./screens/HelpCall/HelpCall2";
import UserInfo from "./screens/UserInfo";
import { refreshAccessToken } from "./API/signAPI";
import Calendar from "./screens/Calendar"
import Record from "./screens/Record";
import * as Integrity from "expo-app-integrity"
import {Alert, Platform} from "react-native";
import {verifyDeviceIntegrity} from "./API/IntegrityAPI";
import RestrictedAccessScreen from "./screens/RestrictedAccessScreen";

const navigationRef = createNavigationContainerRef();

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
    Record: undefined;
    Quest_meditation: undefined;
    Quest_exercise: undefined;
    Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
    // 하드코딩된 로그인 상태

    const [isIntegrityVerified, setIsIntegrityVerified] = useState(false);

    useEffect(() => {
        const checkIntegrity = async () => {
            try {
                if (__DEV__) {
                    console.log('Development build - skipping integrity check');
                    setIsIntegrityVerified(true);
                    return;
                }

                const result = await verifyDeviceIntegrity();

                if(result.isValid) {
                    console.log('Device integrity verified');
                    setIsIntegrityVerified(true);
                } else {
                    console.error('Integrity verification failed: ', result.message)
                }
            } catch (error: any) {
                console.error('Integrity check error:', error);
            }
        };

        checkIntegrity();
    }, []);

    if(!isIntegrityVerified) {
        return <RestrictedAccessScreen />;
    }
    const { isLoading, setLoading } = useLoading();

    const routeNameRef = useRef();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // ← true면 Home, false면 SignIn

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("accessToken");
            console.log("🔍 accessToken:", token);
            if (token) {
                setIsLoggedIn(true);
                console.log("✅ Token exists. setLoading(false) 호출됨");
                setLoading(false);
            } else {
                console.log("❌ Token 없음. 로그인 상태 false, 로딩 해제");
                setLoading(false);
            }
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

    console.log("📦 fontsLoaded:", fontsLoaded, "| isLoading:", isLoading);

    if (!fontsLoaded) return <Spinner />;

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.getCurrentRoute().name;
            }}
            onStateChange={() => {
                const previous = routeNameRef.current;
                const current = navigationRef.getCurrentRoute()?.name;

                if (!previous || previous === current) return;

                console.log("🌀 Navigation changed:", previous, "→", current);
                setLoading(true);
                setTimeout(() => setLoading(false), 500);

                routeNameRef.current = current;
            }}
        >
            {isLoading ? (
                <Spinner />
            ) : (
                <Stack.Navigator
                    initialRouteName={isLoggedIn ? "Home" : "Quest"}
                >
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SignIn"
                        options={{ headerShown: false }}
                    >
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
                    name="Quest_meditation"
                    component={Quest_meditation}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Quest_exercise"
                    component={Quest_exercise}
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
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="UserInfo"
                    component={UserInfo}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Record"
                    component={Record}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HelpCall"
                    component={HelpCall}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="HelpCall2" 
                    component={HelpCall2}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="Calendar" 
                    component={Calendar}
                    options={{ headerShown: false }} />
                </Stack.Screen>
              </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <LoadingProvider>
            <AppInner />
        </LoadingProvider>
    );
}
