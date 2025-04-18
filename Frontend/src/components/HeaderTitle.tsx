import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import styles from "../styles/headerTitleStyles";

const { width } = Dimensions.get("window");

export default function HeaderTitle({ title }: { title: string }) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}
