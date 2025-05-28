import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../styles/floatingButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { getTodayTopic } from "../API/topicAPI";

export default function FloatingButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showBadge, setShowBadge] = useState(true); // 기본은 뱃지 보여주기

  useEffect(() => {
    const checkTopicStatus = async () => {
      try {
        const response = await getTodayTopic();
        const feedbackArray = response.feedbacks;

        if (Array.isArray(feedbackArray)) {
          const hasNoFeedback = feedbackArray.some(item => item.status === "NOFEEDBACK");
          setShowBadge(!hasNoFeedback);
        } else {
          setShowBadge(true);
        }
      } catch (error) {
        setShowBadge(true);
      }
    };

    checkTopicStatus();

  }, []);

  return (
    <>
      <View style={[styles.container, { left: 24, right: "auto" }]}>
        <TouchableOpacity
          style={styles.bubble}
          onPress={() => {
            navigation.navigate("DailyTopic", {});
            setShowBadge(false);
          }}
        >
          <MaterialCommunityIcons name="message-text" size={24} color="#fff" />
          {showBadge && <View style={styles.badge} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bubble}
          onPress={() => {
            navigation.navigate("HelpCall");
          }}
        >
          <MaterialCommunityIcons name="phone" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 오른쪽 하단 계정 버튼 */}
      <View style={[styles.container, { left: "auto", right: 24 }]}>
        <TouchableOpacity
          style={styles.bubble}
          onPress={() => navigation.navigate("UserInfo")}
        >
          <MaterialCommunityIcons name="account" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
