import React from "react";
import { Image, ImageStyle } from "react-native";
import questStreetStyles from "../styles/questStreetStyles";

interface StreetBasicProps {
  style?: ImageStyle | ImageStyle[];
}

export default function Street_basic ({ style }: StreetBasicProps) {
  return (
    <Image
      source={require("../assets/Images/street_basic.png")}
      resizeMode="contain"
      style={[questStreetStyles.image, style]}
    />
  );
}
