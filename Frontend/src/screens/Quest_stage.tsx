import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Darkgreen_circle";
import questStyles from "../styles/questStyles";
import questStageStyles from "../styles/questStageStyles";
import Quest_title from "../components/Quest_title";

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
  const { title, subtitle } = route.params as {
    title: string;
    subtitle: string;
  };

  return (
    <View style={questStageStyles.container}>
      <ScrollView
        contentContainerStyle={[questStyles.scrollContainer]}
        bounces={false}
        overScrollMode="never"
      >

        <Image
          source={require("../assets/Images/stage_street.png")}
          style={[questStageStyles.street]}
          resizeMode="contain"
        />
        <View style={questStyles.headerWrapper}>
          <Header_sky title="" subtitle="" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <Image
          source={require("../assets/Images/goal.png")}
          style={questStageStyles.goalImage}
        />

        <Quest_title
          text="조용한 마음을 가져봐요."
          style={questStageStyles.questTitle}
          
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
            imageSource = require("../assets/Images/stage_current.png"); // 🔸 현재 스테이지 이미지
          } else if (index < currentStageIndex) {
            imageSource = require("../assets/Images/stage_lock.png");
          } else {
            imageSource = require("../assets/Images/stage_unlock.png");
          }

          const imageStyle = [
            questStageStyles.stage,
            { top: pos.top, left: pos.left},
          ];

          if (index === currentStageIndex) {
            return (
              <TouchableOpacity
                key={index}
                style={imageStyle}
                onPress={() => {
                  console.log("현재 스테이지 터치됨!");
                  // 여기에 네비게이션이나 다른 동작 추가
                }}
                activeOpacity={0.8}
              >
                <Image source={imageSource} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
              </TouchableOpacity>
            );
          }
        
          // 나머지 스테이지는 그냥 이미지로 표시
          return (
            <Image
              key={index}
              source={imageSource}
              style={[questStageStyles.stage, { top: pos.top, left: pos.left }]}
              resizeMode="contain"
            />
          );
        })}

        <View style={{ height: height * 1 }} />
      </ScrollView>
    </View>
  );
}