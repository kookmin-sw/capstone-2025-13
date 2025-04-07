import React from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import signUpStyles from "../../styles/signUpStyles";
import type { RootStackParamList } from "../../App";

type SignUpStep1NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep1">;

const SignUpStep1 = () => {
    const navigation = useNavigation<SignUpStep1NavigationProp>();

    return (
        <View style={signUpStyles.overlay}>
            <View style={signUpStyles.container}>
                <Text style={signUpStyles.title}>회원가입</Text>
                <View style={signUpStyles.inputContainer}>
                    <Text style={signUpStyles.inputTitle}>닉네임</Text>
                    <TextInput placeholder="닉네임" style={signUpStyles.input} />
                </View>
                <View style={signUpStyles.row}>
                    <TouchableOpacity style={signUpStyles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={signUpStyles.backText}>뒤로가기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={signUpStyles.signUpButton}
                        onPress={() => navigation.navigate("SimpleDiagnosis")}
                    >
                        <Text style={signUpStyles.signUpText}>확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SignUpStep1;
