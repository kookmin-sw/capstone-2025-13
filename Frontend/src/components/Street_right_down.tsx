import React from "react";
import { Image, ImageStyle } from "react-native";
import questStreetStyles from "../styles/questStreetStyles";

interface StreetRightDownProps {
  style?: ImageStyle | ImageStyle[];
}

export default function Street_right_down ({ style }: StreetRightDownProps) {
  return (
    <Image
      source={require("../assets/Images/street_right_down.png")}
      style={[questStreetStyles.image, style]}
    />
  );
}
