import React, { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ImageBackground,
    ScrollView
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import signUpStyles from "../../styles/signUpStyles";
import type { RootStackParamList } from "../../App";

type SignUpStep1NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep1">;

const SignUpStep1 = () => {
    const navigation = useNavigation<SignUpStep1NavigationProp>();
    const [nickname, setNickname] = useState("");
    const [showError, setShowError] = useState(false);

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
                source={require("../../assets/Images/simple-3.png")}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView contentContainerStyle={signUpStyles.overlay}>
                        <View style={signUpStyles.container}>
                            <Text style={signUpStyles.title}>회원가입</Text>
                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>닉네임</Text>
                                <TextInput
                                    placeholder="닉네임"
                                    style={signUpStyles.input}
                                    value={nickname}
                                    onChangeText={setNickname}
                                />
                            </View>
                            <Text style={signUpStyles.errorText}>
                                {showError && !nickname.trim() ? "닉네임을 입력하세요." : ""}
                            </Text>

                            <View style={signUpStyles.row}>
                                <TouchableOpacity style={signUpStyles.backButton} onPress={() => navigation.goBack()}>
                                    <Text style={signUpStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={signUpStyles.signUpButton}
                                    onPress={() => {
                                        if (!nickname.trim()) {
                                            setShowError(true);
                                            return;
                                        }
                                        setShowError(false);
                                        navigation.navigate('SimpleDiagnosis', {
                                            initialIndex: 9,
                                            nickname,
                                        });
                                    }}
                                >
                                    <Text style={signUpStyles.signUpText}>확인</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView >
            </ImageBackground>
        </TouchableWithoutFeedback>

    );
};

export default SignUpStep1;
