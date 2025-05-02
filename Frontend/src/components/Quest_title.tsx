import React from "react";
import { ImageBackground, View, Text, TouchableOpacity} from "react-native";
import styles from "../styles/questTitleStyles"; // 분리된 스타일 import

interface QuestTitleProps {
  text: string;
  style?: any;
  onPress?: () => void;
}

export default function Quest_title({ text, style, onPress }: QuestTitleProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.imageBackground, style]}>
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
    </TouchableOpacity>
  );
}
