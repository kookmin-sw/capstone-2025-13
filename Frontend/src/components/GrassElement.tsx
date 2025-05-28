import React from "react";
import { Image, View } from "react-native";
import grassElementStyles, { baseWidth } from "../styles/treeElementStyles";
// 트리 종류
type grassType = "one" | "two" | "three"| "four";

interface grassProps {
  type: grassType;
}

export default function Grass({ type }: grassProps) {

  const grassImages = {
    one: require("../assets/Images/grass_2.png"),
    two: require("../assets/Images/grass_1.png"),
    three: require("../assets/Images/grass_3.png"),
    four: require("../assets/Images/grass_4.png"),
  };

  const sizeStyles = {
    width: 0.5, height: 0.41
  };


  return (
    <View style={grassElementStyles.container}>
        <Image
          source={grassImages[type]}
          style={[
            grassElementStyles.icon,
            {
              width: sizeStyles.width * baseWidth,
              height: sizeStyles.height * baseWidth,
            },
          ]}
        />
    </View>
  );
}
