import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import dialogueChoiceStyles from "../styles/dialogueChoiceStyles";

interface DialogueChoiceProps {
    text: string;
    onPress: () => void;
}

const DialogueChoice = ({ text, onPress }: DialogueChoiceProps) => {
    return (
        <View style={dialogueChoiceStyles.dialogueBox} >
            <View style={dialogueChoiceStyles.dialogueTextBox}>
                <Text style={dialogueChoiceStyles.dialogueText}>{text}</Text>
                <TouchableOpacity style={dialogueChoiceStyles.button} onPress={onPress}>
                    <View style={dialogueChoiceStyles.triangle} />
                </TouchableOpacity>
            </View>
        </View >

    );
}

export default DialogueChoice;