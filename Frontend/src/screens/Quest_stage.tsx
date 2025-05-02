import { View, ScrollView, Image, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Darkgreen_circle";
import questStyles from "../styles/questStyles";
import questStageStyles from "../styles/questStageStyles";
import Quest_title from "../components/Quest_title";

const { height } = Dimensions.get("window");


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
          style={[questStageStyles.street,]}
          resizeMode="contain"
        />
        <View style={questStyles.headerWrapper}>
          <Header_sky title= "" subtitle="" />
          <Quest_circle style={questStyles.circle} />
        </View>


        <Quest_title
          text="조용한 마음을 가져봐요."
          style={questStageStyles.questTitleTop}
        />



        <View style={{ height: height * 1}} />
      </ScrollView>
    </View>
  );
}
