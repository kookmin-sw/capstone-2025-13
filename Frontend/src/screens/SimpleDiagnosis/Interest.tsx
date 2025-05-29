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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import signUpStyles from "../../styles/signUpStyles";
import type { RootStackParamList } from "../../App";


const Interest = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [interest, setInterest] = useState("");
    const [showError, setShowError] = useState(false);
    const route = useRoute<RouteProp<RootStackParamList, 'Interest'>>();
    const score = route.params?.score ?? 0;
    const nickname = route.params?.nickname ?? null;
    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
                source={require("../../assets/Images/simple-4-2.png")}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView contentContainerStyle={signUpStyles.overlay}>
                        <View style={signUpStyles.container}>
                            <Text style={signUpStyles.title}>관심사</Text>
                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>관심사</Text>
                                <TextInput
                                    placeholder="관심사를 알려줘!"
                                    style={signUpStyles.input}
                                    value={interest}
                                    onChangeText={setInterest}
                                />
                            </View>
                            <Text style={signUpStyles.errorText}>
                                {showError && !interest.trim() ? "관심사를 알려줘!" : ""}
                            </Text>

                            <View style={signUpStyles.row}>
                                <TouchableOpacity style={signUpStyles.backButton} onPress={() => navigation.goBack()}>
                                    <Text style={signUpStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={signUpStyles.signUpButton}
                                    onPress={() => {
                                        if (!interest.trim()) {
                                            setShowError(true);
                                            return;
                                        }
                                        setShowError(false);
                                        navigation.navigate('SimpleDiagnosis', {
                                            initialIndex: 20,
                                            score: score,
                                            nickname: nickname,
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

export default Interest;
