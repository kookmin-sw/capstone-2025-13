import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { signIn } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    const handleSignIn = async () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            console.log("로그인 시도:", { email, password });
            const response = await signIn(email, password);

            console.log("📦 응답 전체:", response);

            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error(
                    "토큰이 응답에 없습니다. 전체 응답: " +
                        JSON.stringify(response)
                );
            }

            console.log("✅ 로그인 성공, accessToken:", accessToken);

            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("refreshToken", refreshToken);

            navigation.navigate("Home");
        } catch (error) {
            console.error("❌ 로그인 실패:", error);
            setError(
                "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={require("../assets/Images/simple-3.png")}
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
                                    secureTextEntry
                                    style={signInStyles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                            {!email || !password ? (
                                <Text style={signInStyles.errorText}>
                                    이메일과 비밀번호를 입력해주세요.
                                </Text>
                            ) : null}
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
