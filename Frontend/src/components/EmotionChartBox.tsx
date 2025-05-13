import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import styles from "../styles/emotionChartBoxStyles";
import dialogueStyles from "../styles/formalDialogueStyles";
import { useDiagnosisColor } from "../hooks/useDiagnosisColor";

interface EmotionChartData {
    diagnosisId: number;
    data: number[];
    dates: string[];
}

interface EmotionChartBoxProps {
    subtitle: string;
    data: EmotionChartData[];
}

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 0.85;
const chartHeight = screenWidth * 0.5;

export default function EmotionChartBox({ subtitle, data }: EmotionChartBoxProps) {
    const getIconColor = useDiagnosisColor();
    // x축 라벨(가장 긴 dates 배열 사용)
    const labels =
        data.length > 0
            ? data.reduce((a, b) => (a.dates.length > b.dates.length ? a : b)).dates
            : [];

    // datasets 생성 (각 진단별로 색상 다르게)
    const datasets = data.map((d) => ({
        data: d.data,
        color: (opacity = 1) => getIconColor(d.diagnosisId),
        strokeWidth: 3,
    }));
    if (!data || data.length === 0) {
        <View style={styles.wrapper}>
            <View style={styles.box}>
                <Text style={styles.emptyText}>최근 진단 결과가 없어요!</Text>
            </View>
        </View>
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.box}>
                <LineChart
                    data={{
                        labels,
                        datasets,
                    }}
                    width={chartWidth}
                    height={chartHeight}
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    withInnerLines={true}
                    withOuterLines={false}
                    withShadow={false}
                    chartConfig={{
                        backgroundColor: "#E9F8ED",
                        backgroundGradientFrom: "#E9F8ED",
                        backgroundGradientTo: "#E9F8ED",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
                        style: { borderRadius: 20 },
                        propsForDots: {
                            r: "5",
                            strokeWidth: "2",
                            stroke: "#fff",
                        },
                    }}
                    style={{
                        borderRadius: 20,
                        backgroundColor: "#E9F8ED", // box와 동일
                        paddingLeft: 0,    // 시작점 여백
                        paddingRight: 20,   // 끝점 여백
                    }}
                />
            </View>
            <Text style={dialogueStyles.chartSubtitle}>{subtitle}</Text>
        </View>
    );
}
