// components/Tree.tsx
import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import treeElementStyles, { baseWidth } from "../styles/treeElementStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

// 트리 종류
type TreeType = "apple" | "peach" | "forest";

interface TreeProps {
  type: TreeType;
  name: string;
  subtitle?: string;
}

export default function Tree({ type, name, subtitle }: TreeProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 이미지와 스타일 동적 선택
  const treeImages = {
    apple: require("../assets/Images/apple_tree.png"),
    peach: require("../assets/Images/peach_tree.png"),
    forest: require("../assets/Images/forest.png"),
  };

  // 타입별 width, height 설정
  const sizeStyles = {
    apple: { width: 0.3, height: 0.33,},
    peach: { width: 0.37, height: 0.38 },
    forest: { width: 0.38, height: 0.35 },
  };

  return (
    <View style={treeElementStyles.container}>
      <TouchableOpacity
        onPress={() => {
          if (subtitle) {
            navigation.navigate("Quest_stage", { subtitle });
          } else {
            console.warn("subtitle이 없습니다!");
          }
        }}
      >
        <Image
          source={treeImages[type]}
          style={[
            treeElementStyles.icon,
            { width: sizeStyles[type].width * baseWidth, height: sizeStyles[type].height * baseWidth },
          ]}
        />
      </TouchableOpacity>

      <View style={treeElementStyles.nameContainer}>
        <Image
          source={require("../assets/Images/title.png")}
          style={treeElementStyles.name}
        />
        <Text style={treeElementStyles.nameText}>{name}</Text>
      </View>
    </View>
  );
}
