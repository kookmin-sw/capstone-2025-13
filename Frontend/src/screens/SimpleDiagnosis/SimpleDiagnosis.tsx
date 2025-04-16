import { ImageBackground, View } from "react-native";
import DialogueBox from "../../components/DialogueBox";
import DialogueChoice from "../../components/DialogueChoice";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { SimpleDiagnosisScript } from "./simpleDiagnosisScript";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { RouteProp, useRoute } from "@react-navigation/native";
import DialogueQuestionBox from "../../components/DialogueQuestionBox";

type SimpleDiagnosisRouteProp = RouteProp<
    RootStackParamList,
    "SimpleDiagnosis"
>;

const SimpleDiagnosis = () => {
    const route = useRoute<SimpleDiagnosisRouteProp>();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const nickname = route.params?.nickname ?? null;
    const birthDate = route.params?.birthDate ?? null;
    const gender = route.params?.gender ?? null;
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [score, setScore] = useState(route.params?.score ?? 0);

    const script = SimpleDiagnosisScript({ nickname });

    useEffect(() => {
        if (route.params?.initialIndex !== undefined) {
            setCurrentSegmentIndex(route.params.initialIndex);
        }
    }, [route.params?.initialIndex]);

    const currentSegment = script[currentSegmentIndex] as {
        type: "navigate" | "story";
        navigateTo?: { screen: keyof RootStackParamList; params: any };
        options?: {
            text: string;
            score?: number;
            nextIndex?: number;
            nextType?: "navigate" | "story" | "options";
            navigateTo?: any;
        }[];
        backgroundImage?: any;
        name?: string;
        text?: string;
    };

    const buildParams = (baseParams: any = {}) => ({
        ...baseParams,
        ...(nickname && { nickname }),
        ...(birthDate && { birthDate }),
        ...(gender !== null && { gender }),
        ...(score !== undefined && { score }),
    });

    useEffect(() => {
        if (
            currentSegment.type === "navigate" &&
            currentSegment.navigateTo &&
            typeof currentSegment.navigateTo === "object" &&
            "screen" in currentSegment.navigateTo &&
            "params" in currentSegment.navigateTo
        ) {
            navigation.navigate(
                currentSegment.navigateTo.screen,
                buildParams(currentSegment.navigateTo.params)
            );
        }
    }, [currentSegment]);

    useEffect(() => {
        if (route.params?.initialIndex !== undefined) {
            setCurrentSegmentIndex(route.params.initialIndex);
        }
        if (route.params?.score !== undefined) {
            setScore(route.params.score);
        }
    }, [route.params?.initialIndex, route.params?.score]);

    return (
        <ImageBackground
            source={
                currentSegment.backgroundImage ||
                require("../../assets/Images/simple-1.png")
            }
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            resizeMode="cover"
        >
            {currentSegment.type === "story" ? (
                <DialogueBox
                    name={currentSegment.name || "Unknown"}
                    text={currentSegment.text || "No text available"}
                    onPress={() => {
                        const nextIndex =
                            currentSegmentIndex === 21
                                ? 23
                                : currentSegmentIndex + 1;
                        const nextSegment = script[nextIndex];

                        if (
                            nextSegment?.type === "navigate" &&
                            nextSegment.navigateTo
                        ) {
                            const navigateTo = nextSegment.navigateTo;
                            if (typeof navigateTo === "string") {
                                navigation.navigate(
                                    navigateTo as "SimpleDiagnosis",
                                    buildParams({ initialIndex: nextIndex })
                                );
                            } else if (
                                typeof navigateTo === "object" &&
                                "screen" in navigateTo
                            ) {
                                const to = navigateTo as {
                                    screen: keyof RootStackParamList;
                                    params?: any;
                                };
                                navigation.navigate(
                                    to.screen,
                                    buildParams({
                                        ...(to.params || {}),
                                        score: score,
                                    })
                                );
                            }
                        } else {
                            setCurrentSegmentIndex(nextIndex);
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
                    {currentSegmentIndex === 35 ? (
                        <DialogueQuestionBox />
                    ) : (
                        <></>
                    )}
                    {currentSegment.options && (
                        <DialogueChoice
                            options={currentSegment.options || []}
                            onSelect={(option) => {
                                if (typeof option.score === "number") {
                                    setScore(
                                        (prev) =>
                                            prev +
                                            (option.score !== undefined
                                                ? option.score
                                                : 0)
                                    );
                                }

                                if (
                                    option.nextType === "navigate" &&
                                    option.navigateTo
                                ) {
                                    navigation.navigate(
                                        option.navigateTo.screen ||
                                            option.navigateTo,
                                        buildParams(
                                            option.navigateTo.params || {}
                                        )
                                    );
                                } else if (
                                    typeof option.nextIndex === "number"
                                ) {
                                    setCurrentSegmentIndex(option.nextIndex);
                                } else {
                                    setCurrentSegmentIndex(
                                        currentSegmentIndex + 1
                                    );
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
