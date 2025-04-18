import React from "react";
import {  Image, View, Text, TouchableOpacity} from "react-native";
import appleElementStyles from "../styles/appleElementStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";


interface ForestProps {
  name: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function Forest({ name, subtitle }: ForestProps ) {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={appleElementStyles .container}>
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
          source={require("../assets/Images/forest.png")}
          style={appleElementStyles.icon}
        />
      </TouchableOpacity>

      <View style={appleElementStyles .nameContainer}>
        <Image
          source={require("../assets/Images/title.png")}
          style={appleElementStyles .name}
        />
        <Text style={appleElementStyles .nameText}>{name}</Text>
      </View>
    </View>
  );
}