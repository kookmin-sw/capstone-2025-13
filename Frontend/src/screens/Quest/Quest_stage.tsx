import React from "react";
import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header_sky from "../../components/Header_sky"; // Header_sky import
import Quest_circle from "../../components/Darkgreen_circle";
import questStyles from "../../styles/questStyles";
import questStageStyles from "../../styles/questStageStyles";
import Quest_title from "../../components/Quest_title";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const currentStageIndex = 2; // 예: 0부터 시작해서 2까지는 unlock

const lockPositions = [
  { top: height * 0.3, left: width * 0.24 },
  { top: height * 0.49, left: width * 0.35 },
  { top: height * 0.6, left: width * 0.72 },
  { top: height * 0.72, left: width * 0.35 },
  { top: height * 0.9, left: width * 0.24 },
  { top: height * 1.00, left: width * 0.67 },
  { top: height * 1.16, left: width * 0.4 },
];

export default function Quest_stage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { title, subtitle } = route.params as { title: string; subtitle: string };

  return (
    <View style={questStageStyles.container}>
      <ScrollView contentContainerStyle={[questStyles.scrollContainer]} bounces={false} overScrollMode="never">
        <Image source={require("../../assets/Images/stage_street.png")} style={[questStageStyles.street]} resizeMode="contain" />
        
        <View style={questStyles.headerWrapper}>
          <Header_sky title="" subtitle="" screenName="Quest_stage" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <Image source={require("../../assets/Images/goal.png")} style={questStageStyles.goalImage} />

        <Quest_title
          text="조용한 마음을 가져봐요."
          style={questStageStyles.questTitle}
          onPress={() => {
            console.log("스테이지 터치됨!");
            if (title === "명상") {
              navigation.navigate("Quest_meditation" as never);
            } else if (title === "운동") {
              navigation.navigate("Quest_exercise" as never);
            } else {
              console.warn("알 수 없는 title 값:", title);
            }
          }}
        />

        <View style={questStageStyles.textWrapper}>
          <View style={questStageStyles.lineSmallWrapper}>
            <Text style={questStageStyles.shadowTextSmall}>{title}</Text>
            <Text style={questStageStyles.mainTextSmall}>{title}</Text>
          </View>

          <View style={questStageStyles.lineLargeWrapper}>
            <Text style={questStageStyles.shadowTextLarge}>1-1</Text>
            <Text style={questStageStyles.mainTextLarge}>1-1</Text>
          </View>
        </View>

        {lockPositions.map((pos, index) => {
          let imageSource;

          if (index === currentStageIndex) {
            imageSource = require("../../assets/Images/stage_current.png"); // 🔸 현재 스테이지 이미지
          } else if (index < currentStageIndex) {
            imageSource = require("../../assets/Images/stage_lock.png");
          } else {
            imageSource = require("../../assets/Images/stage_unlock.png");
          }

          const imageStyle = [questStageStyles.stage, { top: pos.top, left: pos.left }];

          if (index === currentStageIndex) {
            return (
              <TouchableOpacity
                key={index}
                style={imageStyle}
                onPress={() => {
                  console.log("스테이지 터치됨!");
                  if (title === "명상") {
                    navigation.navigate("Quest_meditation" as never);
                  } else if (title === "운동") {
                    navigation.navigate("Quest_exercise" as never);
                  } else {
                    console.warn("알 수 없는 title 값:", title);
                  }
                }}
                activeOpacity={0.8}
              >
                <Image source={imageSource} style={questStageStyles.fullSizeImage} resizeMode="contain" />
              </TouchableOpacity>
            );
          }

          return (
            <Image
              key={index}
              source={imageSource}
              style={[questStageStyles.stage, { top: pos.top, left: pos.left }]}
              resizeMode="contain"
            />
          );
        })}

        <View style={questStageStyles.scrollBottomSpacer} />
      </ScrollView>
    </View>
  );
}
