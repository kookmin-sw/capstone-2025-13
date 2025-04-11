import React from "react";
import { StyleSheet, Image } from "react-native";

export default function Quest_title() {
  return (
      <Image
        source={require("../assets/Images/Quest_title.png")}
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
