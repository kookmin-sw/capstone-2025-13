import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Quest_circle";
import Quest_element from "../components/Quest_element";
import Quest_street from "../components/Quest_street";

export default function Quest() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Sky 배경 + Quest Circle 겹치기 */}
        <View style={styles.headerWrapper}>
          <Header_sky subtitle="미션을 완료해보세요!" />
          <Quest_circle style={styles.circle} />
        </View>

        {/* 퀘스트 섹션 */}
        <View style={styles.questSection}>
          {/* 이어진 길 이미지들 */}
          <Quest_street
            style={[styles.street, { left:105, top: 40, transform: [{ rotate: "0deg" }] }]} // 0번째 길
         />
         <Quest_street
            style={[styles.street, { left:200, top: 120, transform: [{ rotate: "0deg" }] }]} // 이전보다 +80
         />
<Quest_street
  style={[styles.street, { top: 230, transform: [{ rotate: "-75deg" }] }]} // +80
/>
<Quest_street
  style={[styles.street, { left:30, top: 320, transform: [{ rotate: "-100deg" }] }]} // +80
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
    paddingBottom: 100,
  },
  headerWrapper: {
    position: "relative",
    height: 180,
  },
  circle: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    zIndex: 2,
  },
  questSection: {
    minHeight: 500,
    position: "relative",
  },
  street: {
    position: "absolute",
    width: 200,
    height: 200,
    alignSelf: "center",
    opacity: 0.8,
    zIndex: 2,
  },
  elementsOverlay: {
    position: "absolute",
    top: 60,
    width: "100%",
    paddingHorizontal: 40,
    gap: 50,
    zIndex: 3,
  },
  elementWrapper: {
    marginHorizontal: 10,
  },
});
