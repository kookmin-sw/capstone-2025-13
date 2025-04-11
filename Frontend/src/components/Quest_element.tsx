import React from "react";
import { StyleSheet, Image, View, Text, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface QuestElementProps {
  name: string;
  onPress?: () => void;
}

export default function Quest_element({ name, onPress }: QuestElementProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("../assets/Images/quest_icon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <View style={styles.nameContainer}>
        <Image
          source={require("../assets/Images/quest_title.png")}
          style={styles.name}
        />
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  icon: {
    width: width * 0.25,       // 전체 화면 너비의 25%
    height: width * 0.25,
    marginBottom: width * 0.02,
  },
  nameContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    width: width * 0.3,
    height: width * 0.1,
    resizeMode: "contain",
  },
  nameText: {
    position: "absolute",
    color: "#fff",
    fontSize: width * 0.04,     // 화면 너비 기준 폰트 크기 (약 15~18 정도)
    fontWeight: "bold",
  },
});
