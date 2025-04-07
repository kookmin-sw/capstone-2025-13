import React from "react";
import { Text, View, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from "react-native";
import signInStyles from "../styles/signInStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

interface SignInProps {
    isVisible: boolean;
    onClose: () => void;
}

const SignIn = ({ isVisible, onClose }: SignInProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goBack = () => {
        navigation.navigate('SimpleDiagnosis', { initialIndex: 4 });
    };


    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={signInStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={signInStyles.container}>
                            <Text style={signInStyles.title}>로그인</Text>

                            <View style={signInStyles.inputContainer}>
                                <Text style={signInStyles.inputTitle}>이메일</Text>
                                <TextInput placeholder="이메일" style={signInStyles.input} />
                            </View>

                            <View style={signInStyles.inputContainer}>
                                <Text style={signInStyles.inputTitle}>비밀번호</Text>
                                <TextInput placeholder="비밀번호" secureTextEntry style={signInStyles.input} />
                            </View>

                            <View style={signInStyles.row}>
                                <TouchableOpacity style={signInStyles.backButton} onPress={goBack}>
                                    <Text style={signInStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={signInStyles.signInButton} onPress={() => { }}>
                                    <Text style={signInStyles.signInText}>로그인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
        </Modal >
    );
};

export default SignIn;
