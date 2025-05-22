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

// 예시 타입 (데이터 구조에 따라 수정)
interface DiagnosisResult {
    score: number;
    totalScore: number;
    scaleName: string;
    description: string;
}

const DepressionResultModal: React.FC<Props> = ({
    visible,
    onClose,
    id,
}) => {
    const [data, setData] = useState<DiagnosisResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id || !visible) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getDiagnosisSpecificResult(id);
                console.log("진단 결과 데이터:", response);
                // setData(response);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, visible]);

    if (!visible) return null;

    if (loading || !data) {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            </Modal>
        );
    }

    const { score, totalScore, scaleName, description } = data;
    const depressionLevel = score / totalScore;

    const sectionText = () => {
        if (scaleName === "가벼운 우울증") {
            return "우울감이 조금 있지만 걱정할 정도는 아니에요. 가벼운 퀘스트를 통해 극복해 볼까요?";
        } else if (scaleName === "중간정도 우울증") {
            return "우울감이 다소 있는 편이에요! 다른 검사를 통해 한번 다시 우울감을 테스트 해볼까요?";
        } else if (scaleName === "심한 우울증") {
            return "우울감이 많은 편이에요! 주변에 상담센터에서 상담을 한번 받아보시는 건 어떨까요?";
        } else if (scaleName === "불안 시사됨") {
            return "불안 증상이 나타나고 있어요! 주변에 상담센터에서 상담을 한번 받아보시는 건 어떨까요?";
        } else {
            return "";
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={[
                        styles.resultBox,
                        {
                            backgroundColor: "#F9F9EB",
                            borderRadius: 20,
                            padding: 20,
                            width: width * 0.9,
                            maxHeight: "90%",
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                        onPress={onClose}
                    >
                        <Ionicons name="close-circle" size={30} color="#666" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* <Text style={styles.title}>
                            현재 <Text style={styles.name}>{nickname}</Text>님의 상태는...
                        </Text> */}

                        <View style={styles.chartWrapper}>
                            <Text style={styles.chartTitle}>나의 현재 감정 지수는?</Text>
                            <View
                                style={{
                                    width: width * 0.6,
                                    height: width * 0.6,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                }}
                            >
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
                                    {Math.round(depressionLevel * 100)}%
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
                                    오늘의 기분 좋은 일을 기록 해보는건 어때요?
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>해결할 수 있어요!</Text>
                                <Text style={styles.sectionText}>{sectionText()}</Text>
                            </View>
                        )}

                        <Text style={styles.warn}>
                            ※ 이 결과는 자가진단을 바탕으로 제공된 참고용 정보입니다. 정확한 진단과 치료를 위해 정신건강 전문의와의 상담을 권장합니다.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default DepressionResultModal;
