import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import signUpStyles from "../../styles/signUpStyles";
import type { RootStackParamList } from "../../App";
import { signUp } from "../../API/signAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TermsModal from "../../components/TermsModal";

type SignUpStep3NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep3">;
type SignUpStep3RouteProp = RouteProp<RootStackParamList, "SignUpStep3">;

const SignUpStep3 = () => {
    const navigation = useNavigation<SignUpStep3NavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [agreeSeviceTerms, setAgreeServiceTerms] = useState(false);
    const [agreeInfoTerms, setAgreeInfoTerms] = useState(false);
    const [modalType, setModalType] = useState<"service" | "info" | null>(null);

    const route = useRoute<SignUpStep3RouteProp>();

    const { nickname, gender, birthDate } = route.params;

    const handleSignUp = async () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const trimmedSecondPassword = secondPassword.trim();


        if (!trimmedEmail) {
            setErrorMessage("이메일을 입력하세요.");
            return;
        }
        if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
            setErrorMessage("유효한 이메일 형식을 입력하세요.");
            return;
        }
        if (!trimmedPassword) {
            setErrorMessage("비밀번호를 입력하세요.");
            return;
        }
        if (trimmedPassword.length < 8 || !/[A-Za-z]/.test(trimmedPassword) || !/\d/.test(trimmedPassword)) {
            setErrorMessage("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.");
            return;
        }
        if (trimmedPassword !== trimmedConfirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!/^\d{4}$/.test(trimmedSecondPassword)) {
            setErrorMessage("2차 비밀번호는 4자리 숫자여야 합니다.");
            return;
        }
        if (!agreeSeviceTerms || !agreeInfoTerms) {
            setErrorMessage("모든 필수 약관에 동의해주세요.");
            return;
        }
        try {
            await AsyncStorage.setItem("@secondPassword", trimmedSecondPassword);
            await signUp(trimmedEmail, trimmedPassword, nickname, birthDate, gender);
            navigation.navigate("SimpleDiagnosis", { initialIndex: 13 });
        } catch (error) {
            console.error("회원가입 실패:", error);
            if ((error as any).response?.status === 400) {
                setErrorMessage("이미 사용 중인 이메일입니다.");
            } else {
                setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };


    return (
        <ImageBackground
            source={require("../../assets/Images/simple-3-2.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // 필요 시 조절
            >
                <ScrollView style={{ flex: 1 }}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        paddingBottom: 20,
                    }}
                    keyboardShouldPersistTaps="handled">
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
                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>2차 비밀번호</Text>
                                <TextInput
                                    placeholder="2차 비밀번호"
                                    secureTextEntry
                                    keyboardType="numeric"
                                    maxLength={4}
                                    style={signUpStyles.input}
                                    value={secondPassword}
                                    onChangeText={(text) => {
                                        setSecondPassword(text);
                                        if (text.length === 4) {
                                            Keyboard.dismiss();
                                        }
                                    }}
                                />
                            </View>

                            {errorMessage !== "" && (
                                <Text style={signUpStyles.errorText}>{errorMessage}</Text>
                            )}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setAgreeServiceTerms(!agreeSeviceTerms)}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderWidth: 1,
                                        borderColor: '#89673F',
                                        backgroundColor: agreeSeviceTerms ? '#89673F' : '#fff',
                                        marginRight: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {agreeSeviceTerms && <Text style={{ color: '#fff' }}>✓</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setModalType("service")}>
                                    <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>[필수] 서비스 이용약관 </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setAgreeInfoTerms(!agreeInfoTerms)}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderWidth: 1,
                                        borderColor: '#89673F',
                                        backgroundColor: agreeInfoTerms ? '#89673F' : '#fff',
                                        marginRight: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {agreeInfoTerms && <Text style={{ color: '#fff' }}>✓</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setModalType("info")}>
                                    <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>[필수] 개인정보 수집 및 이용 동의</Text>
                                </TouchableOpacity>
                            </View>
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
                </ScrollView>
            </KeyboardAvoidingView>
            <TermsModal
                visible={modalType !== null}
                onClose={() => setModalType(null)}
                title={modalType === "service" ? "[필수] 서비스 이용약관" : "[필수] 개인정보 수집 및 이용 동의"}
                content={
                    modalType === "service"
                        ? require("../../constants/serviceTerms").default
                        : require("../../constants/infoTerms").default
                }
            />
        </ImageBackground>

    );
};

export default SignUpStep3;
