// 생략된 import 문은 그대로 유지
import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header_sky from "../../components/Header_sky";
import Quest_circle from "../../components/Darkgreen_circle";
import questStyles from "../../styles/questStyles";
import questStageStyles from "../../styles/questStageStyles";
import Quest_title from "../../components/Quest_title";
import Grass from "../../components/GrassElement";
import customAxios from "../../API/axios";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Quest_meditation: { questTitle: string; questDescription: string; questTarget: number };
  Quest_exercise: { questTitle: string; questDescription: string; questTarget: number };
  Quest_emotion: { questTitle: string; questDescription: string; questTarget: number };
};

type QuestNavigationProp =
    | StackNavigationProp<RootStackParamList, "Quest_meditation">
    | StackNavigationProp<RootStackParamList, "Quest_exercise">
    | StackNavigationProp<RootStackParamList, "Quest_emotion">;

const getQuestTypeFromTitle = (title: string): "MEDITATE" | "ACTIVITY" | "EMOTION" => {
  switch (title) {
    case "명상": return "MEDITATE";
    case "산책": return "ACTIVITY";
    case "감정": return "EMOTION";
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
  const [displayQuestTitle, setDisplayQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [questTarget, setQuestTarget] = useState(0);
  const [questStep, setQuestStep] = useState(1);
  const [questStage, setQuestStage] = useState<any>(null);
  const currentStageIndex = useMemo(() => 7 - questStep, [questStep]);

  useEffect(() => {
    const type = getQuestTypeFromTitle(title);

    const setQuestData = async (
        questData: any,
        type: "MEDITATE" | "ACTIVITY" | "EMOTION",
        overwriteDisplayTitle?: string
    ) => {
      setQuestTitle(questData.name);
      setDisplayQuestTitle(overwriteDisplayTitle ?? questData.name);
      setQuestDescription(questData.description);
      setQuestTarget(questData.target);
      setQuestStep(questData.step);

      const stageRes = await customAxios.get(`/quests/stage/${type}`);
      const stageData = stageRes.data.data;
      setQuestStage(stageData);
      if (stageData?.step) {
        setQuestStep(stageData.step);
      }
    };

    const fetchOrCreateQuest = async () => {
      try {
        const response = await customAxios.get(`/quests/last/${type}`);
        const lastData = response.data.data;

        if (lastData) {
          if (lastData.status === "COMPLETED") {
            const lastUpdatedAt = new Date(lastData.updatedAt);
            const now = new Date();

            const isNextDay = (last: Date, current: Date) => {
              const a = new Date(last.getFullYear(), last.getMonth(), last.getDate());
              const b = new Date(current.getFullYear(), current.getMonth(), current.getDate());
              return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24) >= 1;
            };

            if (isNextDay(lastUpdatedAt, now)) {
              if (lastData.step === 7) {
                await customAxios.post(`/quests/stage/${type}`);
                const firstStep = 1;
                const listRes = await customAxios.get(`/quests/list/${type}/${firstStep}`);
                const newQuest = listRes.data.data;

                const putRes = await customAxios.put("/quests", { id: newQuest.id });
                await customAxios.post("/quests", {
                  id: putRes.data.data.id,
                  current: 0,
                  status: "PROCESSING",
                });

                await setQuestData({ ...newQuest, step: 1 }, type);
                return;
              } else {
                // 🔁 다음 스텝으로 진행
                const nextStep = lastData.step + 1;
                const listRes = await customAxios.get(`/quests/list/${type}/${nextStep}`);
                const newQuest = listRes.data.data;

                const putRes = await customAxios.put("/quests", { id: newQuest.id });
                await customAxios.post("/quests", {
                  id: putRes.data.data.id,
                  current: 0,
                  status: "PROCESSING",
                });

                await setQuestData({ ...newQuest, step: nextStep }, type);
                return;
              }
            } else {
              await setQuestData(lastData, type, "끝! 내일 다시 만나!");
              return;
            }
          }

          await setQuestData(lastData, type);
        } else {
          await handleFirstQuestFlow(type);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          await handleFirstQuestFlow(type);
        } else {
          console.error("❌ /quests/last 실패:", error.response?.data || error.message);
        }
      }
    };

    const handleFirstQuestFlow = async (type: "MEDITATE" | "ACTIVITY" | "EMOTION") => {
      try {
        const firstStep = 1;
        const listRes = await customAxios.get(`/quests/list/${type}/${firstStep}`);
        const quest = listRes.data.data;

        const putRes = await customAxios.put("/quests", { id: quest.id });
        await customAxios.post("/quests", {
          id: putRes.data.data.id,
          current: 0,
          status: "PROCESSING",
        });

        const retryRes = await customAxios.get(`/quests/last/${type}`);
        const retryData = retryRes.data.data;
        console.log(retryData)
        const stageRes = await customAxios.get(`/quests/stage/${type}`);
        const stageData = stageRes.data.data;
        setQuestStage(stageData);
        setDisplayQuestTitle(retryData.name);
        setQuestTitle(retryData.name);
        setQuestDescription(retryData.description);
        setQuestTarget(retryData.target);
        setQuestStep(retryData.step);
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
    } else if (title === "산책") {
      navigation.navigate("Quest_exercise", params);
    } else if (title === "감정") {
      navigation.navigate("Quest_emotion", params);
    }
  };

  const navigateToQuestWithCheck = () => {
    if (displayQuestTitle === "끝! 내일 다시 만나!") {
      Alert.alert(
          "오늘의 퀘스트 완료!",
          title === "명상"
              ? "이미 오늘 미션을 완료했어요. \n 다시 진행할까요?"
              : "이미 오늘 미션을 완료했어요.",
          [
            { text: "닫기", style: "cancel" },
            { text: title === "명상" ? "한 번 더!" : "다시 볼래", onPress: navigateToQuest },
          ]
      );
    } else {
      navigateToQuest();
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
              text={displayQuestTitle || "퀘스트 불러오는 중..."}
              style={questStageStyles.questTitle}
              onPress={navigateToQuestWithCheck}
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
                <TouchableOpacity
                    key={index}
                    style={imageStyle}
                    onPress={navigateToQuestWithCheck}
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