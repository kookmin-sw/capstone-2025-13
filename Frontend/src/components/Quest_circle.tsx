import React from "react";
import { StyleSheet, View, Image } from "react-native";

export default function Quest_circle() {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={require("../assets/Images/quest_circle.png")}
        style={styles.image}
        resizeMode="contain" // or "cover" depending on your image
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center", 
    paddingTop: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
});
