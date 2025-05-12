import React from "react";
import { View, TextInput, Text, ImageBackground, TouchableOpacity } from "react-native";
import styles from "../styles/recordInputBoxStyles";

export default function RecordInputBox() {
    return (
        <View style={styles.wrapper}>
            <ImageBackground
                source={require("../assets/Images/record_input.png")}
                resizeMode="stretch"
                style={styles.imageBackground}
            >
                <TextInput
                    multiline
                    placeholder={`오늘 하루는 어땠어?\n오늘 있었던 일과 그때 느꼈던\n감정들에 대해 자유롭게 적어봐!`}
                    placeholderTextColor="#555"
                    style={styles.input}
                />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttontext}>일기 제출하기</Text>
            </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}
