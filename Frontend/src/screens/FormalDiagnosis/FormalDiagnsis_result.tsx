import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native";
import { getUserInfo, UserInfoResponse } from "../../API/userInfoAPI";
import styles from "../../styles/formalDiagnsisResultStyles";

const { width } = Dimensions.get("window");

const DepressionResultScreen = () => {
  const route = useRoute();
  const { diagnosisId } = route.params as { diagnosisId: number };
  const { score } = route.params as { score: number };
  const { totalScore } = route.params as { totalScore: number };
  const { scaleName } = route.params as { scaleName: string };
  const { description } = route.params as { description: string };
  const depressionLevel = score / totalScore
  const navigation = useNavigation<NavigationProp<any>>();
  const [user, setUser] = useState<UserInfoResponse | null>(null);


  useEffect(() => {
    console.log(scaleName, description)
    const fetchUserInfo = async () => {
      const data = await getUserInfo();
      setUser(data);
    };
    fetchUserInfo();
  }, []);

  const nickname = user?.username ?? "우웅";

  const sectionText = () => {
    if (scaleName === "가벼운 우울증") {
      return "우울감이 조금 있지만 걱정할 정도는 아니에요 가벼운 퀘스트를 통해 극복해 볼까요?"
    } else if (scaleName === "중간정도 우울증") {
      return "우울감이 다소 있는 편이에요! 다른 검사를 통해 한번 다시 우울감을 테스트 해볼까요?"
    }
    else if (scaleName === "심한 우울증")
      return "우울감이 많은 편리에요! 주변에 상담센터에서 상담을 한번 받아보시는 건 어떨까요?"
    else if (scaleName === "불안 시사됨") {
      return "불안 증상이 나타나고 있어요! 주변에 상담센터에서 상담을 한번 받아보시는 건 어떨까요?"
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#1BA663" }}>
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-circle" size={40} color="white" />
      </TouchableOpacity>

      <Text style={styles.headerText}>검사 결과</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.resultBox}>
          <Text style={styles.title}>
            현재 <Text style={styles.name}>{nickname}</Text>님의 상태는...
          </Text>

          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>나의 현재 감정 지수는?</Text>
            <ProgressChart
              data={{
                labels: [],
                data: [depressionLevel],
              }}
              width={width * 0.6}
              height={width * 0.6}
              strokeWidth={width * 0.04}
              radius={width * 0.18}
              chartConfig={{
                backgroundGradientFrom: "#F9F9EB",
                backgroundGradientTo: "#F9F9EB",
                color: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
              }}
              hideLegend={true}
              style={styles.chart}
            />
            <Text style={styles.percentText}>
              {Math.round(depressionLevel * 100)}%
            </Text>
          </View>

          <Text style={styles.status}>{scaleName}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              지금 내가 겪을 수 있는 상황과 생각은?
            </Text>
            <Text style={styles.sectionText}>{description}</Text>
          </View>
          {
            scaleName === "정상" ?
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>너무 잘하고 있어요!</Text>
                <Text style={styles.sectionText}>
                  오늘의 기분 좋은 일을 기록 해보는선 어때요
                </Text>
              </View>
              :
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>해결할 수 있어요!</Text>
                <Text style={styles.sectionText}>
                  {sectionText()}
                </Text>
              </View>
          }
          <View>
            <Text style={styles.warn}>
              ※ 이 결과는 자가진단을 바탕으로 제공된 참고용 정보입니다. 정확한 진단과 치료를 위해 정신건강 전문의와의 상담을 권장합니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DepressionResultScreen;