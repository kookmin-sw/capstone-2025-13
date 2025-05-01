import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/submitDiaryButtonStyles";

export default function SubmitDiaryButton() {
    const handlePress = () => {
        console.log("일기 제출됨!");
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.text}>일기 제출하기</Text>
        </TouchableOpacity>
    );
}
