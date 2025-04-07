import { ImageBackground, View } from "react-native";
import DialogueBox from "../../components/DialogueBox";
import DialogueChoice from "../../components/DialogueChoice";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { simpleDiagnosisScript } from "./simpleDiagnosisScript";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp, useRoute } from "@react-navigation/native";

type SimpleDiagnosisRouteProp = RouteProp<RootStackParamList, 'SimpleDiagnosis'>;

const SimpleDiagnosis = () => {
    const route = useRoute<SimpleDiagnosisRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (route.params?.initialIndex !== undefined) {
            setCurrentSegmentIndex(route.params.initialIndex);
        }
    }, [route.params?.initialIndex]);


    const currentSegment = simpleDiagnosisScript[currentSegmentIndex] as {
        type: "navigate" | "story";
        navigateTo?: { screen: keyof RootStackParamList; params: any };
        options?: { text: string; score?: number; nextIndex?: number }[];
        backgroundImage?: any;
        name?: string;
        text?: string;
    };

    useEffect(() => {
        if (
            currentSegment.type === "navigate" &&
            currentSegment.navigateTo &&
            typeof currentSegment.navigateTo === 'object' &&
            'screen' in currentSegment.navigateTo &&
            'params' in currentSegment.navigateTo
        ) {
            navigation.navigate(currentSegment.navigateTo.screen, currentSegment.navigateTo.params);
        }

    }, [currentSegment]);

    const handleChoice = (choiceIndex: number) => {
        const selectedChoice = currentSegment.options?.[choiceIndex];

        // 점수 누적
        if (selectedChoice && 'score' in selectedChoice) {
            setScore(prevScore => prevScore + (selectedChoice.score ?? 0));
        }

        // 다음으로 이동
        if (selectedChoice && selectedChoice.nextIndex !== undefined) {
            setCurrentSegmentIndex(selectedChoice.nextIndex);
        }
    };
    return (
        <ImageBackground
            source={currentSegment.backgroundImage || require("../../assets/Images/simple-1.png")}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            resizeMode="cover" // 이미지 크기 조절 (cover, contain 등 가능)
        >
            {currentSegment.type === "story" ? (
                <DialogueBox
                    name={currentSegment.name || "Unknown"}
                    text={currentSegment.text || "No text available"}
                    onPress={() => {
                        const nextSegment = simpleDiagnosisScript[currentSegmentIndex + 1];

                        if (nextSegment?.type === "navigate" && nextSegment.navigateTo) {
                            const navigateTo = nextSegment.navigateTo;
                            if (typeof navigateTo === "string") {
                                navigation.navigate(
                                    navigateTo as "SimpleDiagnosis",
                                    { initialIndex: currentSegmentIndex + 1 }
                                );
                            } else if (typeof navigateTo === "object" && "screen" in navigateTo) {
                                navigation.navigate((navigateTo as { screen: keyof RootStackParamList; params: any }).screen, (navigateTo as { screen: keyof RootStackParamList; params: any }).params);
                            }
                        } else {
                            setCurrentSegmentIndex(currentSegmentIndex + 1);
                        }
                    }}

                />
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    {currentSegment.options && (
                        <DialogueChoice
                            options={currentSegment.options || []}
                            onSelect={(option) => {
                                if (option.nextType === "navigate" && option.navigateTo) {
                                    navigation.navigate(
                                        (option.navigateTo as any).screen || option.navigateTo,
                                        (option.navigateTo as any).params || undefined
                                    );
                                } else if (option.nextType === "story" && typeof option.nextIndex === "number") {
                                    setCurrentSegmentIndex(option.nextIndex);
                                }
                            }}
                        />
                    )}
                </View>
            )}


        </ImageBackground>
    )
}

export default SimpleDiagnosis;