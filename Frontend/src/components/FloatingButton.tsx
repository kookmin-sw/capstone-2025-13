import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles/floatingButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { getTodayTopic } from "../API/topicAPI";

// Copilot 관련 import
import { CopilotStep, walkthroughable } from "react-native-copilot";

const WalkthroughableView = walkthroughable(View);

export default function FloatingButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showBadge, setShowBadge] = useState(true);

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
        <CopilotStep
          text={`여기는 매일 1주제!\n너의 감정을 돌아볼 주제가 준비되어 있어.\n나랑 함께 대화하며 마음을 다독여 보자!`}
          order={4}
          name="dailyTopic"
        >
          <WalkthroughableView>
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
          </WalkthroughableView>
        </CopilotStep>

        <CopilotStep
          text={`여기는 헬프콜이야!\n위치 기반 상담 센터 지도와\n관련 기관 정보를 한눈에 보여줄게.`}
          order={5}
          name="helpCall"
        >
          <WalkthroughableView>
            <TouchableOpacity
              style={styles.bubble}
              onPress={() => {
                navigation.navigate("HelpCall");
              }}
            >
              <MaterialCommunityIcons name="phone" size={24} color="#fff" />
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>
      </View>

      <View style={[styles.container, { left: "auto", right: 24 }]}>
        <CopilotStep
          text={`여기는 회원정보 공간이야.\n여기서 너의 정보를 확인하고 수정할 수 있어.`}
          order={6}
          name="userInfo"
        >
          <WalkthroughableView>
            <TouchableOpacity
              style={styles.bubble}
              onPress={() => navigation.navigate("UserInfo")}
            >
              <MaterialCommunityIcons name="account" size={24} color="#fff" />
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>
      </View>
    </>
  );
}
