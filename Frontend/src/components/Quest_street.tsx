import React from "react";
import { Image, ImageStyle } from "react-native";
import questStreetStyles from "../styles/questStreetStyles";

interface QuestStreetProps {
  style?: ImageStyle | ImageStyle[];
}

export default function Quest_street({ style }: QuestStreetProps) {
  return (
    <Image
      source={require("../assets/Images/quest_street.png")}
      style={[questStreetStyles.image, style]}
    />
  );
}
