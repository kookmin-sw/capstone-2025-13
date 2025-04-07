import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import signUpStyles from "../../styles/signUpStyles";
import type { RootStackParamList } from "../../App";

type SignUpStep3NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep3">;

const SignUpStep3 = () => {
    const navigation = useNavigation<SignUpStep3NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isCorrectPassword = password === confirmPassword;
    const isValidEmail = email.includes("@") && email.includes(".");
    const isFormValid = isValidEmail && isCorrectPassword && email && password && confirmPassword;

    return (
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
                <Text style={signUpStyles.errorText}>
                    {isCorrectPassword ? "" : "비밀번호가 일치하지 않습니다."}
                </Text>
                <View style={signUpStyles.row}>
                    <TouchableOpacity style={signUpStyles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={signUpStyles.backText}>뒤로가기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            signUpStyles.signUpButton,
                            !isFormValid && { opacity: 0.5 }
                        ]}
                        onPress={() => navigation.navigate('SimpleDiagnosis', { initialIndex: 13 })}
                        disabled={!isFormValid}
                    >
                        <Text style={signUpStyles.signUpText}>확인</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View >
    );
};

export default SignUpStep3;
