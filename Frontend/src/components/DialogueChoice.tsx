import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import dialogueChoiceStyles from "../styles/dialogueChoiceStyles";
import { RootStackParamList } from "../App";

type Option = {
    text: string;
    nextType?: "navigate" | "story" | "options";
    nextIndex?: number;
    navigateTo?: {
        screen: keyof RootStackParamList;
        params?: any;
    };
    score?: number;
};

interface DialogueChoiceProps {
    options: Option[];
    onSelect: (option: Option) => void;
}

const DialogueChoice = ({ options, onSelect }: DialogueChoiceProps) => {
    return (
        <View style={dialogueChoiceStyles.container}>
            {options.map((option, index) => (
                <View key={index} style={dialogueChoiceStyles.dialogueBox}>
                    <TouchableOpacity
                        style={dialogueChoiceStyles.dialogueTextBox}
                        onPress={() => onSelect(option)}
                    >
                        <Text style={dialogueChoiceStyles.dialogueText}>{option.text}</Text>
                        <TouchableOpacity
                            style={dialogueChoiceStyles.button}
                            onPress={() => onSelect(option)}
                        >
                            <View style={dialogueChoiceStyles.triangle} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

export default DialogueChoice;
