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
  nickname: string;
}


export default function Tree({ type, title, nickname }: TreeProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const treeImages = {
    apple: require("../assets/Images/apple_tree.png"),
    peach: require("../assets/Images/peach_tree.png"),
    forest: require("../assets/Images/forest.png"),
  };

  const sizeStyles = {
    apple: { width: 0.3, height: 0.33 },
    peach: { width: 0.37, height: 0.31 },
    forest: { width: 0.38, height: 0.32 },
  };

  const handlePress = () => {
    navigation.navigate("Quest_stage", { title, nickname});
  };

  return (
    <View style={treeElementStyles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={{ alignItems: 'center'}}
      >
        <Image
          source={treeImages[type]}
          style={[
            treeElementStyles.icon,
            {
              width: sizeStyles[type].width * baseWidth,
              height: sizeStyles[type].height * baseWidth,
            },
          ]}
        />
        <View style={treeElementStyles.nameContainer}>
          <Image
            source={require("../assets/Images/title.png")}
            style={treeElementStyles.name}
          />
          <Text style={treeElementStyles.nameText}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
