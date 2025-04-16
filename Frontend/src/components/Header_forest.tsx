import React from "react";
import { View, Text, ImageBackground } from "react-native";
import styles from "../styles/headerForestStyles";

interface HeaderForestProps {
    title?: string;
    subtitle?: string;
}

export default function Header_forest({
    title = "우웅",
    subtitle,
}: HeaderForestProps) {
    return (
        <ImageBackground
            source={require("../assets/Images/header_forest.png")}
            style={styles.background}
            imageStyle={styles.image}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}
