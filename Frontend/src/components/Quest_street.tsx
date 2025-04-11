import React from "react";
import { StyleSheet, Image, ImageStyle } from "react-native";

interface QuestStreetProps {
  style?: ImageStyle | ImageStyle[];
}

export default function Quest_street({ style }: QuestStreetProps) {
  return (
    <Image
    source={require("../assets/Images/quest_street.png")}
    style={[styles.image, style]} // 전달받은 style 적용
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    position: "absolute", // 꼭 있어야 겹칠 수 있음!
    alignSelf: "center",
    zIndex: -1,
    opacity: 0.9,
  },
});
