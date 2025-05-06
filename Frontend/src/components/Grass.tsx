import React from "react";
import { Image, View } from "react-native";
import grassElementStyles, { baseWidth } from "../styles/treeElementStyles";
// 트리 종류
type grassType = "one" | "two" | "three";

interface grassProps {
  type: grassType;
  title: string;
  subtitle: string;
}

export default function Grass({ type }: grassProps) {

  const grassImages = {
    one: require("../assets/Images/grass_2.png"),
    two: require("../assets/Images/grass_3.png"),
    three: require("../assets/Images/grass_4.png"),
  };

  const sizeStyles = {
    one: { width: 0.3, height: 0.33 },
    two: { width: 0.37, height: 0.31 },
    three: { width: 0.38, height: 0.32 },
  };


  return (
    <View style={grassElementStyles.container}>
        <Image
          source={grassImages[type]}
          style={[
            grassElementStyles.icon,
            {
              width: sizeStyles[type].width * baseWidth,
              height: sizeStyles[type].height * baseWidth,
            },
          ]}
        />
    </View>
  );
}
