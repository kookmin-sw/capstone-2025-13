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
  title: string;
  subtitle: string;
}

export default function Tree({ type, title, subtitle }: TreeProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const treeImages = {
    apple: require("../assets/Images/apple_tree.png"),
    peach: require("../assets/Images/peach_tree.png"),
    forest: require("../assets/Images/forest.png"),
  };

  const sizeStyles = {
    apple: { width: 0.3, height: 0.33,},
    peach: { width: 0.37, height: 0.38 },
    forest: { width: 0.38, height: 0.35 },
  };

  return (
    <View style={treeElementStyles.container}>
      <TouchableOpacity
      activeOpacity={1}
        onPress={() => {
          if (title && subtitle) {
            navigation.navigate("Quest_stage", {
              title,
              subtitle,
            });
          } else {
            console.warn("title 또는 subtitle이 없습니다!");
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
        <Text style={treeElementStyles.nameText}>{title}</Text>
      </View>
    </View>
  );
}
