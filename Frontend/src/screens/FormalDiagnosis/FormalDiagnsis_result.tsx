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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>해결할 수 있어요!</Text>
            <Text style={styles.sectionText}>
              가벼운 운동이나 하루 한 번 명상을 하는 것도 도움이 돼요
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DepressionResultScreen;