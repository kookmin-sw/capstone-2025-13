// Quest_circle.tsx
import React from "react";
import { View, Image, ViewStyle } from "react-native";
import questCircleStyles from "../styles/questCircleStyles";

interface QuestCircleProps {
  style?: ViewStyle;
}

export default function Quest_circle({ style }: QuestCircleProps) {
  return (
    <View style={[questCircleStyles .imageContainer, style]}>
      <Image
        source={require("../assets/Images/quest_circle.png")}
        style={questCircleStyles.image}
        resizeMode="cover"
      />
    </View>
  );
}