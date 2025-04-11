// Header_sky.tsx

import React from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native";

interface HeaderSkyProps {
  title?: string;
  subtitle?: string;
}

const { width, height } = Dimensions.get("window");

export default function Header_sky({ title = "퀘스트", subtitle }: HeaderSkyProps) {
  return (
    <ImageBackground
      source={require("../assets/Images/header_sky.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: width,
    height: 200,
    paddingLeft:40,
    justifyContent: "center",
    alignItems: "baseline", 
  },
  container: {
    alignItems: "center",
    justifyContent: "center", 
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
});
