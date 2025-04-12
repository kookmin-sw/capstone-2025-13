import React from "react";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import questMissionStyles from "../styles/questMissionStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

interface QuestMissionProps {
  missiontitle: string;
  onPress?: () => void;
}

export default function Quest_mission({ missiontitle, onPress }: QuestMissionProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={questMissionStyles.container}>
      <View style={questMissionStyles.columnContainer}>
        <Text style={questMissionStyles.missiontitle}>{missiontitle}</Text>

        <TouchableOpacity onPress={onPress}>
          <ImageBackground
            source={require("../assets/Images/quest_title.png")}
            style={questMissionStyles.missionicon}
            imageStyle={{ resizeMode: "contain" }}
          >
            <View style={questMissionStyles.missionTextContainer}>
              <Text style={questMissionStyles.missionText}>카메라로 나를 돌아볼까요?</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

      </View>
    </View>
  );
}
