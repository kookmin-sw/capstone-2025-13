// Header_sky.tsx

import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

interface HeaderSkyProps {
  title?: string;
  subtitle?: string;
}

export default function Header_sky({ title = "퀘스트", subtitle }: HeaderSkyProps) {
  return (
    <ImageBackground
      source={require("../assets/Images/header_sky.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
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
    width: "100%",
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
