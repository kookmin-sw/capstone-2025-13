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
import DateTimePicker from "@react-native-community/datetimepicker";
import signUpStyles from "../../styles/signUpStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp } from "@react-navigation/native";

type SignUpStep2NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep2">;
type SignUpStep2RouteProp = RouteProp<RootStackParamList, "SignUpStep2">;

const SignUpStep2 = () => {
    const navigation = useNavigation<SignUpStep2NavigationProp>();
    const route = useRoute<SignUpStep2RouteProp>();
    const { nickname } = route.params;

    const [date, setDate] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isMale, setIsMale] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") hideDatePicker();
        if (selectedDate) setDate(selectedDate);
    };

    const handleSignUp = () => {
        if (isMale === null && !date) {
            setErrorMessage("정보를 입력하세요.");
            return;
        }
        if (isMale === null) {
            setErrorMessage("성별을 선택하세요.");
            return;
        }
        if (!date) {
            setErrorMessage("생년월일을 입력하세요.");
            return;
        }
        console.log(isMale)
        setErrorMessage("");
        navigation.navigate("SimpleDiagnosis", {
            initialIndex: 11,
            nickname,
            birthdate: date.toISOString().slice(0, 10),
            isMale
        });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={require("../../assets/Images/simple-3.png")}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                >
                    <ScrollView contentContainerStyle={signUpStyles.overlay}>
                        <View style={signUpStyles.container}>
                            <Text style={signUpStyles.title}>회원가입</Text>

                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>생년월일</Text>
                                <TouchableOpacity onPress={showDatePicker}>
                                    <TextInput
                                        style={signUpStyles.input}
                                        placeholder="YYYY-MM-DD"
                                        value={date ? date.toISOString().slice(0, 10) : ""}
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                </TouchableOpacity>

                                {isDatePickerVisible && (
                                    <DateTimePicker
                                        value={date ?? new Date()}
                                        mode="date"
                                        onChange={handleDateChange}
                                        display="spinner"
                                    />
                                )}
                            </View>

                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>성별</Text>
                                <View style={signUpStyles.row}>
                                    <TouchableOpacity
                                        onPress={() => setIsMale(true)}
                                        style={[
                                            signUpStyles.genderButton,
                                            isMale === true
                                                ? signUpStyles.maleSelected
                                                : signUpStyles.maleUnselected
                                        ]}
                                    >
                                        <Text style={signUpStyles.genderText}>남자</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setIsMale(false)}
                                        style={[
                                            signUpStyles.genderButton,
                                            isMale === false
                                                ? signUpStyles.femaleSelected
                                                : signUpStyles.femaleUnselected
                                        ]}
                                    >
                                        <Text style={signUpStyles.genderText}>여자</Text>
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
