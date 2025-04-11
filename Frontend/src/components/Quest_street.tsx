import React from "react";
import { StyleSheet, Image } from "react-native";

export default function Quest_street() {
  return (
      <Image
        source={require("../assets/Images/quest_street.png")}
        style={styles.image}
      />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
