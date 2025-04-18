import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Darkgreen_circle";
import Quest_element from "../components/Quest_element";
import Quest_street from "../components/Quest_street";
import questStyles from "../styles/questStyles";

const { width, height } = Dimensions.get("window");

export default function Quest() {
  return (
    <View style={questStyles.container}>
      <ScrollView contentContainerStyle={questStyles.scrollContainer}>
        <View style={questStyles.headerWrapper}>
          <Header_sky subtitle="미션을 완료해보세요!" />
          <Quest_circle style={questStyles.circle} />
        </View>

        <View style={questStyles.questSection}>
          <Quest_street
            style={[
                questStyles.street,
              {
                left: width * 0.28,
                top: height * 0.025,
                transform: [{ rotate: "-15deg" }],
              },
            ]}
          />
          <Quest_street
            style={[
                questStyles.street,
              {
                left: width * 0.47,
                top: height * 0.11,
                transform: [{ rotate: "23deg" }],
              },
            ]}
          />
          <Quest_street
            style={[
                questStyles.street,
              {
                top: height * 0.28,
                transform: [{ rotate: "-75deg" }],
              },
            ]}
          />
          <Quest_street
            style={[
                questStyles.street,
              {
                left: width * 0.08,
                top: height * 0.38,
                transform: [{ rotate: "-110deg" }],
              },
            ]}
          />
          
          <View style={questStyles.elementsOverlay}>
            <View style={[questStyles.elementWrapper, { alignSelf: "flex-start" }]}>
                <Quest_element name="날 돌아보기" subtitle="스스로를 돌아보는 시간이에요." />
            </View>
            <View style={[questStyles.elementWrapper, { alignSelf: "flex-end" }]}>
                <Quest_element name="명상" subtitle="조용한 마음을 가져봐요." />
            </View>
            <View style={[questStyles.elementWrapper, { alignSelf: "flex-start" }]}>
                <Quest_element name="운동" subtitle="몸을 움직여볼까요?" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
