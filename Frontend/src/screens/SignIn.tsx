import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,
} from "react-native";
import signInStyles from "../styles/signInStyles";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { signIn } from "../API/signAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { putDiagnosisResult } from "../API/diagnosisAPI";
import Toast from "react-native-toast-message";
import useBlockBackHandler from "../hooks/useBlockBackHandler";

const SignIn = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goBack = () => {
        navigation.navigate("SimpleDiagnosis", { initialIndex: 4 });
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    type SignInRouteProp = RouteProp<RootStackParamList, "SignIn">;
    const route = useRoute<SignInRouteProp>();
    const score = route.params?.score ?? 0;
    const last = route.params?.last ?? false;

    const getDepressionScale = (result: number): number => {
        if (result >= 8) return 8; // 심한 우울증
        if (result >= 6) return 6; // 중증도 우울증
        if (result >= 3) return 3; // 경미한 우울증
        return 0;                  // 없음 (정상)
    };
    const getScaleName = (result: number): string => {
        if (result >= 8) return '심한 우울증';
        if (result >= 6) return '중증도 우울증';
        if (result >= 3) return '경미한 우울증';
        return '정상';
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "이메일과 비밀번호를 입력해주세요.",
                position: "bottom",
            });
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await signIn(email, password);
            console.log("로그인 성공:", response.accessToken);
            await AsyncStorage.setItem('accessToken', response.accessToken);
            await AsyncStorage.setItem('refreshToken', response.refreshToken);

            if (last) {
                const id = 2; // 약식검사 아이디
                const result = score;
                const scale = getDepressionScale(result);
                const scaleName = getScaleName(result);
                console.log(id, result, scale, scaleName);
                try {
                    await putDiagnosisResult(id, scale, result);
                    console.log("✅ 진단 결과 저장 성공");
                } catch (err) {
                    console.error("❌ 진단 결과 저장 실패:", err);
                }
                navigation.navigate('Home', { simpleScale: scaleName });
            } else {
                navigation.navigate('Home', {});
            }
        } catch (error) {
            console.error("로그인 실패:", error);
            Toast.show({
                type: "error",
                text1: "로그인에 실패했습니다.",
                text2: "이메일과 비밀번호를 확인해주세요.",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    useBlockBackHandler();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={require("../assets/Images/simple-3-2.png")}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                >
                    <ScrollView contentContainerStyle={signInStyles.overlay}>
                        <View style={signInStyles.container}>
                            <Text style={signInStyles.title}>로그인</Text>

                            <View style={signInStyles.inputContainer}>
                                <Text style={signInStyles.inputTitle}>
                                    이메일
                                </Text>
                                <TextInput
                                    placeholder="이메일"
                                    placeholderTextColor="#989898"
                                    style={signInStyles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={signInStyles.inputContainer}>
                                <Text style={signInStyles.inputTitle}>
                                    비밀번호
                                </Text>
                                <TextInput
                                    placeholder="비밀번호"
                                    placeholderTextColor="#989898"
                                    secureTextEntry
                                    style={signInStyles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            <View style={signInStyles.row}>
                                <TouchableOpacity
                                    style={signInStyles.backButton}
                                    onPress={goBack}
                                >
                                    <Text style={signInStyles.backText}>
                                        뒤로가기
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={signInStyles.signInButton}
                                    onPress={handleSignIn}
                                >
                                    <Text style={signInStyles.signInText}>
                                        로그인
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default SignIn;
