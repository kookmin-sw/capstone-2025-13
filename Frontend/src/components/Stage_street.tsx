import React from "react";
import { Image, ImageStyle } from "react-native";
import questStreetStyles from "../styles/questStreetStyles";

interface StageStreetProps {
  style?: ImageStyle | ImageStyle[];
}

export default function Stage_street ({ style }: StageStreetProps) {
  return (
    <Image
      source={require("../assets/Images/stage_street.png")}
      style={[questStreetStyles.image, style]}
    />
  );
}
