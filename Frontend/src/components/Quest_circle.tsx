import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Quest_circle() {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={require("../assets/Images/quest_circle.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: width,
        height: 900,
        alignItems: "center",
        justifyContent: "flex-end",
      },
      image: {
        width: width,
        height: height,
      },
  });