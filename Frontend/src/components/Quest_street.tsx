import React from "react";
import { StyleSheet, Image, Dimensions, ImageStyle } from "react-native";

const { width } = Dimensions.get("window");

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
    width: width * 0.5,             // 화면 너비의 50%
    height: width * 0.5,            // 정사각형으로 유지
    position: "absolute",
    alignSelf: "center",
    zIndex: -1,
    opacity: 0.9,
  },
});
