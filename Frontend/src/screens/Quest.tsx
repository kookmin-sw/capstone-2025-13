import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Quest_circle";
import Quest_element from "../components/Quest_element";
import Quest_street from "../components/Quest_street";

const { width, height } = Dimensions.get("window");

export default function Quest() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerWrapper}>
          <Header_sky subtitle="미션을 완료해보세요!" />
          <Quest_circle style={styles.circle} />
        </View>

        {/* 퀘스트 섹션 */}
        <View style={styles.questSection}>
          {/* 이어진 길 이미지들 */}
          <Quest_street
            style={[
              styles.street,
              {
                left: width * 0.28,
                top: height * 0.025,
                transform: [{ rotate: "-15deg" }],
              },
            ]}
          />
          <Quest_street
            style={[
              styles.street,
              {
                left: width * 0.47,
                top: height * 0.11,
                transform: [{ rotate: "23deg" }],
              },
            ]}
          />
          <Quest_street
            style={[
              styles.street,
              {
                top: height * 0.28,
                transform: [{ rotate: "-75deg" }],
              },
            ]}
          />
          <Quest_street
            style={[
              styles.street,
              {
                left: width * 0.08,
                top: height * 0.38,
                transform: [{ rotate: "-110deg" }],
              },
            ]}
          />

          {/* 퀘스트 요소들 */}
          <View style={styles.elementsOverlay}>
            <View style={[styles.elementWrapper, { alignSelf: "flex-start" }]}>
              <Quest_element name="날 돌아보기" />
            </View>
            <View style={[styles.elementWrapper, { alignSelf: "flex-end" }]}>
              <Quest_element name="명상" />
            </View>
            <View style={[styles.elementWrapper, { alignSelf: "flex-start" }]}>
              <Quest_element name="운동" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: height * 0.1,
  },
  headerWrapper: {
    position: "relative",
    height: height * 0.20,
  },
  circle: {
    position: "absolute",
    top: height * 0.20,
    alignSelf: "center",
    zIndex: 2,
  },
  questSection: {
    minHeight: height * 0.6,
    position: "relative",
  },
  street: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    alignSelf: "center",
    opacity: 0.8,
    zIndex: 2,
  },
  elementsOverlay: {
    position: "absolute",
    top: height * 0.07,
    width: "100%",
    paddingHorizontal: width * 0.1,
    gap: height * 0.06,
    zIndex: 3,
  },
  elementWrapper: {
    marginHorizontal: width * 0.025,
  },
});
