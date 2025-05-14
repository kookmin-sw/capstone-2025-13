import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header_sky from "../../components/Header_sky";
import Quest_circle from "../../components/Darkgreen_circle";
import questStyles from "../../styles/questStyles";
import questStageStyles from "../../styles/questStageStyles";
import Quest_title from "../../components/Quest_title";
import Grass from "../../components/GrassElement";
import customAxios from "../../API/axios";
import { StackNavigationProp } from "@react-navigation/stack";

// 타입 정의
type RootStackParamList = {
  Quest_meditation: { questTitle: string; questDescription: string; questTarget: number };
  Quest_exercise: { questTitle: string; questDescription: string; questTarget: number };
};

type QuestNavigationProp =
  | StackNavigationProp<RootStackParamList, "Quest_meditation">
  | StackNavigationProp<RootStackParamList, "Quest_exercise">;

// 퀘스트 타입 매핑
const getQuestTypeFromTitle = (title: string): "MEDITATE" | "ACTIVITY" | "EMOTION" => {
  switch (title) {
    case "명상": return "MEDITATE";
    case "운동": return "ACTIVITY";
    default: return "EMOTION";
  }
};

const { height, width } = Dimensions.get("window");

const lockPositions = [
  { top: height * 0.3, left: width * 0.24 },
  { top: height * 0.49, left: width * 0.35 },
  { top: height * 0.6, left: width * 0.72 },
  { top: height * 0.72, left: width * 0.35 },
  { top: height * 0.9, left: width * 0.24 },
  { top: height * 1.0, left: width * 0.67 },
  { top: height * 1.16, left: width * 0.4 },
];

export default function Quest_stage() {
  const route = useRoute();
  const navigation = useNavigation<QuestNavigationProp>();
  const { title } = route.params as { title: string };

  const [questTitle, setQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [questTarget, setQuestTarget] = useState(0);
  const [questStep, setQuestStep] = useState(1);
  const [questStage, setQuestStage] = useState<any>(null); // 전체 스테이지 상태 (타입 나중에 구체화)
  const currentStageIndex = useMemo(() => questStep + 5, [questStep]);

  useEffect(() => {
    const type = getQuestTypeFromTitle(title);

    const fetchOrCreateQuest = async () => {
      try {
        const response = await customAxios.get(`/quests/last/${type}`);
        const lastData = response.data.data;

        if (lastData) {
          setQuestTitle(lastData.name);
          setQuestDescription(lastData.description);
          setQuestTarget(lastData.target);
          setQuestStep(lastData.step);
          console.log("✅ 마지막 퀘스트:", lastData);
          
          const stageRes = await customAxios.get(`/quests/stage/${type}`);
          const stageData = stageRes.data.data;
          setQuestStage(stageData); 
          if (stageData?.step) {
            setQuestStep(stageData.step); 
          }
          console.log("📌 퀘스트 스테이지 전체:", stageData);
        } else {
          console.log("ℹ️ 마지막 퀘스트 없음. 새로 생성 시도");
          await handleFirstQuestFlow(type);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log("🔁 404: 새 퀘스트 생성 시도");
          await handleFirstQuestFlow(type);
        } else {
          console.error("❌ /quests/last 실패:", error.response?.data || error.message);
        }
      }
    };

    const handleFirstQuestFlow = async (type: "MEDITATE" | "ACTIVITY" | "EMOTION") => {
      try {
        const listRes = await customAxios.get(`/quests/list/${type}/${questStep}`);
        const quest = listRes.data.data;

        if (!quest?.id) {
          console.warn("⚠️ 퀘스트 없음");
          return;
        }

        const putRes = await customAxios.put("/quests", { id: quest.id });
        const postRes = await customAxios.post("/quests", {
          id: putRes.data.data.id,
          current: 0,
          status: "PROCESSING",
        });

        const retryRes = await customAxios.get(`/quests/last/${type}`);
        const retryData = retryRes.data.data;

        setQuestTitle(retryData.name);
        setQuestDescription(retryData.description);
        setQuestTarget(retryData.target);
        setQuestStep(retryData.step);

        console.log("🟢 새로운 퀘스트 설정 완료:", retryData);
      } catch (error: any) {
        console.error("❌ 퀘스트 생성 실패:", error.response?.data || error.message);
      }
    };

    fetchOrCreateQuest();
  }, [title]);

  const navigateToQuest = () => {
    const params = { questTitle, questDescription, questTarget };
    if (title === "명상") {
      navigation.navigate("Quest_meditation", params);
    } else if (title === "운동") {
      navigation.navigate("Quest_exercise", params);
    } else {
      console.warn("❓ 알 수 없는 퀘스트 타입:", title);
    }
  };

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
          onPress={navigateToQuest}
        />

        <View style={questStageStyles.textWrapper}>
          <View style={questStageStyles.lineSmallWrapper}>
            <Text style={questStageStyles.shadowTextSmall}>{title}</Text>
            <Text style={questStageStyles.mainTextSmall}>{title}</Text>
          </View>
          <View style={questStageStyles.lineLargeWrapper}>
            <Text style={questStageStyles.shadowTextLarge}>{questStage}-{questStep}</Text>
            <Text style={questStageStyles.mainTextLarge}>{questStage}-{questStep}</Text>
          </View>
        </View>

        {lockPositions.map((pos, index) => {
          const isCurrent = index === currentStageIndex;
          const source = isCurrent
            ? require("../../assets/Images/stage_current.png")
            : index < currentStageIndex
              ? require("../../assets/Images/stage_lock.png")
              : require("../../assets/Images/stage_unlock.png");

          const imageStyle = [questStageStyles.stage, { top: pos.top, left: pos.left }];

          return isCurrent ? (
            <TouchableOpacity key={index} style={imageStyle} onPress={navigateToQuest} activeOpacity={0.8}>
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
              <Image source={source} style={questStageStyles.fullSizeImage} resizeMode="contain" />
            </TouchableOpacity>
          ) : (
            <Image key={index} source={source} style={imageStyle} resizeMode="contain" />
          );
        })}
      </ScrollView>
    </View>
  );
}
