import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/formalDiagnsisResultStyles";
import { getDiagnosisSpecificResult } from "../API/diagnosisAPI";

const { width } = Dimensions.get("window");

interface Props {
    visible: boolean;
    onClose: () => void;
    id: string | number;
}

interface ScaleDescription {
    start: number;
    scaleName: string;
    description: string;
}

interface DiagnosisResult {
    result: number;
    scale: number;
    createdAt: string;
    max_score: number;
    scale_description: ScaleDescription[];
}

const DepressionResultModal: React.FC<Props> = ({ visible, onClose, id }) => {
    const [data, setData] = useState<DiagnosisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [computedResult, setComputedResult] = useState<{
        score: number;
        totalScore: number;
        scaleName: string;
        description: string;
        createdAt: string;
        max_score: number;
    } | null>(null);

    // 우울 점수에 따른 scaleName과 설명 추출
    const findScaleInfo = (score: number, scales: ScaleDescription[]) => {
        const sorted = [...scales].sort((a, b) => b.start - a.start);
        return sorted.find(desc => score >= desc.start) || sorted[sorted.length - 1];
    };

    useEffect(() => {
        if (!id || !visible) return;

        const fetchDiagnosisResult = async () => {
            setLoading(true);
            try {
                const response = await getDiagnosisSpecificResult(id);
                console.log("진단 결과 데이터:", response);

                if (response) {
                    const { result, scale, scale_description, createdAt } = response;  // 바로 사용
                    const matchedScale = findScaleInfo(result, scale_description);

                    setData(response);
                    setComputedResult({
                        score: result,
                        totalScore: scale,
                        scaleName: matchedScale.scaleName,
                        max_score: response.max_score,
                        description: matchedScale.description,
                        createdAt: createdAt
                    });
                }
            } catch (error) {
                console.error("진단 결과 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnosisResult();
    }, [id, visible]);

    let formattedDate = "현재";
    if (computedResult?.createdAt) {
        const date = new Date(computedResult.createdAt);
        if (!isNaN(date.getTime())) {
            formattedDate = new Intl.DateTimeFormat('ko-KR', {
                month: 'long',
                day: 'numeric'
            }).format(date);
        }
    }


    if (!visible) return null;

    if (loading || !computedResult || !data) {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.4)",
                }}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            </Modal>
        );
    }

    const { result, scale, max_score } = data;
    const { scaleName, description } = computedResult;
    const depressionLevel = scale === 0 ? 0 : result / max_score;
    // 고쳐야 함


    const actionSuggestion = () => {
        switch (scaleName) {
            case "가벼운 우울증":
                return "우울감이 조금 있지만 걱정할 정도는 아니에요. 가벼운 퀘스트를 통해 극복해 볼까요?";
            case "중간정도 우울증":
                return "우울감이 다소 있는 편이에요! 다른 검사를 통해 다시 테스트 해볼까요?";
            case "심한 우울증":
            case "불안 시사됨":
                return "우울감이나 불안이 많아요. 주변 상담센터에서 상담을 받아보시는 건 어떨까요?";
            default:
                return "";
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <View style={[
                    styles.resultBox,
                    {
                        backgroundColor: "#F9F9EB",
                        borderRadius: 20,
                        padding: 20,
                        width: width * 0.9,
                        maxHeight: "90%",
                    },
                ]}>
                    <TouchableOpacity
                        style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                        onPress={onClose}
                    >
                        <Ionicons name="close-circle" size={30} color="#666" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.chartWrapper}>
                            <Text style={styles.chartTitle}>나의 {formattedDate} 감정 지수는?</Text>
                            <View style={{
                                width: width * 0.6,
                                height: width * 0.6,
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}>
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
                                    hideLegend
                                    style={styles.chart}
                                />
                                <Text style={styles.percentText}>
                                    {isNaN(depressionLevel) ? "-" : `${Math.round(depressionLevel * 100)}%`}
                                </Text>

                            </View>
                        </View>

                        <Text style={styles.status}>{scaleName}</Text>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                지금 내가 겪을 수 있는 상황과 생각은?
                            </Text>
                            <Text style={styles.sectionText}>{description}</Text>
                        </View>

                        {scaleName === "정상" ? (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>너무 잘하고 있어요!</Text>
                                <Text style={styles.sectionText}>
                                    오늘의 기분 좋은 일을 기록해보는 건 어때요?
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>해결할 수 있어요!</Text>
                                <Text style={styles.sectionText}>{actionSuggestion()}</Text>
                            </View>
                        )}

                        <Text style={styles.warn}>
                            ※ 이 결과는 자가진단을 바탕으로 제공된 참고용 정보입니다.
                            정확한 진단과 치료를 위해 정신건강 전문의와의 상담을 권장합니다.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default DepressionResultModal;
