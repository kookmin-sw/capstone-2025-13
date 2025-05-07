import React from "react";
import { View, TextInput, Text } from "react-native";
import styles from "../styles/recordInputBoxStyles";

export default function RecordInputBox() {
    return (
        <View style={styles.wrapper}>
            <TextInput
                multiline
                placeholder="오늘 하루는 어땠어?\n오늘 있었던 일과 그때 느꼈던 감정들에 대해 자유롭게 적어봐!"
                placeholderTextColor="#999"
                style={styles.input}
            />
            <Text style={styles.caption}>
                오늘 하루는 별 몇 개 붙여줄 거야~?
            </Text>
        </View>
    );
}
