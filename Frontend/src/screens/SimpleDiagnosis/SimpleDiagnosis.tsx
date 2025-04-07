import { ImageBackground, View } from "react-native";
import DialogueBox from "../../components/DialogueBox";
import DialogueChoice from "../../components/DialogueChoice";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { simpleDiagnosisScript } from "./simpleDiagnosisScript";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp, useRoute } from "@react-navigation/native";
import DialogueQuestionBox from "../../components/DialogueQuestionBox";

type SimpleDiagnosisRouteProp = RouteProp<RootStackParamList, 'SimpleDiagnosis'>;

const SimpleDiagnosis = () => {
    const route = useRoute<SimpleDiagnosisRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const nickname = route.params?.nickname ?? null;
    const birthdate = route.params?.birthdate ?? null;
    const gender = route.params?.gender ?? null;

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
        options?: { text: string; score?: number; nextIndex?: number; nextType?: "navigate" | "story" | "options"; navigateTo?: any }[];
        backgroundImage?: any;
        name?: string;
        text?: string;
    };

    const buildParams = (baseParams: any = {}) => ({
        ...baseParams,
        ...(nickname && { nickname }),
        ...(birthdate && { birthdate }),
        ...(gender && { gender }),
    });

    useEffect(() => {
        if (
            currentSegment.type === "navigate" &&
            currentSegment.navigateTo &&
            typeof currentSegment.navigateTo === 'object' &&
            'screen' in currentSegment.navigateTo &&
            'params' in currentSegment.navigateTo
        ) {
            navigation.navigate(
                currentSegment.navigateTo.screen,
                buildParams(currentSegment.navigateTo.params)
            );
        }
    }, [currentSegment]);

    const handleChoice = (choiceIndex: number) => {
        const selectedChoice = currentSegment.options?.[choiceIndex];

        if (selectedChoice && 'score' in selectedChoice) {
            setScore(prevScore => prevScore + (selectedChoice.score ?? 0));
        }

        if (selectedChoice && selectedChoice.nextIndex !== undefined) {
            setCurrentSegmentIndex(selectedChoice.nextIndex);
        }
    };

    return (
        <ImageBackground
            source={currentSegment.backgroundImage || require("../../assets/Images/simple-1.png")}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            resizeMode="cover"
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
                                    buildParams({ initialIndex: currentSegmentIndex + 1 })
                                );
                            } else if (typeof navigateTo === "object" && "screen" in navigateTo) {
                                const to = navigateTo as { screen: keyof RootStackParamList; params?: any };
                                navigation.navigate(to.screen, buildParams(to.params));
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
                    {currentSegmentIndex === 35 ?
                        <DialogueQuestionBox /> : <></>}
                    {currentSegment.options && (
                        <DialogueChoice
                            options={currentSegment.options || []}
                            onSelect={(option) => {
                                if (option.nextType === "navigate" && option.navigateTo) {
                                    navigation.navigate(
                                        option.navigateTo.screen || option.navigateTo,
                                        buildParams(option.navigateTo.params || {})
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
    );
};

export default SimpleDiagnosis;
