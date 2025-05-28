import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import dialogueBoxStyles from "../styles/dialogueBoxStyles";
import { useCustomFonts } from "../hooks/useCustomFonts";

interface DialogueBoxProps {
    name: string;
    text: string;
    onPress: () => void;
}

const DialogueBox = ({ name, text, onPress }: DialogueBoxProps) => {
    const fontsLoaded = useCustomFonts();
    if (!fontsLoaded) {
        return (
            <View>

            </View>
        );
    }


    return (
        <View style={dialogueBoxStyles.dialogueBox}>
            <View style={dialogueBoxStyles.nametag}>
                <Text style={dialogueBoxStyles.nametagText}>{name}</Text>
            </View>
            <TouchableOpacity style={dialogueBoxStyles.button} onPress={onPress} activeOpacity={1}>
                <View style={dialogueBoxStyles.dialogueTextBox}>
                    <Text style={dialogueBoxStyles.dialogueText}>{text}</Text>
                    <View style={dialogueBoxStyles.triangle} />
                </View>
            </TouchableOpacity>
        </View >

    );
};


export default DialogueBox;
