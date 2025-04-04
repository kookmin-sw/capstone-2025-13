import React from "react";
import { Text, View, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from "react-native";
import signUpStyles from "../../styles/signUpStyles";

interface SignInProps {
    isVisible: boolean;
    onClose: () => void;
}

const SignUpStep1 = ({ isVisible, onClose }: SignInProps) => {
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={signUpStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={signUpStyles.container}>
                            <Text style={signUpStyles.title}>회원가입</Text>
                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>닉네임</Text>
                                <TextInput placeholder="닉네임" style={signUpStyles.input} />
                            </View>
                            <View style={signUpStyles.row}>
                                <TouchableOpacity style={signUpStyles.backButton} onPress={onClose}>
                                    <Text style={signUpStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={signUpStyles.signUpButton} onPress={() => { }}>
                                    <Text style={signUpStyles.signUpText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
        </Modal >
    );
}

export default SignUpStep1;