import React from "react";
import { View, Image, ViewStyle } from "react-native";
import homeCircleStyles from "../styles/homeCircleStyles";

interface HomeCircleProps {
    style?: ViewStyle;
}

export default function HomeCircle({ style }: HomeCircleProps) {
    return (
        <View style={[homeCircleStyles.imageContainer, style]}>
            <Image
                source={require("../assets/Images/home_circle.png")}
                style={homeCircleStyles.image}
                resizeMode="cover"
            />
        </View>
    );
}
