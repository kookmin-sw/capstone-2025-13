import React from "react";
import { View, Image, ViewStyle } from "react-native";
import questCircleStyles from "../styles/darkgreenCircleStyles";

interface DarkgreenCircleProps {
  style?: ViewStyle;
}

export default function Darkgreen_circle({ style }: DarkgreenCircleProps) {
  return (
    <View style={[questCircleStyles .imageContainer, style]}>
      <Image
        source={require("../assets/Images/darkgreen_circle.png")}
        style={questCircleStyles.image}
        resizeMode="stretch"
      />
    </View>
  );
}