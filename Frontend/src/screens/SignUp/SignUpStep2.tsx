import React, { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import signUpStyles from "../../styles/signUpStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

interface SignInProps {
    isVisible: boolean;
    onClose: () => void;
}
type SignUpStep2NavigationProp = NativeStackNavigationProp<RootStackParamList, "SignUpStep2">;

const SignUpStep2 = ({ isVisible, onClose }: SignInProps) => {
    const navigation = useNavigation<SignUpStep2NavigationProp>();

    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") hideDatePicker();
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={signUpStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={signUpStyles.container}>
                            <Text style={signUpStyles.title}>회원가입</Text>

                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>생년월일</Text>
                                <TouchableOpacity onPress={showDatePicker}>
                                    <TextInput
                                        style={signUpStyles.input}
                                        placeholder="YYYY-MM-DD"
                                        value={date.toISOString().slice(0, 10)}
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                </TouchableOpacity>

                                {isDatePickerVisible && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        onChange={handleDateChange}
                                        display="spinner"
                                    />
                                )}
                            </View>

                            <View style={signUpStyles.inputContainer}>
                                <Text style={signUpStyles.inputTitle}>성별</Text>
                                <View style={signUpStyles.row}>
                                    <TouchableOpacity style={signUpStyles.maleButton} onPress={onClose}>
                                        <Text style={signUpStyles.backText}>남자</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={signUpStyles.femaleButton} onPress={() => { }}>
                                        <Text style={signUpStyles.signUpText}>여자</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={signUpStyles.row}>
                                <TouchableOpacity style={signUpStyles.backButton} onPress={() => navigation.navigate('SimpleDiagnosis', { initialIndex: 9 })}>
                                    <Text style={signUpStyles.backText}>뒤로가기</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={signUpStyles.signUpButton} onPress={() => navigation.navigate('SimpleDiagnosis', { initialIndex: 11 })}>
                                    <Text style={signUpStyles.signUpText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SignUpStep2;
