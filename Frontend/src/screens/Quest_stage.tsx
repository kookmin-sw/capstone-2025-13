import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Quest_circle";
import questStyles from "../styles/questStyles";


export default function Quest_stage() {
    const route = useRoute();
    const { subtitle } = route.params as { subtitle: string };
    return (
        <View style={questStyles.container}>
          <ScrollView contentContainerStyle={questStyles.scrollContainer}>
            <View style={questStyles.headerWrapper}>
              <Header_sky subtitle={subtitle}/>
              <Quest_circle style={questStyles.circle} />
            </View>
          </ScrollView>
        </View>
    );
}