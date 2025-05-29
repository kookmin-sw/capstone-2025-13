import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dailyTopicstyles from "../styles/dailyTopicStyles";
import Question from "../components/Question";
import Answer from "../components/Answer";
import LoadingAnswer from "../components/LoadingAnswer";
import ModalComponent from "../components/TopicModal";
import { getUserInfo, UserInfoResponse } from "../API/userInfoAPI";
import { getCoupon } from "../API/potAPI";
import {
  getTodayTopic,
  getTopicByDate,
  createTopic,
  submitFeedback,
  getFeedbackById,
  TopicFeedbackResponse,
  TopicFeedbackStatus,
} from "../API/topicAPI";
import type { RootStackParamList } from "../App";
import { useLoading } from "../API/contextAPI";

type ChatItem =
  | { type: "question"; text: string }
  | { type: "answer"; text: string; isLoading?: boolean };

export default function DailyTopic() {
  const route = useRoute<RouteProp<RootStackParamList, "DailyTopic">>();
  const date = route.params?.date ?? "";
  const [topicId, setTopicId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("메세지를 입력하세요.");
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hasShownModal, setHasShownModal] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const goToDiary = () => {
    setIsModalVisible(false);
    navigation.replace("Record", {});
  };

  useEffect(() => {
    const loadData = async () => {
      showLoading();
      try {
        const data = await getUserInfo();
        if (data) setUser(data);
        await initializeChat();
      } finally {
        hideLoading();
      }
    };
    loadData();
  }, []);

  const initializeChat = async () => {
    try {
      const topicData = date ? await getTopicByDate(date) : await getTodayTopic();
      const history: ChatItem[] = [{ type: "question", text: topicData.data }];

      const allFeedbacks = topicData.feedbacks.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

      allFeedbacks.forEach((feedback: any) => {
        history.push({ type: "answer", text: feedback.data });
        if (feedback.status !== TopicFeedbackStatus.NOFEEDBACK) {
          history.push({
            type: "question",
            text: feedback.aiFeedback,
          });
        }
      });

      setTopicId(topicData.id);
      setChatHistory(history);

      if (date) {
        const [y, m, d] = date.split("-");
        setInputDisabled(true);
        setPlaceholderText(`${y}년 ${m}월 ${d}일의 매일 1주제야-!`);
        return;
      }

      const lastFb = allFeedbacks[allFeedbacks.length - 1];
      if (lastFb?.status === TopicFeedbackStatus.NOFEEDBACK && !hasShownModal) {
        setInputDisabled(true);
        setPlaceholderText("오늘은 충분히 대화했어! 내일 다시 만나-!");
        setHasShownModal(true);
        showModal();
      }
    } catch (err: any) {
      if (err.response?.status === 404 || err.response?.status === 409) {
        await handleCreateTopic();
      } else {
        console.error("❌ 초기화 실패:", err.response?.data || err.message);
      }
    }
  };

  const handleCreateTopic = async () => {
    try {
      const newTopic = await createTopic();
      setTopicId(newTopic.id);
      setChatHistory([{ type: "question", text: newTopic.data }]);
    } catch (err: any) {
      if (err.response?.status === 409) {
        const existing = await getTodayTopic();
        setTopicId(existing.id);
        setChatHistory([{ type: "question", text: existing.data }]);
      } else {
        console.error("❌ 토픽 생성 실패:", err.response?.data || err.message);
      }
    }
  };

  const fetchFeedbackWithRetry = async (fid: string, retry = 0) => {
    if (retry > 5) {
      // 5번 리트라이 후에도 feedback 안 오면 NOFEEDBACK 처리
      try {
        const data = await getFeedbackById(fid);
        if (data.status === TopicFeedbackStatus.NOFEEDBACK) {
          setInputDisabled(true);
          setPlaceholderText("오늘은 충분히 대화했어! 내일 다시 만나-!");
          setHasShownModal(true);
          showModal();
        }
      } catch (err) {
        console.error("❌ 최종 상태 확인 실패:", err);
      }
      return;
    }

    try {
      const data: TopicFeedbackResponse = await getFeedbackById(fid);
      if (
        !data ||
        typeof data.status === "undefined" ||
        data.status === null ||
        data.status === TopicFeedbackStatus.NOFEEDBACK
      ) {
        setTimeout(() => fetchFeedbackWithRetry(fid, retry + 1), 3000);
        return;
      }

      // 정상적으로 피드백 도착했을 때
      setChatHistory((prev) =>
        prev
          .map((it) => (it.type === "answer" && it.isLoading ? { ...it, isLoading: false } : it))
          .concat({ type: "question", text: data.aiFeedback })
      );

      setInputDisabled(false);
      setPlaceholderText("메세지를 입력하세요.");
      await getCoupon();
    } catch (err) {
      setTimeout(() => fetchFeedbackWithRetry(fid, retry + 1), 3000);
    }
  };


  const handleSendFeedback = async (text: string) => {
    if (!topicId) return;

    try {
      const fid = await submitFeedback(topicId, text);

      // 먼저 피드백 상태 한 번 확인
      try {
        const data: TopicFeedbackResponse = await getFeedbackById(fid);

        if (data.status === TopicFeedbackStatus.NOFEEDBACK) {
          setInputDisabled(true);
          setPlaceholderText("오늘은 충분히 대화했어! 내일 다시 만나-!");
          if (!hasShownModal) {
            setHasShownModal(true);
            showModal();
          }
          return;
        }
      } catch (checkError) {
        console.warn("❗ 사전 상태 확인 실패, 리트라이로 진행:", checkError);
      }

      // 상태 확인이 안됐거나 NOFEEDBACK 아니면 리트라이 시작
      setTimeout(() => fetchFeedbackWithRetry(fid), 3000);

    } catch (err: any) {
      console.error("❌ submitFeedback 실패:", err.response?.data || err.message);
      setInputDisabled(true);
      setPlaceholderText("오늘은 충분히 대화했어! 내일 다시 만나-!");
    }
  };


  const handleSend = () => {
    if (!answer.trim()) return;
    const txt = answer;
    setAnswer("");
    setChatHistory((prev) => [...prev, { type: "answer", text: txt, isLoading: true }]);
    setInputDisabled(true);
    setPlaceholderText("답변 작성 중이야~ 조금만 기다려줘-!");
    setTimeout(() => handleSendFeedback(txt), 500);
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  const renderChat = () =>
    chatHistory.map((item, i) => (
      <View key={i} style={dailyTopicstyles.itemContainer}>
        {item.type === "question" ? (
          <View style={dailyTopicstyles.questionContainer}>
            <Image
              source={require("../assets/Images/cloverProfile.png")}
              style={dailyTopicstyles.cloverProfileImage}
            />
            <View style={dailyTopicstyles.contentContainer}>
              <Text style={{ color: "#0E532E" }}>세잎이 ☘️</Text>
              <Question question={item.text} />
            </View>
          </View>
        ) : (
          <View style={dailyTopicstyles.answerContainer}>
            <View style={dailyTopicstyles.contentContainer}>
              {item.isLoading ? (
                <LoadingAnswer answer={item.text} />
              ) : (
                <Answer answer={item.text} />
              )}
            </View>
            <Image
              source={
                user?.profile
                  ? { uri: user.profile }
                  : require("../assets/Images/cloverProfile.png")
              }
              style={dailyTopicstyles.userProfileImage}
            />
          </View>
        )}
      </View>
    ));
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={dailyTopicstyles.container}>
        <TouchableOpacity
          style={dailyTopicstyles.backButtonWrapper}
          onPress={() => {
            if (date) {
              navigation.navigate("Calendar");
            } else {
              navigation.navigate("Home", {});
            }
          }}
        >
          <Ionicons name="arrow-back-circle" size={40} color="#349C64" />
        </TouchableOpacity>

        <Text style={dailyTopicstyles.headerText}>매일 1주제</Text>

        <ScrollView
          contentContainerStyle={dailyTopicstyles.scrollContainer}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {renderChat()}
        </ScrollView>

        <View style={dailyTopicstyles.inputContainer}>
          <TextInput
            placeholder={placeholderText}
            placeholderTextColor="#999"
            style={dailyTopicstyles.textInput}
            value={answer}
            onChangeText={setAnswer}
            editable={!inputDisabled}
            onFocus={() => {
              setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          />
          <TouchableOpacity
            style={[dailyTopicstyles.sendButton, inputDisabled && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={inputDisabled}
          >
            <Text style={dailyTopicstyles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ModalComponent
        visible={isModalVisible}
        onClose={closeModal}
        onGoToDiary={goToDiary}
      />
    </KeyboardAvoidingView>
  );
}
