import React from "react";
import {  Image, View, Text, TouchableOpacity} from "react-native";
import peachElementStyles from "../styles/peachElementStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";


interface PeachTreeProps {
  name: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function Peach_tree({ name, subtitle }: PeachTreeProps ) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={peachElementStyles.container}>
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
          source={require("../assets/Images/peach_tree.png")}
          style={peachElementStyles.icon}
        />
      </TouchableOpacity>

      <View style={peachElementStyles.nameContainer}>
        <Image
          source={require("../assets/Images/title.png")}
          style={peachElementStyles.name}
        />
        <Text style={peachElementStyles.nameText}>{name}</Text>
      </View>
    </View>
  );
}