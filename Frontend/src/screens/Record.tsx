import React, { useState } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, Modal } from "react-native";
import Toast from 'react-native-toast-message';
import RecordHeader from "../components/RecordHeader";
import RecordInputBox from "../components/RecordInputBox";
import StarRating from "../components/StarRating";
import RecordChat from "../components/Record_chat";
import RecordEtc from "../components/Record_etc";
import styles from "../styles/recordStyles";
import { postRecord } from "../API/recordAPI";

export default function Record() {
    const [recordId, setRecordId] = useState<string>("");
    const [luckyVicky, setLuckyVicky] = useState<string>("이거 완전 럭키비키 잖아~");
    const [isLuckyLoading, setIsLuckyLoading] = useState<boolean>(false);
    const [recordEtcText, setRecordEtcText] = useState<string>("");
    const [rating, setRating] = useState(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmmitAgreed, setIsSubmitAgreed] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);

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
                type: 'error',
                text1: '저장 실패',
                text2: '별점을 입력해주세요',
                position: 'bottom',
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await postRecord(recordId, rating, recordEtcText);
            if (response) {
                setIsSaved(true);
                Toast.show({
                    type: 'success',
                    text1: '저장 완료',
                    text2: '일기가 성공적으로 저장되었습니다! 🎉',
                    position: 'bottom',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: '저장 실패',
                text2: '일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.',
                position: 'bottom',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <RecordHeader />
            <ScrollView contentContainerStyle={[styles.scroll, { alignItems: 'center' }]}>
                <StarRating onRecordEtcUpdate={handleRatingChange} />
                <RecordInputBox onRecordIdUpdate={handleRecordIdUpdate} onLuckyVickyUpdate={handleLuckyVickyUpdate} setIsLoading={setIsLuckyLoading} setModalOpen={setModalOpen} isSubmmitAgreed={isSubmmitAgreed} />
                <RecordChat luckyVicky={luckyVicky} isLoading={isLuckyLoading} />
                <RecordEtc onRecordEtcUpdate={setRecordEtcText} />
                <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={isSaved || isLoading}>
                    <Image
                        source={require("../assets/Images/save_bttn.png")}
                        style={[
                            styles.submitButtonImg,
                            (isSaved || isLoading) && { opacity: 0.5 }
                        ]}
                    />
                </TouchableOpacity>
                <Modal
                    visible={modalOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalOpen(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>일기 제출은 한 번만 가능해!{'\n'}정말 다 쓴 거 맞지?</Text>
                            <View style={styles.modalButtonGroup}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setIsSubmitAgreed(true);
                                        setModalOpen(false);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>맞아</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: "#D8BDA1" }]}
                                    onPress={() => setModalOpen(false)}
                                >
                                    <Text style={styles.modalButtonText}>아니야</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}


// 한번만 일기 제출하게 수정, css 수정, 최종 테스트트

