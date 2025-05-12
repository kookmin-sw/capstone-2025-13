import React, {useEffect} from "react";
import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header_sky from "../../components/Header_sky";
import Quest_circle from "../../components/Darkgreen_circle";
import questStyles from "../../styles/questStyles";
import questStageStyles from "../../styles/questStageStyles";
import Quest_title from "../../components/Quest_title";
import Grass from "../../components/GrassElement";
import axios from "axios";

const getQuestTypeFromTitle = (title: string): "MEDITATE" | "ACTIVITY" | "EMOTION" => {
  switch (title) {
    case "명상":
      return "MEDITATE";
    case "운동":
      return "ACTIVITY";
    default:
      return "EMOTION";
  }
};

const { height, width } = Dimensions.get("window");

const currentStageIndex = 2;

const lockPositions = [
  { top: height * 0.3, left: width * 0.24 },
  { top: height * 0.49, left: width * 0.35 },
  { top: height * 0.6, left: width * 0.72 },
  { top: height * 0.72, left: width * 0.35 },
  { top: height * 0.9, left: width * 0.24 },
  { top: height * 1.0, left: width * 0.67 },
  { top: height * 1.16, left: width * 0.4 },
];

export const getQuestsList = async () => {
  const response = await axios.get("/quests/list");
  return response.data;
};

export default function Quest_stage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { title } = route.params as { title: string;};

  useEffect(() => {
    const fetchLastQuest = async () => {
      try {
        const type = getQuestTypeFromTitle(title);
      } catch (error: any) {
        console.error("❌ /quest/last 호출 실패:", error.response?.data || error.message);
      }
    };
  
    fetchLastQuest();
  }, [title]);

  return (
    <View style={questStageStyles.container}>
      <ScrollView contentContainerStyle={questStyles.scrollContainer} bounces={false} overScrollMode="never">
        <Image
          source={require("../../assets/Images/stage_street.png")}
          style={questStageStyles.street}
          resizeMode="contain"
        />

        <View style={questStyles.headerWrapper}>
          <Header_sky title="" subtitle="" screenName="Quest_stage" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <Image source={require("../../assets/Images/goal.png")} style={questStageStyles.goalImage} />

        {["one", "two", "three", "four"].map((type, index) => {
          const isLeft = index % 2 === 0; // 번갈아: 0, 2, ... 왼쪽 / 1, 3, ... 오른쪽
          const isFirst = index  === 0;

          return (
            <View
              key={index}
              style={[
                questStageStyles.elementWrapper,
                {
                  alignSelf: isLeft ? "flex-end" : "flex-start",
                  marginTop: isFirst ? height * 0.12 : height * 0.01,
                },
              ]}
            >
              <Grass type={type as "one" | "two" | "three" | "four"} />
            </View>
          );
        })}


        <Quest_title
          text="조용한 마음을 가져봐요."
          style={questStageStyles.questTitle}
          onPress={() => {
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

        {/* 🔽 스테이지 락/언락 이미지 */}
        {lockPositions.map((pos, index) => {
          let imageSource;
          if (index === currentStageIndex) {
            imageSource = require("../../assets/Images/stage_current.png");
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
                  if (title === "명상") {
                    navigation.navigate("Quest_meditation" as never);
                  } else if (title === "운동") {
                    navigation.navigate("Quest_exercise" as never);
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={questStageStyles.iconWrapper}>
                <Image
                  source={
                    title === "명상"
                      ? require("../../assets/Images/clover_meditation.png")
                      : require("../../assets/Images/clover_exercise.png")
                  }
                  style={questStageStyles.cloverIcon}
                  resizeMode="contain"
                />
              </View>
                <Image source={imageSource} style={questStageStyles.fullSizeImage} resizeMode="contain" />
              </TouchableOpacity>
            );
          }

          return (
            <Image
              key={index}
              source={imageSource}
              style={imageStyle}
              resizeMode="contain"
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
