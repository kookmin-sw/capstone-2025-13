// components/InfoRow.tsx
import React from "react";
import { View, Text, TextInput } from "react-native";
import userInfoStyles from "../../styles/UserInfo/userInfoStyles";

type InfoRowProps = {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    editable?: boolean;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "number-pad" | "numeric" | "email-address" | "phone-pad";
    maxLength?: number;
};

export default function InfoRow({
    label,
    value,
    onChangeText,
    editable = true,
    secureTextEntry = false,
    keyboardType = "default",
    maxLength = 20,
}: InfoRowProps) {
    return (
        <View style={userInfoStyles.row}>
            <Text style={userInfoStyles.label}>{label}</Text>
            <TextInput
                style={[
                    userInfoStyles.input,
                    !editable && userInfoStyles.inputDisabled
                ]}
                value={value}
                editable={editable}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                maxLength={maxLength}
                placeholder={editable ? label : undefined}
                placeholderTextColor={editable ? "#999" : "#ccc"}
            />
        </View>
    );
}
