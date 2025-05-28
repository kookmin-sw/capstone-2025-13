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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import signUpStyles from "../../styles/signUpStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp } from "@react-navigation/native";
import useBlockBackHandler from "../../hooks/useBlockBackHandler";

type SignUpStep2NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep2">;
type SignUpStep2RouteProp = RouteProp<RootStackParamList, "SignUpStep2">;

const SignUpStep2 = () => {
    const navigation = useNavigation<SignUpStep2NavigationProp>();
    const route = useRoute<SignUpStep2RouteProp>();
    const { nickname } = route.params;

    const [date, setDate] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [gender, setGender] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const handleSignUp = () => {
        if (!gender && !date) {
            setErrorMessage("정보를 입력하세요.");
            return;
        }
        if (!gender) {
            setErrorMessage("성별을 선택하세요.");
            return;
        }
        if (!date) {
            setErrorMessage("생년월일을 입력하세요.");
            return;
        }

        // 날짜를 YYYY-MM-DD 형식으로 변환
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        setErrorMessage("");
        navigation.navigate("SimpleDiagnosis", {
            initialIndex: 11,
            nickname,
            birthDate: formattedDate,
            gender,
        });
    };

    useBlockBackHandler();

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={require("../../assets/Images/simple-3-2.png")}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                >
                    <ScrollView contentContainerStyle={signUpStyles.overlay}>
                        <View style={signUpStyles.container}>
                            <Text style={signUpStyles.title}>회원가입</Text>
                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>생년월일</Text>
                                <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
                                    <TextInput
                                        style={signUpStyles.input}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="#989898"
                                        value={date ? date.toISOString().slice(0, 10) : ""}
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                </TouchableOpacity>
                            </View>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                date={date ?? new Date()}
                                display={Platform.OS === "android" ? "spinner" : undefined}
                            />


                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>성별</Text>
                                <View style={signUpStyles.row}>
                                    <TouchableOpacity
                                        onPress={() => setGender("male")}
                                        style={[
                                            signUpStyles.genderButton,
                                            gender === "male"
                                                ? signUpStyles.maleSelected
                                                : signUpStyles.maleUnselected
                                        ]}
                                    >
                                        <Text style={signUpStyles.genderText}>남자</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setGender("female")}
                                        style={[
                                            signUpStyles.genderButton,
                                            gender === "female"
                                                ? signUpStyles.femaleSelected
                                                : signUpStyles.femaleUnselected
                                        ]}
                                    >
                                        <Text style={signUpStyles.genderText}>여자</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setGender("unknown")}
                                        style={[
                                            signUpStyles.genderButton,
                                            gender === "unknown"
                                                ? signUpStyles.secretSelected
                                                : signUpStyles.secretUnselected
                                        ]}
                                    >
                                        <Text style={signUpStyles.genderText}>비밀</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {errorMessage !== "" && (
                                <Text style={signUpStyles.errorText}>{errorMessage}</Text>
                            )}

                            <View style={signUpStyles.row}>
                                <TouchableOpacity
                                    style={signUpStyles.backButton}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={signUpStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={signUpStyles.signUpButton}
                                    onPress={handleSignUp}
                                >
                                    <Text style={signUpStyles.signUpText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default SignUpStep2;
