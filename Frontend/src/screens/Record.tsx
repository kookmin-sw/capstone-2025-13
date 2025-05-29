import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";
import RecordHeader from "../components/Record/RecordHeader";
import RecordInputBox from "../components/Record/RecordInputBox";
import StarRating from "../components/Record/StarRating";
import RecordChat from "../components/Record/Record_chat";
import RecordEtc from "../components/Record/Record_etc";
import styles from "../styles/Record/recordStyles";
import fonts from "../constants/fonts";
import { getRecordMe, postRecord } from "../API/recordAPI";
import { getCoupon } from "../API/potAPI";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useLoading } from "../API/contextAPI";

export default function Record() {
    const route = useRoute<RouteProp<RootStackParamList, "Record">>();
    const { showLoading, hideLoading } = useLoading();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const date = route.params?.date ?? "";

    const [recordId, setRecordId] = useState<string>("");
    const [luckyVicky, setLuckyVicky] =
        useState<string>("이거 완전 럭키비키잖아~");
    const [isLuckyLoading, setIsLuckyLoading] = useState<boolean>(false);
    const [recordText, setRecordText] = useState<string>("");
    const [recordEtcText, setRecordEtcText] = useState<string>("");
    const [rating, setRating] = useState(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmmitAgreed, setIsSubmitAgreed] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const finalDate = date || formattedDate;
    const title = finalDate === formattedDate ? "오늘의 하루" : "그날의 하루";

    const defaultLuckyText = "이거 완전 럭키비키잖아~";

    useEffect(() => {
        const fetchRecord = async () => {
            showLoading();
            try {
                const targetDate = date || formattedDate;
                const response = await getRecordMe(targetDate);
                console.log(response);
                setRecordText(response.data || "");
                setIsSaved(response.status === "COMPLETED");
                setRecordId(response.id || "");
                setRating(response.rate || 0);
                setRecordEtcText(response.comment || "");
                setLuckyVicky(response.luckyVicky || "");
            } catch (error) {
            } finally {
                hideLoading();
            }
        };
        fetchRecord();
    }, [formattedDate]);

    const handleRecordIdUpdate = (id: string) => {
        setRecordId(id);
    };
    const handleLuckyVickyUpdate = (luckyVicky: string) => {
        setLuckyVicky(luckyVicky);
    };
    const handleRatingChange = (rating: number) => {
        setRating(rating);
    };

    const handleSave = async () => {
        if (rating === 0) {
            Toast.show({
                type: "error",
                text1: "저장 실패",
                text2: "별점을 입력해주세요",
                position: "bottom",
            });
            return;
        }
        showLoading();
        setIsLoading(true);
        try {
            const response = await postRecord(recordId, rating, recordEtcText);
            if (response) {
                setIsSaved(true);
                Toast.show({
                    type: "success",
                    text1: "저장 완료",
                    text2: "일기가 성공적으로 저장되었습니다! 🎉",
                    position: "bottom",
                });
                await getCoupon();
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "저장 실패",
                text2: "일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
                position: "bottom",
            });
        } finally {
            setIsLoading(false);
            hideLoading();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                contentContainerStyle={[
                    styles.scroll,
                    { alignItems: "center" },
                ]}
            >
                <View style={styles.container}>
                    <RecordHeader title={title} date={finalDate} />
                    <ScrollView
                        contentContainerStyle={[
                            styles.scroll,
                            { alignItems: "center", flexGrow: 1 },
                        ]}
                        keyboardShouldPersistTaps="handled"
                    >
                        <StarRating
                            onRecordEtcUpdate={handleRatingChange}
                            initialRating={rating}
                        />
                        <RecordInputBox
                            initialRecord={recordText}
                            onRecordIdUpdate={handleRecordIdUpdate}
                            onLuckyVickyUpdate={handleLuckyVickyUpdate}
                            setIsLoading={setIsLoading}
                            setModalOpen={setModalOpen}
                            isSubmmitAgreed={isSubmmitAgreed}
                        />
                        <RecordChat
                            luckyVicky={luckyVicky}
                            isLoading={isLuckyLoading}
                        />
                        {!isLuckyLoading && luckyVicky !== defaultLuckyText && (
                            <RecordEtc
                                onRecordEtcUpdate={setRecordEtcText}
                                initialEtcText={recordEtcText}
                                disabled={isSaved}
                            />
                        )}
                        <TouchableOpacity
                            style={[styles.submitButton, styles.saveButton]}
                            onPress={handleSave}
                            disabled={isSaved || isLoading}
                        >
                            <Text
                                style={[
                                    styles.submitButtonText,
                                    (isSaved || isLoading) && { opacity: 0.5 },
                                ]}
                            >
                                저 장
                            </Text>
                        </TouchableOpacity>
                        <Modal
                            visible={modalOpen}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setModalOpen(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContainer}>
                                    <Text
                                        style={[
                                            styles.modalText,
                                            { fontFamily: fonts.laundry },
                                        ]}
                                    >
                                        일기 제출은 한 번만 가능해!{"\n"}정말 다
                                        쓴 거 맞지?
                                    </Text>
                                    <View style={styles.modalButtonGroup}>
                                        <TouchableOpacity
                                            style={styles.modalButton}
                                            onPress={() => {
                                                setIsSubmitAgreed(true);
                                                setModalOpen(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.modalButtonText,
                                                    {
                                                        fontFamily:
                                                            fonts.laundry,
                                                    },
                                                ]}
                                            >
                                                맞아
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.modalButton,
                                                { backgroundColor: "#D8BDA1" },
                                            ]}
                                            onPress={() => setModalOpen(false)}
                                        >
                                            <Text
                                                style={[
                                                    styles.modalButtonText,
                                                    {
                                                        fontFamily:
                                                            fonts.laundry,
                                                    },
                                                ]}
                                            >
                                                아니야
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
