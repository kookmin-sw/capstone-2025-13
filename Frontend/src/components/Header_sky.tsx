import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function Header_sky() {
  return (
    <ImageBackground
      source={require("../assets/Images/header_sky.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>퀘스트</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 160,
    paddingTop: 50,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center", 
  },
  imageStyle: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

    container: {
        paddingTop: 50,
        paddingHorizontal: 24,
        height: 160,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
    },
});