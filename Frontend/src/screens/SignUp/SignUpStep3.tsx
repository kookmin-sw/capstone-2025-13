import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import signUpStyles from "../../styles/signUpStyles";
import type { RootStackParamList } from "../../App";
import { signUp } from "../../API";

type SignUpStep3NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep3">;
type SignUpStep3RouteProp = RouteProp<RootStackParamList, "SignUpStep3">;

const SignUpStep3 = () => {
    const navigation = useNavigation<SignUpStep3NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const route = useRoute<SignUpStep3RouteProp>();

    const { nickname, gender, birthDate } = route.params;
   
    const handleSignUp = async () => {
        if (!email.trim()) {
            setErrorMessage("이메일을 입력하세요.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            setErrorMessage("유효한 이메일 형식을 입력하세요.");
            return;
        }
        if (!password) {
            setErrorMessage("비밀번호를 입력하세요.");
            return;
        }
        if (!confirmPassword) {
            setErrorMessage("비밀번호 확인을 입력하세요.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 모든 유효성 검사 통과 시
        try {
            console.log(email, nickname, password, birthDate, gender)
            await signUp(email, password, nickname, birthDate, gender);
            navigation.navigate('SimpleDiagnosis', { initialIndex: 13 });
        } catch (error) {
            console.error("회원가입 실패:", error);
            if ((error as any).response && (error as any).response.status === 400) {
                setErrorMessage("이미 사용 중인 이메일입니다.");
            } else {
                setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/Images/simple-3.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={signUpStyles.overlay}>
                <View style={signUpStyles.container}>
                    <Text style={signUpStyles.title}>회원가입</Text>

                    <View style={signUpStyles.inputContainer}>
                        <Text style={signUpStyles.inputTitle}>이메일</Text>
                        <TextInput
                            placeholder="이메일"
                            style={signUpStyles.input}
                            value={email}
                            onChangeText={setEmail} />
                    </View>

                    <View style={signUpStyles.inputContainer}>
                        <Text style={signUpStyles.inputTitle}>비밀번호</Text>
                        <TextInput
                            placeholder="비밀번호"
                            secureTextEntry
                            style={signUpStyles.input}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <View style={signUpStyles.inputContainer}>
                        <Text style={signUpStyles.inputTitle}>비밀번호 확인</Text>
                        <TextInput
                            placeholder="비밀번호 확인"
                            secureTextEntry
                            style={signUpStyles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>


                    {errorMessage !== "" && (
                        <Text style={signUpStyles.errorText}>{errorMessage}</Text>
                    )}

                    <View style={signUpStyles.row}>
                        <TouchableOpacity style={signUpStyles.backButton} onPress={() => navigation.goBack()}>
                            <Text style={signUpStyles.backText}>뒤로가기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                signUpStyles.signUpButton,
                            ]}
                            onPress={handleSignUp}
                        >
                            <Text style={signUpStyles.signUpText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

export default SignUpStep3;
