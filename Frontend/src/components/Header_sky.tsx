import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // NavigationProp 사용
import headerSkyStyles from "../styles/headerSkyStyles";

interface HeaderSkyProps {
  title: string;
  subtitle: string;
  screenName: string; // 화면 이름을 추가
}

export default function Header_sky({
  title,
  subtitle,
  screenName,
}: HeaderSkyProps) {
  // useNavigation을 사용할 때 타입을 명시적으로 지정
  const navigation = useNavigation<NavigationProp<any>>(); // `NavigationProp<any>`로 네비게이션 타입을 지정

  const handleBackPress = () => {
    if (screenName === "Quest_stage") {
      navigation.navigate("Quest"); // QuestStage -> Quest
    } else if (screenName === "Quest") {
      navigation.navigate("Home", {}); // Quest -> Home
    } else {
      navigation.goBack(); // 기본적으로 뒤로 가기
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Images/header_sky.png")}
      style={headerSkyStyles.background}
    >
      <View style={headerSkyStyles.container}>
        <View style={headerSkyStyles.row}>
          <TouchableOpacity
            onPress={handleBackPress} // handleBackPress 함수 호출
            style={headerSkyStyles.backButtonWrapper}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-circle" size={40} color="#fff" />
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
