import { View, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Darkgreen_circle";
import Stage_street from "../components/Stage_street";
import Quest_mission from "../components/Quest_mission";
import questStyles from "../styles/questStyles";
import questStageStyles from "../styles/questStageStyles";

export default function Quest_stage() {
  const route = useRoute();
  const { title, subtitle } = route.params as {
    title: string;
    subtitle: string;
  };

  return (
    <View style={[questStyles.container]}>

      <ScrollView contentContainerStyle={questStyles.scrollContainer}>
        <View style={questStyles.headerWrapper}>
          <Header_sky title={title} subtitle={subtitle} />
          <Quest_circle style={questStyles.circle} />
          <Stage_street style={questStageStyles.street} />
          <Image
            source={require("../assets/Images/goal.png")}
            style={questStageStyles.goalImage}
          />

          <View style={questStageStyles.stageOverlay}>
            <Image
              source={require("../assets/Images/stage_lock.png")}
              style={[questStageStyles.stageWrapper, { alignSelf: "flex-start" }]}
            />
            <Image
              source={require("../assets/Images/stage_lock.png")}
              style={[questStageStyles.stageWrapper, { alignSelf: "flex-end" }]}
            />
            <Image
              source={require("../assets/Images/stage_lock.png")}
              style={[questStageStyles.stageWrapper, { alignSelf: "flex-start" }]}
            />
          </View>
        </View>
      </ScrollView>

      <View style={questStageStyles.missionWrapper}>
        <Quest_mission
          missiontitle={title}
        />
      </View>
      </View>
    );
  }
     
     