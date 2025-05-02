import React from "react";
import { ImageBackground, View, Text } from "react-native";
import styles from "../styles/questTitleStyles"; // 분리된 스타일 import

interface QuestTitleProps {
  text: string;
  style?: any;
}

export default function Quest_title({ text, style }: QuestTitleProps) {
  return (
    <ImageBackground
      source={require("../assets/Images/quest_title.png")}
      style={[styles.imageBackground, style]}
      imageStyle={{ resizeMode: "contain" }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>오 늘 의  미 션!</Text>
        <Text style={styles.subtitle}>{text}</Text>
      </View>
    </ImageBackground>
  );
}
