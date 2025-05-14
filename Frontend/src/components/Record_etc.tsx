import React from "react";
import { View, TextInput, ImageBackground } from "react-native";
import styles from "../styles/recordEtcStyles";

export default function RecordEtc() {
    return (
        <View style={styles.shadowWrapper}>  {/* 그림자만 담당 */}
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.textInput}
                    placeholder="오늘의 일기를 작성하며 느꼈던 감정이나 더 기록하고 싶은 내용이 있다면 여기에 적어줘! (선택)"
                    placeholderTextColor="#AFAFAF"
                    multiline
                    textAlignVertical="top"
                />
            </View>
        </View>

    );
}
