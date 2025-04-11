import React from "react";
import {  Image, View, Text, TouchableOpacity} from "react-native";
import questElementStyles from "../styles/questElementStyles";

interface QuestElementProps {
  name: string;
  onPress?: () => void;
}

export default function Quest_element({ name, onPress }: QuestElementProps) {
  return (
    <View style={questElementStyles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("../assets/Images/quest_icon.png")}
          style={questElementStyles.icon}
        />
      </TouchableOpacity>

      <View style={questElementStyles.nameContainer}>
        <Image
          source={require("../assets/Images/quest_title.png")}
          style={questElementStyles.name}
        />
        <Text style={questElementStyles.nameText}>{name}</Text>
      </View>
    </View>
  );
}