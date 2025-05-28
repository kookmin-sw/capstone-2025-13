import React, { useEffect, useState } from "react";
import { View, TextInput } from "react-native";
import styles from "../../styles/Record/recordEtcStyles";

type RecordEtcProps = {
    onRecordEtcUpdate: (text: string) => void;
    initialEtcText?: string;
    disabled?: boolean;
};

export default function RecordEtc({ onRecordEtcUpdate, initialEtcText = "", disabled = false, }: RecordEtcProps) {
    const [etcText, setEtcText] = useState<string>("");

    const handleTextChange = (text: string) => {
        setEtcText(text);
        onRecordEtcUpdate(text);
    };

    useEffect(() => {
        setEtcText(initialEtcText);
    }, [initialEtcText]);

    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.textInput}
                    editable={!disabled}
                    placeholder="오늘의 일기를 작성하며 느꼈던 감정이나 더 기록하고 싶은 내용이 있다면 여기에 적어줘! (선택)"
                    placeholderTextColor="#AFAFAF"
                    multiline
                    textAlignVertical="top"
                    value={etcText}
                    onChangeText={handleTextChange}
                />
            </View>
        </View>
    );
}
