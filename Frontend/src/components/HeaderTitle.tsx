import React from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import styles from "../styles/headerTitleStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
const { width } = Dimensions.get("window");

export default function HeaderTitle({ title }: { title: string }) {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.backButtonWrapper}
            >
                <Ionicons name="arrow-back-circle" size={40} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}
