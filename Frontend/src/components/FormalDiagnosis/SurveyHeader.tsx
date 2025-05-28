import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/FormalDiagnosis/surveyHeaderStyles";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

export default function SurveyHeader({ title }: { title: string }) {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.navigate("FormalDiagnosis",)}
                style={styles.backButtonWrapper}
            >
                <Ionicons name="arrow-back-circle" size={40} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}
