import React from "react";
import { View, Text, ImageBackground } from "react-native";
import headerSkyStyles from "../styles/headerSkyStyles";

interface HeaderSkyProps {
    title?: string;
    subtitle?: string;
}
export default function Header_sky({
    title = "퀘스트",
    subtitle,
}: HeaderSkyProps) {
    return (
        <ImageBackground
            source={require("../assets/Images/header_sky.png")}
            style={headerSkyStyles.background}
        >
            <View style={headerSkyStyles.container}>
                <View>
                    <Text style={headerSkyStyles.title}>{title}</Text>
                    {subtitle && (
                        <Text style={headerSkyStyles.subtitle}>{subtitle}</Text>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}
