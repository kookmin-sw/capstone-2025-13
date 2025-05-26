import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import Quest_emotion from "./screens/Quest/Quest_emotion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormalDiagnosis from "./screens/FormalDiagnosis/FormalDiagnosis";
import FormalDiagnosisSurvey from "./screens/FormalDiagnosis/FormalDiagnosis_survey";
import FormalDiagnosisResult from "./screens/FormalDiagnosis/FormalDiagnsis_result";
import GameScreen from "./screens/Game/GameScreen";
import DailyTopic from "./screens/DailyTopic";
import Spinner from "./screens/Spinner";
import HelpCall from "./screens/HelpCall/HelpCall";
import HelpCall2 from "./screens/HelpCall/HelpCall2";
import Calendar from "./screens/Calendar";
import UserInfo from "./screens/UserInfo";
import Record from "./screens/Record";
import SecondPassword from "./screens/SecondPassword";
import Toast from "react-native-toast-message";
import Interest from "./screens/SimpleDiagnosis/Interest";
import { useCustomFonts } from "./hooks/useCustomFonts";

import { LoadingProvider, useLoading } from "./API/contextAPI";
import Splash from "./screens/Splash";
import { requestChallenge, verifyDeviceIntegrity } from "./API/IntegrityAPI";
import { refreshAccessToken } from "./API/common";
import { StatusBar } from "expo-status-bar";

export type RootStackParamList = {
    Home: { simpleScale?: string };
    SignIn: { score?: number; last?: boolean };
    SignUpStep1: undefined;
    Quest: undefined;
    Quest_stage: { title: string, nickname: string };
    SimpleDiagnosis: {
        initialIndex: number;
        score?: number;
        nickname?: string;
        birthDate?: string;
        gender?: string;
    };
    Interest: { score?: number };
    SignUpStep2: { nickname: string };
    SignUpStep3: { nickname: string; birthDate: string; gender: string };
    Game: { score?: number };
    FormalDiagnosis: undefined;
    FormalDiagnosisSurvey: { diagnosisId: number };
    GameScreen: { score?: number };
    DailyTopic: {date?: string};
    Spinner: undefined;
    HelpCall: undefined;
    HelpCall2: undefined;
    UserInfo: undefined;
    Record: { date?: string };
    Quest_meditation: undefined;
    Quest_exercise: undefined;
    Quest_emotion: undefined;
    Calendar: undefined;
    SecondPassword: undefined;
    FormalDiagnosisResult: {
        diagnosisId: number;
        score: number;
        totalScore: number;
        scaleName: string;
        description: string;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GlobalSpinner = () => {
    const { isLoading } = useLoading();
    return isLoading ? <Spinner /> : null;
};

export default function App() {
    // 하드코딩된 로그인 상태

    const [loading, setLoading] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // ← true면 Home, false면 SignIn
    const [isIntegrityVerified, setIsIntegrityVerified] = useState<boolean>(true);
    const [integrityError, setIntegrityError] = useState<string | null>(null);

    useEffect(() => {
        const checkIntegrity = async () => {
            try {
                if (__DEV__) {
                    console.log('Development build - skipping integrity check');
                    setIsIntegrityVerified(true);
                    return;
                }

                await requestChallenge();
                console.log('Device integrity challenge sent');

                const result = await verifyDeviceIntegrity();
                console.log('Device integrity verification result:', result);

                if (result.isValid) {
                    console.log('Device integrity verified');
                    setIsIntegrityVerified(true);
                } else {
                    console.error(`Integrity verification failed: ${result.message} / ${result.details ? JSON.stringify(result.details) : 'No details provided'}`)
                    setIntegrityError(`${result.message} / ${result.details ?? 'No details provided'}`)
                    setIsIntegrityVerified(false)
                }
            } catch (error: any) {
                console.error('Integrity check error: ', error);
                console.debug(error)
                setIsIntegrityVerified(false)
                setIntegrityError(`${error}`)
            }
        };

        const checkToken = async () => {
            const token = await AsyncStorage.getItem("accessToken");
            console.log("🔍 accessToken:", token);
            if (token) {
                setIsLoggedIn(true);
            } else {
                console.log("❌ Token 없음. 로그인 상태 false, 로딩 해제");
                setIsLoggedIn(false);
            }
            setTimeout(() => {
                setLoading(false);
            }, 5500); // Delay splash screen for 1.5 seconds
        };
        checkIntegrity().then(() => checkToken());
    }, []);

    // App 로딩 중에 폰트 로딩 및 토큰 체크
    useEffect(() => {
        const interval = setInterval(async () => {
            const accessToken = await AsyncStorage.getItem("accessToken");
            const tokenExpiry = 15 * 60 * 1000; // 15분 (900000ms) 후 만료된다고 가정

            if (accessToken && tokenExpiry) {
                const expiryTime = new Date(tokenExpiry).getTime();
                const currentTime = new Date().getTime();

                // 5분 전까지 만료되면 갱신
                if (expiryTime - currentTime <= 5 * 60 * 1000) {
                    console.log("토큰 갱신 시도 중...");
                    try {
                        await refreshAccessToken(); // 토큰 갱신
                        console.log("토큰 갱신 성공");
                    } catch (error) {
                        console.error("토큰 갱신 실패:", error);
                    }
                } else {
                    console.log("토큰 유효함, 갱신 불필요");
                }
            } else {
                console.log("토큰 없음, 갱신 불필요");
            }
        }, 4 * 60 * 1000); // 4분마다 실행

        return () => clearInterval(interval); // cleanup
    }, []);

    // Now define AppContent here with isLoggedIn passed as prop
    const AppContent = () => {
        const fontsLoaded = useCustomFonts();

        // Show Splash while fonts are loading
        if (!fontsLoaded) return <Splash />;

        return (
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                    initialRouteName={isLoggedIn ? "Home" : "SimpleDiagnosis"}
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
                    <Stack.Screen
                        name="Interest"
                        component={Interest}
                        options={{ headerShown: false }}
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
                        name="Quest_emotion"
                        component={Quest_emotion}
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
                        name="FormalDiagnosisResult"
                        component={FormalDiagnosisResult}
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
                        name="HelpCall"
                        component={HelpCall}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="HelpCall2"
                        component={HelpCall2}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Calendar"
                        component={Calendar}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Record"
                        component={Record}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SecondPassword"
                        component={SecondPassword}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
                <Toast />
            </NavigationContainer>
        );
    };

    return (
        <LoadingProvider>
            {loading ? <Splash /> : <AppContent />}
        </LoadingProvider>
    );
}

