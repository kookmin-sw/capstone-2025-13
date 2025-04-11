import React from "react";
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";

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
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  nameContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  nameText: {
    position: "absolute",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
