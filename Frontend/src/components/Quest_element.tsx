import React from "react";
import {  Image, View, Text, TouchableOpacity} from "react-native";
import questElementStyles from "../styles/questElementStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";


interface QuestElementProps {
  name: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function Quest_element({ name, subtitle }: QuestElementProps) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={questElementStyles.container}>
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