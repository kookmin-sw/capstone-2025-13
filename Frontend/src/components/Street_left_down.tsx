import React from "react";
import { Image, ImageStyle } from "react-native";
import questStreetStyles from "../styles/questStreetStyles";

interface StreetLeftDownProps {
  style?: ImageStyle | ImageStyle[];
}

export default function Street_left_down ({ style }: StreetLeftDownProps) {
  return (
    <Image
      source={require("../assets/Images/street_left_down.png")}
      style={[questStreetStyles.image, style]}
    />
  );
}
