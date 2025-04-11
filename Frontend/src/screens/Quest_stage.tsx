import { View, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Quest_circle";
import Quest_street from "../components/Quest_street";
import questStyles from "../styles/questStyles";
import questStageStyles from "../styles/questStageStyles";


export default function Quest_stage() {
    const route = useRoute();
    const { subtitle } = route.params as { subtitle: string };
    
    return (
        <View style={questStyles.container}>
          <ScrollView contentContainerStyle={questStyles.scrollContainer}>
            <View style={questStyles.headerWrapper}>
              <Header_sky subtitle={subtitle}/>
              <Quest_circle style={questStyles.circle} />
              <Quest_street style={questStageStyles.street}/>
              <Image
                source={require("../assets/Images/goal.png")}
                style={questStageStyles.goalImage}
              />
            </View>
          </ScrollView>
        </View>
    );
}