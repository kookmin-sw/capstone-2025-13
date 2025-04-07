import { ImageBackground, View } from "react-native";
import DialogueBox from "../../components/DialogueBox";
import DialogueChoice from "../../components/DialogueChoice";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { simpleDiagnosisScript } from "./simpleDiagnosisScript";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

const SimpleDiagnosis = () => {
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [score, setScore] = useState(0);

    const currentSegment = simpleDiagnosisScript[currentSegmentIndex];

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (currentSegment.type === "navigate" && currentSegment.navigateTo) {
            navigation.navigate(currentSegment.navigateTo as keyof RootStackParamList);
        }
    }, [currentSegment]);

    const handleChoice = (choiceIndex: number) => {
        const selectedChoice = currentSegment.options?.[choiceIndex];

        // 점수 누적
        if (selectedChoice && 'score' in selectedChoice) {
            setScore(prevScore => prevScore + selectedChoice.score);
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
            {currentSegment.type === "story" ?
                <DialogueBox
                    name={currentSegment.name || "Unknown"}
                    text={currentSegment.text || "No text available"}
                    onPress={() => {
                        if (currentSegment.type === "navigate" && currentSegment.navigateTo) {
                            navigation.navigate(currentSegment.navigateTo as keyof RootStackParamList);
                        } else {
                            setCurrentSegmentIndex(currentSegmentIndex + 1);
                        }
                    }}
                />
                :
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    {currentSegment.options?.map((option, index) => (
                        <DialogueChoice
                            key={index}
                            text={option.text}
                            onPress={() => handleChoice(index)}
                        />
                    ))}
                </View>

            }

        </ImageBackground>
    )
}

export default SimpleDiagnosis;