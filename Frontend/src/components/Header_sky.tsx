import React from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native";

interface HeaderSkyProps {
  title?: string;
  subtitle?: string;
}

const { width } = Dimensions.get("window");

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
    width: '100%',
    height: width * 0.5,               // 반응형 높이 (예: iPhone 기준 약 200)    
    justifyContent: "center",
    alignItems: "flex-start",          // baseline → flex-start로 명확히
  },
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: width * 0.08,  
    paddingLeft: width * 0.07,           
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: width * 0.035,
    paddingLeft: width * 0.07,    
    color: "#fff",
    marginTop: width * 0.01,
  },
});
