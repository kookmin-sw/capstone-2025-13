import React, {useEffect} from 'react';
import {
    Alert,
    BackHandler,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface RestrictedAccessScreenProps {
    error: string | null;
}

export default function RestrictedAccessScreen({error}: RestrictedAccessScreenProps) {
    useEffect(() => {
        Alert.alert(
            "보안 경고",
            `기기 무결성 검증에 실패했습니다. 앱을 종료합니다.\n${error || ''}`,
            [
                {
                    text: "확인",
                    onPress: () => BackHandler.exitApp()
                }
            ],
            {cancelable: false}
        );
    }, []);


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
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
