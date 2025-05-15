import React, { useEffect, useState } from "react";
import { View, TextInput, Text, ImageBackground, TouchableOpacity } from "react-native";
import styles from "../styles/recordInputBoxStyles";
import { createRecord, getRecord } from "../API/recordAPI";
import Toast from "react-native-toast-message";

type RecordInputBoxProps = {
    onRecordIdUpdate: (id: string) => void;
    onLuckyVickyUpdate: (luckyVicky: string) => void;
    setIsLoading: (loading: boolean) => void;
    setModalOpen: (isOpen: boolean) => void;
    isSubmmitAgreed: boolean;
    initialRecord?: string;
};

export default function RecordInputBox({ onRecordIdUpdate, onLuckyVickyUpdate, setIsLoading, setModalOpen, isSubmmitAgreed, initialRecord = "" }: RecordInputBoxProps) {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [submitRequested, setSubmitRequested] = useState<boolean>(false);

    const [record, setRecord] = useState<string>(initialRecord);

    useEffect(() => {
        setRecord(initialRecord);
        if (initialRecord) {
            setIsSubmitted(true);
        }
    }, [initialRecord]);

    const submitRecord = () => {
        if (!record) {
            Toast.show({
                type: 'error',
                text1: '저장 실패',
                text2: '내용을 입력해주세요',
                position: 'bottom',
            });
            return;
        }
        if (isSubmitted) return;

        setModalOpen(true);
        setSubmitRequested(true);
    };

    useEffect(() => {
        const processSubmission = async () => {
            if (!submitRequested || !isSubmmitAgreed) return;

            setIsLoading(true);
            setIsSubmitted(true);

            try {
                const createResponse = await createRecord(record);
                onRecordIdUpdate(createResponse.id);

                if (createResponse.status === "QUEUED") {
                    onLuckyVickyUpdate("이거 완전 럭키비키 잖아~");
                    let status = "QUEUED";
                    let getResponse;
                    const maxAttempts = 5;
                    let attempts = 0;

                    while (status !== "COMPLETED" && attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        getResponse = await getRecord(createResponse.id);
                        status = getResponse.status;
                        attempts++;
                    }

                    if (status === "COMPLETED") {
                        onLuckyVickyUpdate(getResponse.luckyVicky);
                    } else {
                        alert("응답 시간이 초과되었습니다. 나중에 다시 확인해주세요.");
                    }
                }
            } catch (error) {
                console.error("오류 발생:", error);
                Toast.show({
                    type: 'error',
                    text1: '저장 실패',
                    text2: '일기 제출 중 오류가 발생했습니다.  다시 시도해주세요.',
                    position: 'bottom',
                });
                setIsSubmitted(false);
            } finally {
                setIsLoading(false);
            }
        };

        processSubmission();
    }, [isSubmmitAgreed]);

    return (
        <View style={styles.wrapper}>
            <ImageBackground
                source={require("../assets/Images/record_input.png")}
                resizeMode="stretch"
                style={styles.imageBackground}
            >
                <TextInput
                    multiline
                    placeholder={`오늘 하루는 어땠어?\n오늘 있었던 일과 그때 느꼈던\n감정들에 대해 자유롭게 적어봐!`}
                    placeholderTextColor="#555"
                    style={styles.input}
                    value={record}
                    onChangeText={setRecord}
                    editable={!isSubmitted}
                />
                <TouchableOpacity
                    style={[styles.button, isSubmitted && { opacity: 0.5 }]}
                    onPress={submitRecord}
                    disabled={isSubmitted}
                >
                    <Text style={styles.buttontext}>일기 제출하기</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}
