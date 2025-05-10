import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DepressionResultScreen = () => {
  const depressionLevel = 0.7; // 70%
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={{ flex: 1, backgroundColor: "#1BA663" }}>
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={() => navigation.navigate("FormalDiagnsis")}
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
            현재 <Text style={styles.name}>구슬이</Text>님의 상태는...
          </Text>

          <View style={styles.chartWrapper}>
            <ProgressChart
              data={{
                labels: [],
                data: [depressionLevel],
              }}
              width={screenWidth * 0.6}
              height={screenWidth * 0.6}
              strokeWidth={screenWidth * 0.04}
              radius={screenWidth * 0.18}
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

          <Text style={styles.status}>다소 우울한 상태예요 😢</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              지금 내가 겪을 수 있는 상황과 생각은?
            </Text>
            <Text style={styles.sectionText}>
              이유없이 눈물이 나거나 평소보다 잠을 잘 자지 못하거나 설치는 경우가 많아요
            </Text>
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

const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: "#1BA663",
    },
    container: {
      top: screenWidth * 0.02,
      alignItems: "center",
      backgroundColor: "#1BA663",
    },
    backButtonWrapper: {
      position: "absolute",
      left: screenWidth * 0.02,
      top: screenWidth * 0.09,
      padding: screenWidth * 0.05,
      zIndex: 11,
    },
    headerText: {
      marginTop: screenWidth * 0.15,
      marginBottom: screenWidth * 0.05,
      fontSize: screenWidth * 0.055,
      textAlign: "center",
      color: "#F9F9EB",
      fontWeight: "bold",
    },
    resultBox: {
      width: "85%",
      backgroundColor: "#F9F9EB",
      borderRadius: 20,
      padding: screenWidth * 0.05,
      alignItems: "center",
      elevation: 4,
    },
    title: {
      fontSize: screenWidth * 0.045,
      marginBottom: screenWidth * 0.02,
      textAlign: "left",
      alignSelf: "flex-start",
    },
    name: {
      fontWeight: "bold",
      color: "#4CAF50",
    },
    chartWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },
    chart: {
      position: "relative",
    },
    percentText: {
      position: "absolute",
      fontSize: screenWidth * 0.07,
      fontWeight: "bold",
      color: "#333",
    },
    status: {
      fontSize: screenWidth * 0.06,
      fontWeight: "bold",
      color: "#4CAF50",
      marginBottom: screenWidth * 0.05,
    },
    section: {
      width: "100%",
      marginTop: screenWidth * 0.05,
      marginBottom: screenWidth * 0.05,
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: screenWidth * 0.045,
      marginBottom: screenWidth * 0.015,
    },
    sectionText: {
      fontSize: screenWidth * 0.035,
      color: "#333",
      lineHeight: screenWidth * 0.05,
    },
    closeButton: {
      backgroundColor: "#4CAF50",
      width: screenWidth * 0.1,
      height: screenWidth * 0.1,
      borderRadius: screenWidth * 0.05,
      marginTop: screenWidth * 0.03,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  
