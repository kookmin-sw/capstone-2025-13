import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import headerSkyStyles from "../styles/headerSkyStyles";

interface HeaderSkyProps {
  title: string;
  subtitle: string;
  onBackPress?: () => void;
}

export default function Header_sky({
  title,
  subtitle,
  onBackPress,
}: HeaderSkyProps) {
  return (
    <ImageBackground
      source={require("../assets/Images/header_sky.png")}
      style={headerSkyStyles.background}
    >
      <View style={headerSkyStyles.container}>
        <View style={headerSkyStyles.row}>
            <TouchableOpacity
              onPress={onBackPress}
              style={headerSkyStyles.backButtonWrapper}
            >
                <Ionicons name="arrow-back-circle" size={40} color="#fff" />
              {/* 🎯 흰색 화살표 (배경 없음) */}
            </TouchableOpacity>
          
          <View style={headerSkyStyles.textWrapper}>
            <Text style={headerSkyStyles.title}>{title}</Text>
            <Text style={headerSkyStyles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
