import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import dialogueChoiceStyles from "../styles/dialogueChoiceStyles";

interface DialogueChoiceProps {
    text: string;
}

const DialogueChoice = ({ text }: DialogueChoiceProps) => {
    return (
        <View style={dialogueChoiceStyles.dialogueBox} >
            <View style={dialogueChoiceStyles.dialogueTextBox}>
                <Text style={dialogueChoiceStyles.dialogueText}>{text}</Text>
                <TouchableOpacity style={dialogueChoiceStyles.button} onPress={() => alert("눌렀다!")}>
                    <View style={dialogueChoiceStyles.triangle} />
                </TouchableOpacity>
            </View>
        </View >

    );
}

export default DialogueChoice;