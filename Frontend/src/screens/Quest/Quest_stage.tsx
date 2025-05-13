import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header_sky from "../../components/Header_sky";
import Quest_circle from "../../components/Darkgreen_circle";
import questStyles from "../../styles/questStyles";
import questStageStyles from "../../styles/questStageStyles";
import Quest_title from "../../components/Quest_title";
import Grass from "../../components/GrassElement";
import axios from "axios";
import customAxios from "../../API/axios";
import { StackNavigationProp } from "@react-navigation/stack";

// RootStackParamList 정의
type RootStackParamList = {
  Quest_meditation: { questTitle: string; questDescription: string; questTarget: number };
  Quest_exercise: { questTitle: string; questDescription: string; questTarget: number };
  // 다른 스크린들을 정의할 수 있음
};

// StackNavigationProp을 사용하여 각각의 네비게이션 타입을 지정
type QuestMeditationNavigationProp = StackNavigationProp<RootStackParamList, 'Quest_meditation'>;
type QuestExerciseNavigationProp = StackNavigationProp<RootStackParamList, 'Quest_exercise'>;


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
  const navigation = useNavigation<QuestMeditationNavigationProp | QuestExerciseNavigationProp>()
  const { title } = route.params as { title: string };
  const [questTitle, setQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [questTarget, setQuestTarget] = useState(0);
  const [questStage, setQuestStage] = useState(1); 
  const [questStep, setQuestStep] = useState(1);  



  useEffect(() => {
    const type = getQuestTypeFromTitle(title);

    // ✅ 추가: /quests/{type}/1 호출
    const fetchQuestByStage = async () => {
      try {
        const stepNumber = 1;
        const response = await customAxios.get(`/quests/last`);
        console.log("📘 GET /quests/{title}/1 결과:", response.data);
      } catch (error: any) {
        console.error("❌ GET /quests/{title}/1 실패:", error.response?.data || error.message);
      }
    };

    const fetchAndSetFirstQuest = async () => {
      try {
        const lastResponse = await customAxios.get(`/quests/last/${type}`);
        const lastData = lastResponse.data.data;

        if (!lastData) {
          console.log("ℹ️ 마지막 퀘스트 없음. 목록을 불러옵니다...");
          await handleFirstQuestFlow(type);
        } else {
          console.log("✅ /quests/last 응답:", lastData);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log("ℹ️ 404: 마지막 퀘스트 없음. 목록을 불러옵니다...");
          await handleFirstQuestFlow(type);
        } else {
          console.error("❌ /quests/last 호출 실패:", error.response?.data || error.message);
        }
      }
    };

    const handleFirstQuestFlow = async (type: "MEDITATE" | "ACTIVITY" | "EMOTION") => {
      try {
        const listResponse = await customAxios.get(`/quests/list/${type}/${questStep}`);
        const quest = listResponse.data.data;

        setQuestTitle(quest.name);
        setQuestDescription(quest.description);
        setQuestTarget(quest.target); 

        if (!quest || !quest.id) {
          console.warn("⚠️ step 1 퀘스트를 찾을 수 없습니다.");
          return;
        }

        const questId = quest.id;
        console.log("🟢 step=1 퀘스트 ID:", questId);

        try {
          const putResponse = await customAxios.put("/quests", { id: questId });
          console.log("✅ PUT /quests 성공:", putResponse.data);
        } catch (putError: any) {
          console.error("❌ PUT /quests 실패:", putError.response?.data || putError.message);
          return;
        }

        try {
          const postPayload = {
            id: questId,
            current: 0,
            status: "PROCESSING",
          };
          const postResponse = await customAxios.post("/quests", postPayload);
          console.log("✅ POST /quests 성공:", postResponse.data);
        } catch (postError: any) {
          console.error("❌ POST /quests 실패:", postError.response?.data || postError.message);
          return;
        }

        try {
          const lastRetry = await customAxios.get(`/quests/last/${type}`);
          const lastData = lastRetry.data.data;
          console.log("🔄 다시 불러온 /quests/last 결과:", lastData);
        } catch (retryError: any) {
          console.error("❌ 재요청 /quests/last 실패:", retryError.response?.data || retryError.message);
        }
      } catch (listError: any) {
        console.error("❌ /quests/list 호출 실패:", listError.response?.data || listError.message);
      }
    };


    // 최초 실행 시 호출
    fetchQuestByStage(); // ✅ 추가됨
    fetchAndSetFirstQuest();
    fetchQuestByStage();
  }, [title]);
  return (
    <View style={questStageStyles.container}>
      <ScrollView contentContainerStyle={questStyles.scrollContainer} bounces={false} overScrollMode="never">
        <Image source={require("../../assets/Images/stage_street.png")} style={questStageStyles.street} resizeMode="contain" />

        <View style={questStyles.headerWrapper}>
          <Header_sky title="" subtitle="" screenName="Quest_stage" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <Image source={require("../../assets/Images/goal.png")} style={questStageStyles.goalImage} />

        {["one", "two", "three", "four"].map((type, index) => {
          const isLeft = index % 2 === 0;
          const isFirst = index === 0;

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
        text={questTitle || "퀘스트 불러오는 중..."}
        style={questStageStyles.questTitle}
        onPress={() => {
          const params = {
            questTitle,
            questDescription,
            questTarget,
          };

          if (title === "명상") {
            navigation.navigate("Quest_meditation", params);
          } else if (title === "운동") {
            navigation.navigate("Quest_exercise", params);
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
                  const params = {
                    questTitle,
                    questDescription,
                    questTarget,
                  };
                  if (title === "명상") {
                    navigation.navigate("Quest_meditation", params);
                  } else if (title === "운동") {
                    navigation.navigate("Quest_exercise", params);
                  } else {
                    console.warn("알 수 없는 title 값:", title);
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
