import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import dialogueBoxStyles from "../styles/dialogueBoxStyles";
import { useCustomFonts } from "../hooks/useCustomFonts";

interface DialogueBoxProps {
    name: string;
    text: string;
}

const DialogueBox = ({ name, text }: DialogueBoxProps) => {
    const fontsLoaded = useCustomFonts();
    if (!fontsLoaded) return null;

    return (
        <View style={dialogueBoxStyles.dialogueBox}>
            <View style={dialogueBoxStyles.nametag}>
                <Text style={dialogueBoxStyles.nametagText}>{name}</Text>
            </View>
            <View style={dialogueBoxStyles.dialogueTextBox}>
                <Text style={dialogueBoxStyles.dialogueText}>{text}</Text>
                <TouchableOpacity style={dialogueBoxStyles.button} onPress={() => alert("눌렀다!")}>
                    <View style={dialogueBoxStyles.triangle} />
                </TouchableOpacity>
            </View>
        </View>

    );
};


export default DialogueBox;
