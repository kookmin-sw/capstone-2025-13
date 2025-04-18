import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Darkgreen_circle";
import Apple_tree from "../components/Apple_tree";
import Street_right_down from "../components/Street_right_down";
import Street_basic from "../components/Street_basic";
import Street_left_down from "../components/Street_left_down";
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
          <Street_right_down
            style={[
                questStyles.street,
              {
                left: width * 0.25,
                top: height * 0.15,
              },
            ]}
          />
          <Street_left_down
            style={[
                questStyles.street,
              {
                top: height * 0.4,
              },
            ]}
          />
          
          <View style={questStyles.elementsOverlay}>
            <View style={[questStyles.elementWrapper, { alignSelf: "flex-start" }]}>
                <Apple_tree name="날 돌아보기" subtitle="스스로를 돌아보는 시간이에요." />
            </View>
            <View style={[questStyles.elementWrapper, { alignSelf: "flex-end" }]}>
                <Apple_tree name="명상" subtitle="조용한 마음을 가져봐요." />
            </View>
            <View style={[questStyles.elementWrapper, { alignSelf: "flex-start" }]}>
                <Apple_tree name="운동" subtitle="몸을 움직여볼까요?" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
