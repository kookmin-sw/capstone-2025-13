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
    ImageBackground
} from "react-native";
import signInStyles from "../styles/signInStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const SignIn = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goBack = () => {
        navigation.navigate('SimpleDiagnosis', { initialIndex: 4 });
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                                <Text style={signInStyles.inputTitle}>이메일</Text>
                                <TextInput
                                    placeholder="이메일"
                                    style={signInStyles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={signInStyles.inputContainer}>
                                <Text style={signInStyles.inputTitle}>비밀번호</Text>
                                <TextInput
                                    placeholder="비밀번호"
                                    secureTextEntry
                                    style={signInStyles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            <View style={signInStyles.row}>
                                <TouchableOpacity style={signInStyles.backButton} onPress={goBack}>
                                    <Text style={signInStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={signInStyles.signInButton} onPress={() => navigation.navigate('Home')}>
                                    <Text style={signInStyles.signInText}>로그인</Text>
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
